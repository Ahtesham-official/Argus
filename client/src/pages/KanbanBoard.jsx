import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './KanbanBoard.css';

const initialCards = [
  { id: 1, col: 0, risk: 'green', code: '#CLM-991', name: 'Sofiya Gowda', clinic: 'Apollo Clinic Bengaluru', amount: '₹45,000' },
  { id: 2, col: 0, risk: 'yellow', code: '#CLM-992', name: 'Adityapratap Singh', clinic: 'Fortis Healthcare Delhi', amount: '₹95,000' },
  { id: 3, col: 1, risk: 'green', code: '#CLM-988', name: 'Rajdeep Yadav', clinic: 'AIIMS Hospital Bengaluru', extra: 'Rule #1 Checked: Clean', amount: '₹1,45,000' },
  { id: 4, col: 2, risk: 'yellow', code: '#CLM-974', name: 'Ayush Chaudhary', clinic: 'City Care Clinic Mumbai', extra: 'Flag: IPD date collision with Claim #9102', amount: '₹2,10,000' },
  { id: 5, col: 3, risk: 'red', code: '#CLM-842', name: 'Ahtesham Shaikh', clinic: 'Care Hospital Hyderabad', extra: 'Rule #4 Triggered: Unbundled Surgery', amount: '₹2,45,000' },
  { id: 6, col: 4, risk: 'green', code: '#CLM-901', name: 'Urvi Dhakate', clinic: 'Max Hospital Kolkata', extra: 'Zero-shot LOINC Map Verified', amount: '₹95,000' },
];

const columns = [
  { id: 0, title: 'Submitted', color: 'bg-blue-500' },
  { id: 1, title: 'Processing', color: 'bg-purple-500' },
  { id: 2, title: 'Flagged / Review', color: 'bg-yellow-500' },
  { id: 3, title: 'Investigation', color: 'bg-red-500' },
  { id: 4, title: 'Approved', color: 'bg-green-500' },
];

const KanbanBoard = () => {
  const [riskFilter, setRiskFilter] = useState('all');
  const [cards, setCards] = useState(initialCards);

  const handleMoveCard = (id) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        if (card.col < columns.length - 1) {
          return { ...card, col: card.col + 1 };
        } else {
          alert("Claim reached final stage!");
        }
      }
      return card;
    }));
  };

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('cardId'), 10);
    if (!isNaN(cardId)) {
      setCards(cards.map(card => card.id === cardId ? { ...card, col: colId } : card));
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
