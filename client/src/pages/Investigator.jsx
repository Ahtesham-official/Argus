import React, { useState } from 'react';
import './Investigator.css';

const initialClaims = [
  { id: 'CLM-98231', risk: 'low', patient: 'Sofiya Gowda', hospital: 'Lilavati Hospital, BKC Mumbai', amount: '₹ 1,24,000.00', score: 12, column: 'submitted' },
  { id: 'CLM-98235', risk: 'medium', patient: 'Adityapratap Singh', hospital: 'Ruby Hall Clinic, Pune', amount: '₹ 4,50,000.00', score: 45, column: 'submitted' },
  { id: 'CLM-98201', risk: 'low', patient: 'Rajdeep Yadav', hospital: 'Fortis Hospital, Vashi Navi Mumbai', amount: '₹ 85,000.00', score: 0, column: 'processing', status: 'Checking Billing...', progress: 65 },
  { id: 'CLM-98112', risk: 'critical', patient: 'Ahtesham Shaikh', hospital: 'Sahyadri Hospital, Pune', amount: '₹ 12,80,000.00', score: 89, column: 'flagged', anomaly: 'Duplicate procedure...' },
  { id: 'CLM-98005', risk: 'medium', patient: 'Ayush Chaudhary', hospital: 'Jupiter Hospital, Thane', amount: '₹ 3,20,000.00', score: 62, column: 'investigation' },
  { id: 'CLM-97992', risk: 'approved', patient: 'Rohan Patil', hospital: 'Apollo Clinic', amount: '₹ 15,000.00', score: 0, column: 'approved' },
];

