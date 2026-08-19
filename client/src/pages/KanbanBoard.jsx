import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './KanbanBoard.css';

// initialCards removed in favor of dynamic API fetch

const columns = [
  { id: 0, title: 'Submitted', color: 'bg-blue-500' },
  { id: 1, title: 'Processing', color: 'bg-purple-500' },
  { id: 2, title: 'Flagged / Review', color: 'bg-yellow-500' },
  { id: 3, title: 'Investigation', color: 'bg-red-500' },
  { id: 4, title: 'Approved', color: 'bg-green-500' },
];

const KanbanBoard = () => {
  const [riskFilter, setRiskFilter] = useState('all');
  const [cards, setCards] = useState([]);

  React.useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { default: api } = await import('../api/client');
        const data = await api.get('/claims');
        const mapped = data.claims.map(c => {
          let risk = 'green';
          if (c.riskBand === 'MEDIUM') risk = 'yellow';
          if (c.riskBand === 'HIGH' || c.riskBand === 'CRITICAL') risk = 'red';

          let col = 0; // submitted
          if (c.kanbanColumn === 'processing') col = 1;
          if (c.kanbanColumn === 'flagged') col = 2;
          if (c.kanbanColumn === 'investigation') col = 3;
          if (c.kanbanColumn === 'approved') col = 4;

          return {
            id: c.claimId,
            col,
            risk,
            code: `#${c.claimId.split('-')[0].substring(0, 6)}`,
            name: c.patientName || c.patientId,
            clinic: c.providerName || c.providerId,
            amount: `₹${Number(c.billedAmount).toLocaleString()}`,
            extra: c.anomalyDescription || c.aiRecommendation?.replace(/_/g, ' ') || null
          };
        });
        setCards(mapped);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      }
    };
    fetchClaims();
  }, []);

  const updateCardColumn = async (cardId, newColId) => {
    try {
      const colToKanban = {
        0: 'submitted',
        1: 'processing',
        2: 'flagged',
        3: 'investigation',
        4: 'approved'
      };
      const kanbanColumn = colToKanban[newColId];
      
      const { default: api } = await import('../api/client');
      await api.patch(`/claims/${cardId}/status`, { kanbanColumn });
      
      setCards(cards.map(card => card.id === cardId ? { ...card, col: newColId } : card));
    } catch (err) {
      console.error("Failed to update claim column:", err);
      alert("Failed to update claim status in backend.");
    }
  };

  const handleMoveCard = (id) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      if (card.col < columns.length - 1) {
        updateCardColumn(id, card.col + 1);
      } else {
        alert("Claim reached final stage!");
      }
    }
  };

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      updateCardColumn(cardId, colId);
    }
  };

  const isVisible = (risk) => riskFilter === 'all' || riskFilter === risk;

  const renderCard = (card) => {
    if (!isVisible(card.risk)) return null;
    
    let riskLabel, riskColor, riskBorder;
    if (card.risk === 'green') {
      riskLabel = card.col === 4 ? '🟢 Auto-Approved' : '🟢 Low Risk';
      riskColor = 'bg-green-100 text-green-800';
      riskBorder = card.col === 4 ? 'border-l-4 border-green-500' : 'border-gray-100';
    } else if (card.risk === 'yellow') {
      riskLabel = card.col === 2 ? '🟡 Overlapping Stay' : '🟡 Med Risk';
      riskColor = 'bg-yellow-100 text-yellow-800';
      riskBorder = card.col === 2 ? 'border-l-4 border-yellow-500' : 'border-gray-100';
    } else {
      riskLabel = '🔴 High Risk';
      riskColor = 'bg-red-100 text-red-800';
      riskBorder = card.col === 3 ? 'border-l-4 border-red-500' : 'border-gray-100';
    }

    return (
      <div 
        key={card.id} 
        draggable
        onDragStart={(e) => handleDragStart(e, card.id)}
        className={`kanban-card p-3 space-y-2 cursor-pointer bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${riskBorder}`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskColor}`}>{riskLabel}</span>
          <span className="text-[10px] font-mono text-gray-400">{card.code}</span>
        </div>
        <h4 className="font-bold text-sm text-[#007979]">{card.name}</h4>
        <p className="text-xs text-gray-600">{card.clinic}</p>
        
        {card.extra && (
          <div className={`p-1.5 rounded text-[10px] font-mono ${card.risk === 'green' ? 'text-green-700 bg-green-50 font-semibold' : card.risk === 'yellow' ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
            {card.extra}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
          <span className="font-bold text-gray-900">{card.amount}</span>
          {card.col < 4 ? (
            card.col === 2 ? (
              <Link to="/investigator" className="text-amber-700 hover:underline font-bold text-[11px]">Investigate &rarr;</Link>
            ) : card.col === 3 ? (
              <Link to="/investigator" className="text-red-700 hover:underline font-bold text-[11px]">Workbench &rarr;</Link>
            ) : (
              <button onClick={() => handleMoveCard(card.id)} className="text-[#007979] hover:underline font-bold text-[11px]">Advance &rarr;</button>
            )
          ) : (
            <span className="text-green-700 font-bold text-[10px]">✓ Settled</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 max-w-full w-full mx-auto p-6 lg:p-8 space-y-6">
      {/* Title & Controls Bar */}
      <div className="command-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-[#007979]">view_kanban</span>
            <h2 className="text-2xl font-bold text-[#007979]">Claim Processing Lifecycle Kanban</h2>
          </div>
          <p className="text-sm text-[#007979]/80 mt-1">Primary visual lifecycle view (Submitted &rarr; Processing &rarr; Flagged &rarr; Investigation &rarr; Approved)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#FFDEC9] rounded-xl px-3 py-1.5 shadow-xs gap-2">
            <span className="text-xs font-bold text-[#007979]">Filter Risk:</span>
            <button onClick={() => setRiskFilter('all')} className={`text-xs px-2 py-0.5 rounded font-bold ${riskFilter === 'all' ? 'bg-[#007979] text-white' : 'text-gray-500'}`}>All</button>
            <button onClick={() => setRiskFilter('green')} className={`text-xs px-2 py-0.5 rounded font-bold ${riskFilter === 'green' ? 'bg-green-100 text-green-800' : 'text-gray-500'}`}>🟢 Low</button>
            <button onClick={() => setRiskFilter('yellow')} className={`text-xs px-2 py-0.5 rounded font-bold ${riskFilter === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500'}`}>🟡 Med</button>
            <button onClick={() => setRiskFilter('red')} className={`text-xs px-2 py-0.5 rounded font-bold ${riskFilter === 'red' ? 'bg-red-100 text-red-800' : 'text-gray-500'}`}>🔴 High</button>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {columns.map(col => {
          const colCards = cards.filter(c => c.col === col.id);
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="kanban-col p-3 space-y-3 min-w-[250px]"
            >
              <div className="flex justify-between items-center px-1 pb-2 border-b border-gray-200">
                <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.color}`}></span> {col.title} ({colCards.filter(c => isVisible(c.risk)).length})
                </h3>
              </div>
              {colCards.map(card => renderCard(card))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
