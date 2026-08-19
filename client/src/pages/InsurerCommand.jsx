import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './InsurerCommand.css';

const InsurerCommand = () => {
  const [metrics, setMetrics] = useState({
    totalClaims: 0,
    flagRate: 0,
    fraudExposure: 0,
    avgTime: 0
  });
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpis = await api.get('/kpis/summary');
        
        // Calculate flag rate
        const claimsData = await api.get('/claims');
        const flaggedCount = claimsData.claims.filter(c => c.status === 'FLAGGED' || c.status === 'REJECTED' || c.riskBand === 'RED').length;
        const flagRate = kpis.totalClaims > 0 ? (flaggedCount / kpis.totalClaims) * 100 : 0;

        setMetrics({
          totalClaims: kpis.totalClaims || 0,
          flagRate: flagRate.toFixed(1),
          fraudExposure: kpis.fraudPrevented || 0,
          avgTime: kpis.avgDecisionTimeMinutes || 0
        });

        const providersData = await api.get('/providers');
        setTopProviders(providersData.providers.slice(0, 5)); // Get top 5
      } catch (err) {
        console.error("Failed to fetch insurer command data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-2 md:p-6 flex-1 max-w-full mx-auto w-full">
      <div className="mb-8">
        <h2 className="font-headline-lg text-3xl font-bold text-[#007979]">Insurer Command</h2>
        <p className="font-body-lg text-sm text-[#007979]/70 mt-1">System-level analytics and exposure metrics.</p>
      </div>
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Total Claims</span>
            <span className="material-symbols-outlined text-[#007979]">receipt_long</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">{metrics.totalClaims.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-[#007979]">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-md text-xs font-bold">Updated live</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Flag Rate</span>
            <span className="material-symbols-outlined text-yellow-600">flag</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">{metrics.flagRate}%</div>
          <div className="flex items-center gap-1 mt-2 text-red-600">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-md text-xs font-bold">Of total claims</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Fraud Exposure</span>
            <span className="material-symbols-outlined text-red-600">warning</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">₹{(metrics.fraudExposure / 100000).toFixed(2)}L</div>
          <div className="flex items-center gap-1 mt-2 text-[#007979]">
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            <span className="font-label-md text-xs font-bold">Prevented</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Avg. Processing Time</span>
            <span className="material-symbols-outlined text-[#007979]">timer</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">{metrics.avgTime}m</div>
          <div className="flex items-center gap-1 mt-2 text-[#007979]/70">
            <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
            <span className="font-label-md text-xs font-bold">Stable across nodes</span>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white border border-[#FFDEC9] rounded-xl p-6 h-96 flex flex-col shadow-sm">
          <h3 className="font-headline-sm text-lg font-bold text-[#007979] mb-4">Claim & Fraud Trends</h3>
          <div className="flex-1 border border-[#FFDEC9] rounded-lg bg-[#FFF8F3]/30 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#007979]/30 to-transparent"></div>
            <span className="text-[#007979]/60 font-label-md font-bold text-sm">Line Graph Area</span>
          </div>
        </div>
        <div className="xl:col-span-1 bg-white border border-[#FFDEC9] rounded-xl p-6 h-96 flex flex-col shadow-sm">
          <h3 className="font-headline-sm text-lg font-bold text-[#007979] mb-4">Provider Risk Distribution</h3>
          <div className="flex-1 border border-[#FFDEC9] rounded-lg bg-[#FFF8F3]/30 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#007979]/30 to-transparent"></div>
            <span className="text-[#007979]/60 font-label-md font-bold text-sm">Bar Chart Area</span>
          </div>
        </div>
      </div>
      {/* Provider Intelligence Table */}
      <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm overflow-hidden">
        <h3 className="font-headline-sm text-lg font-bold text-[#007979] mb-4">Top 5 High-Risk Providers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#FFDEC9] text-[#007979]/70 font-label-md text-xs uppercase tracking-wider bg-[#FFF8F3]/50">
                <th className="py-3 px-4 font-bold rounded-tl-lg">Provider ID</th>
                <th className="py-3 px-4 font-bold">Specialty</th>
                <th className="py-3 px-4 font-bold text-right">Volume (30d)</th>
                <th className="py-3 px-4 font-bold text-right">Flag Count</th>
                <th className="py-3 px-4 font-bold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-sm">
              {topProviders.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">No high-risk providers found.</td></tr>
              ) : (
                topProviders.map(p => (
                  <tr key={p.providerId} className="border-b border-[#FFDEC9]/50 hover:bg-[#FFF8F3]/80 transition-colors">
                    <td className="py-3 px-4 text-[#007979] font-bold">{p.providerId}</td>
                    <td className="py-3 px-4 text-[#007979]/80 font-medium">{p.specialty}</td>
                    <td className="py-3 px-4 text-right text-[#007979] font-medium">{p.totalClaimsSubmitted}</td>
                    <td className="py-3 px-4 text-right text-red-600 font-extrabold">{p.flaggedCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full font-label-md text-[10px] font-bold border ${p.riskBand === 'RED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {p.riskBand === 'RED' ? 'Under Review' : 'Monitoring'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsurerCommand;