const Investigator = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claims, setClaims] = useState(initialClaims);

  const handleDragStart = (e, claimId) => {
    e.dataTransfer.setData('claimId', claimId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const claimId = e.dataTransfer.getData('claimId');
    if (claimId) {
      setClaims(claims.map(claim => claim.id === claimId ? { ...claim, column: columnId } : claim));
    }
  };

  const openSidebar = (claim) => {
    setSelectedClaim(claim);
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedClaim(null);
  };

  const updateClaimAction = (action) => {
    if (!selectedClaim) return;
    setClaims(claims.map(claim => {
      if (claim.id === selectedClaim.id) {
        if (action === 'investigation') return { ...claim, column: 'investigation' };
        if (action === 'genuine') return { ...claim, column: 'approved', risk: 'low' };
        if (action === 'fraud') return { ...claim, column: 'flagged', risk: 'critical', anomaly: 'Confirmed Fraud: ' + (claim.anomaly || 'Manual Review') };
      }
      return claim;
    }));
    closeSidebar();
  };

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'low': return { bg: 'bg-[#FFF8F3]', text: 'text-[#007979]', dot: 'bg-[#007979]/50', border: 'border-[#FFDEC9]' };
      case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', border: 'border-yellow-200' };
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600 animate-pulse', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', border: 'border-gray-200' };
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'critical': return 'Critical Risk';
      default: return 'Unknown Risk';
    }
  };

  const submittedClaims = claims.filter(c => c.column === 'submitted');
  const processingClaims = claims.filter(c => c.column === 'processing');
  const flaggedClaims = claims.filter(c => c.column === 'flagged');
  const investigationClaims = claims.filter(c => c.column === 'investigation');
  const approvedClaims = claims.filter(c => c.column === 'approved');

  return (
    <div className="flex-1 max-w-full mx-auto w-full p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl font-bold text-[#007979] tracking-tight">Investigator Workbench</h2>
          <p className="font-body-sm text-sm text-[#007979]/70 mt-1">Real-time claim processing and fraud detection.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-[#FFDEC9] rounded-md text-[#007979] font-label-md text-sm flex items-center gap-2 hover:-translate-y-0.5 shadow-sm transition-all duration-200">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
          </button>
          <button className="px-4 py-2 bg-[#007979] text-white rounded-md font-label-md text-sm flex items-center gap-2 hover:-translate-y-0.5 shadow-sm transition-all duration-200">
            <span className="material-symbols-outlined text-[18px]">add</span> New Claim
          </button>
        </div>
      </div>

      {/* Kanban Columns Container */}
      <div className="flex gap-6 h-[calc(100vh-250px)] pb-4 items-start min-w-full overflow-x-auto no-scrollbar" id="kanban-container">
        
        {/* Column: Submitted */}
        <div 
          className="flex-none w-[320px] flex flex-col h-full bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] p-3 kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'submitted')}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-headline-sm text-lg text-[#007979] font-bold flex items-center gap-2">
              Submitted
              <span className="bg-white border border-[#FFDEC9] text-[#007979] px-2 py-0.5 rounded-full font-label-md text-[10px]">{submittedClaims.length}</span>
            </h3>
            <button className="text-[#007979]/60 hover:text-[#007979]"><span className="material-symbols-outlined text-[18px]">more_horiz</span></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 kanban-scroll-area pb-10">
            {submittedClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="bg-white p-4 rounded-lg border border-[#FFDEC9] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#007979] transition-all duration-200 cursor-pointer kanban-card relative group" 
                onClick={() => openSidebar(claim)}
                draggable
                onDragStart={(e) => handleDragStart(e, claim.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-data-tabular text-[11px] font-medium text-[#007979]/70">{claim.id}</span>
                  <div className={`flex items-center gap-1 ${getRiskStyle(claim.risk).bg} px-2 py-0.5 rounded-full border ${getRiskStyle(claim.risk).border}`}>
                    <div className={`w-2 h-2 rounded-full ${getRiskStyle(claim.risk).dot}`}></div>
                    <span className={`font-label-md text-[10px] ${getRiskStyle(claim.risk).text}`}>{getRiskLabel(claim.risk)}</span>
                  </div>
                </div>
                <h4 className="font-headline-sm text-[15px] font-bold text-[#007979] mb-1">{claim.patient}</h4>
                <p className="font-body-sm text-[11px] text-[#007979]/70 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">local_hospital</span> {claim.hospital}
                </p>
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#FFDEC9]/50">
                  <span className="font-data-tabular text-[14px] font-semibold text-[#007979]">{claim.amount}</span>
                  <div className={`w-8 h-8 rounded-full border-2 ${getRiskStyle(claim.risk).border} flex items-center justify-center font-label-md text-[10px] ${getRiskStyle(claim.risk).text}`}>{claim.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: Processing */}
        <div 
          className="flex-none w-[320px] flex flex-col h-full bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] p-3 kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'processing')}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-headline-sm text-lg text-[#007979] font-bold flex items-center gap-2">
              Processing
              <span className="material-symbols-outlined text-[16px] text-[#007979] animate-spin" style={{ animationDuration: "3s" }}>sync</span>
              <span className="bg-white border border-[#FFDEC9] text-[#007979] px-2 py-0.5 rounded-full font-label-md text-[10px]">{processingClaims.length}</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 kanban-scroll-area pb-10">
            {processingClaims.map(claim => (
              <div 
                key={claim.id} 
                className="bg-white p-4 rounded-lg border border-[#FFDEC9] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#007979] transition-all duration-200 cursor-pointer kanban-card relative overflow-hidden" 
                onClick={() => openSidebar(claim)}
                draggable
                onDragStart={(e) => handleDragStart(e, claim.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-data-tabular text-[11px] font-medium text-[#007979]/70">{claim.id}</span>
                  <span className="font-label-md text-[10px] text-white bg-[#007979] px-2 py-0.5 rounded-full font-bold shadow-xs">AI Analysis</span>
                </div>
                <h4 className="font-headline-sm text-[15px] font-bold text-[#007979] mb-1">{claim.patient}</h4>
                <p className="font-body-sm text-[11px] text-[#007979]/70 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">local_hospital</span> {claim.hospital}
                </p>
                <div className="w-full bg-[#FFDEC9]/50 h-1.5 rounded-full mt-4 mb-2 overflow-hidden">
                  <div className="bg-[#007979] h-full rounded-full" style={{ width: `${claim.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-body-sm text-[10px] text-[#007979]/70">{claim.status}</span>
                  <span className="font-data-tabular text-[12px] font-semibold text-[#007979]">{claim.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: Flagged / Review */}
        <div 
          className="flex-none w-[320px] flex flex-col h-full bg-red-50 rounded-xl border border-red-200 p-3 kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'flagged')}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-headline-sm text-lg text-red-600 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span> Flagged
              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full font-label-md text-[10px]">{flaggedClaims.length}</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 kanban-scroll-area pb-10">
            {flaggedClaims.map(claim => (
              <div 
                key={claim.id} 
                className="bg-white p-4 rounded-lg border border-red-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-red-500 transition-all duration-200 cursor-pointer kanban-card relative group" 
                onClick={() => openSidebar(claim)}
                draggable
                onDragStart={(e) => handleDragStart(e, claim.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-data-tabular text-[11px] font-medium text-[#007979]/70">{claim.id}</span>
                  <div className={`flex items-center gap-1 ${getRiskStyle(claim.risk).bg} px-2 py-0.5 rounded-full border ${getRiskStyle(claim.risk).border}`}>
                    <div className={`w-2 h-2 rounded-full ${getRiskStyle(claim.risk).dot}`}></div>
                    <span className={`font-label-md text-[10px] ${getRiskStyle(claim.risk).text} font-bold`}>{getRiskLabel(claim.risk)}</span>
                  </div>
                </div>
                <h4 className="font-headline-sm text-[15px] font-bold text-[#007979] mb-1">{claim.patient}</h4>
                <p className="font-body-sm text-[11px] text-[#007979]/70 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">local_hospital</span> {claim.hospital}
                </p>
                {claim.anomaly && (
                  <div className="bg-red-50 border border-red-100 p-2 rounded flex items-start gap-2 mb-3">
                    <span className="material-symbols-outlined text-red-600 text-[14px] mt-0.5">policy</span>
                    <div>
                      <p className="font-label-md text-[10px] text-red-700 font-bold">Anomaly Detected</p>
                      <p className="font-body-sm text-[10px] text-red-600/80 line-clamp-1">{claim.anomaly}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-end mt-2 pt-3 border-t border-red-100/50">
                  <span className="font-data-tabular text-[14px] font-semibold text-[#007979]">{claim.amount}</span>
                  <div className={`w-8 h-8 rounded-full border-2 ${getRiskStyle(claim.risk).border} flex items-center justify-center font-label-md text-[10px] ${getRiskStyle(claim.risk).text} font-bold`}>{claim.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: Investigation */}
        <div 
          className="flex-none w-[320px] flex flex-col h-full bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] p-3 kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'investigation')}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-headline-sm text-lg text-[#007979] font-bold flex items-center gap-2">
              Investigation
              <span className="bg-white border border-[#FFDEC9] text-[#007979] px-2 py-0.5 rounded-full font-label-md text-[10px]">{investigationClaims.length}</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 kanban-scroll-area pb-10">
            {investigationClaims.map(claim => (
              <div 
                key={claim.id} 
                className="bg-white p-4 rounded-lg border border-[#FFDEC9] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#007979] transition-all duration-200 cursor-pointer kanban-card relative overflow-hidden group" 
                onClick={() => openSidebar(claim)}
                draggable
                onDragStart={(e) => handleDragStart(e, claim.id)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#007979]"></div>
                <div className="flex justify-between items-start mb-2 pl-1">
                  <span className="font-data-tabular text-[11px] font-medium text-[#007979]/70">{claim.id}</span>
                </div>
                <h4 className="font-headline-sm text-[15px] font-bold text-[#007979] mb-1 pl-1">{claim.patient}</h4>
                <p className="font-body-sm text-[11px] text-[#007979]/70 mb-3 flex items-center gap-1 pl-1">
                  <span className="material-symbols-outlined text-[12px]">local_hospital</span> {claim.hospital}
                </p>
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#FFDEC9]/50 pl-1">
                  <span className="font-data-tabular text-[14px] font-semibold text-[#007979]">{claim.amount}</span>
                  <div className={`w-8 h-8 rounded-full border-2 border-yellow-300 flex items-center justify-center font-label-md text-[10px] text-[#007979]`}>{claim.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column: Approved */}
        <div 
          className="flex-none w-[320px] flex flex-col h-full bg-[#007979]/5 rounded-xl border border-[#007979]/20 p-3 kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'approved')}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-headline-sm text-lg text-[#007979] font-bold flex items-center gap-2">
              Approved
              <span className="bg-[#007979]/10 text-[#007979] px-2 py-0.5 rounded-full font-label-md text-[10px]">{approvedClaims.length}</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 kanban-scroll-area pb-10 opacity-70 hover:opacity-100 transition-opacity">
            {approvedClaims.map(claim => (
              <div 
                key={claim.id} 
                className="bg-white p-3 rounded-lg border border-[#FFDEC9] flex flex-col gap-2"
                draggable
                onDragStart={(e) => handleDragStart(e, claim.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-data-tabular text-[10px] text-[#007979]/70">{claim.id}</span>
                  <span className="material-symbols-outlined text-[#007979] text-[14px]">check_circle</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-body-sm text-[12px] text-[#007979] font-bold">{claim.patient}</span>
                  <span className="font-data-tabular text-[12px] text-[#007979] font-semibold">{claim.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Modal */}
      <aside className={`fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-white border-l border-[#FFDEC9] shadow-2xl z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
        {selectedClaim && (
          <>
            <div className="p-6 border-b border-[#FFDEC9] flex justify-between items-start bg-white sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-data-tabular text-sm font-medium text-[#007979]/70">{selectedClaim.id}</span>
                  <span className={`${getRiskStyle(selectedClaim.risk).bg} ${getRiskStyle(selectedClaim.risk).text} px-2 py-0.5 rounded-full font-label-md text-[10px] border ${getRiskStyle(selectedClaim.risk).border} font-bold`}>{getRiskLabel(selectedClaim.risk)}</span>
                </div>
                <h2 className="font-headline-lg text-2xl font-bold text-[#007979]">{selectedClaim.patient}</h2>
                <p className="font-body-sm text-sm text-[#007979]/70 flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">local_hospital</span> {selectedClaim.hospital}
                </p>
              </div>
              <button className="text-[#007979]/60 hover:text-[#007979] transition-colors p-1 rounded-full hover:bg-[#FFDEC9]/30" onClick={closeSidebar}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="flex gap-4">
                <div className="flex-1 bg-[#FFF8F3]/50 p-4 rounded-xl border border-[#FFDEC9]">
                  <p className="font-label-md text-[#007979]/70 text-[10px] uppercase mb-1 font-bold">Claim Amount</p>
                  <p className="font-data-tabular text-[20px] font-semibold text-[#007979]">{selectedClaim.amount}</p>
                </div>
                <div className="flex-1 bg-[#FFF8F3]/50 p-4 rounded-xl border border-[#FFDEC9] flex items-center justify-between">
                  <div>
                    <p className="font-label-md text-[#007979]/70 text-[10px] uppercase mb-1 font-bold">Argus Score</p>
                    <p className="font-data-tabular text-[20px] font-semibold text-red-600">{selectedClaim.score}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full border-4 ${selectedClaim.score > 80 ? 'border-red-500 text-red-600' : 'border-yellow-500 text-yellow-600'} flex items-center justify-center font-label-md text-[12px] font-bold`}>{selectedClaim.score}</div>
                </div>
              </div>
              <section>
                <h3 className="font-headline-sm text-[16px] font-bold text-[#007979] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#007979]">psychology</span> Intelligence Brief
                </h3>
                <div className="space-y-3">
                  <div className="border border-red-300 bg-red-50 p-3 rounded-lg relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="flex justify-between items-start mb-1 pl-2">
                      <span className="font-label-md text-[12px] font-bold text-red-800">Billing Anomaly Detected</span>
                      <span className="font-data-tabular text-[12px] text-red-600 font-bold">84% Match</span>
                    </div>
                    <p className="font-body-sm text-[12px] text-red-700/80 pl-2">{selectedClaim.anomaly || "Procedure code CPT-99215 submitted for standard follow-up."}</p>
                  </div>
                </div>
              </section>
            </div>
            <div className="p-6 border-t border-[#FFDEC9] bg-white mt-auto grid grid-cols-2 gap-3">
              <button onClick={() => updateClaimAction('investigation')} className="col-span-2 px-4 py-2.5 bg-[#007979] text-white rounded-md font-label-md text-[13px] font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm transition-all duration-200">
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span> Assign to Investigation
              </button>
              <button onClick={() => updateClaimAction('genuine')} className="px-4 py-2 border border-[#007979]/30 bg-white text-[#007979] font-bold rounded-md font-label-md text-[12px] flex items-center justify-center gap-2 hover:bg-[#FFF8F3] transition-colors">
                Mark Genuine
              </button>
              <button onClick={() => updateClaimAction('fraud')} className="px-4 py-2 border border-red-500 text-red-600 bg-red-50 font-bold rounded-md font-label-md text-[12px] flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                Confirm Fraud
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Backdrop Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Investigator;
