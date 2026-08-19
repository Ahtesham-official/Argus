import React from 'react';
import './InsurerCommand.css';

const InsurerCommand = () => {
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
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Total Claims (24h)</span>
            <span className="material-symbols-outlined text-[#007979]">receipt_long</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">14,285</div>
          <div className="flex items-center gap-1 mt-2 text-[#007979]">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-md text-xs font-bold">+5.2% vs yesterday</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Flag Rate</span>
            <span className="material-symbols-outlined text-yellow-600">flag</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">8.4%</div>
          <div className="flex items-center gap-1 mt-2 text-red-600">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-md text-xs font-bold">+1.1% threshold exceeded</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Fraud Exposure</span>
            <span className="material-symbols-outlined text-red-600">warning</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">$2.4M</div>
          <div className="flex items-center gap-1 mt-2 text-[#007979]">
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            <span className="font-label-md text-xs font-bold">-12% mitigated</span>
          </div>
        </div>
        <div className="bg-white border border-[#FFDEC9] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007979] transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-md text-xs font-bold text-[#007979]/70 uppercase tracking-wider">Avg. Processing Time</span>
            <span className="material-symbols-outlined text-[#007979]">timer</span>
          </div>
          <div className="font-headline-lg text-3xl font-extrabold text-[#007979]">1.2s</div>
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
              <tr className="border-b border-[#FFDEC9]/50 hover:bg-[#FFF8F3]/80 transition-colors">
                <td className="py-3 px-4 text-[#007979] font-bold">PRV-8821A</td>
                <td className="py-3 px-4 text-[#007979]/80 font-medium">Orthopedics</td>
                <td className="py-3 px-4 text-right text-[#007979] font-medium">1,204</td>
                <td className="py-3 px-4 text-right text-red-600 font-extrabold">142</td>
                <td className="py-3 px-4">
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-label-md text-[10px] font-bold border border-red-200">Under Review</span>
                </td>
              </tr>
              <tr className="border-b border-[#FFDEC9]/50 hover:bg-[#FFF8F3]/80 transition-colors">
                <td className="py-3 px-4 text-[#007979] font-bold">PRV-4990C</td>
                <td className="py-3 px-4 text-[#007979]/80 font-medium">Cardiology</td>
                <td className="py-3 px-4 text-right text-[#007979] font-medium">890</td>
                <td className="py-3 px-4 text-right text-yellow-600 font-extrabold">85</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-label-md text-[10px] font-bold border border-yellow-200">Monitoring</span>
                </td>
              </tr>
              <tr className="border-b border-[#FFDEC9]/50 hover:bg-[#FFF8F3]/80 transition-colors">
                <td className="py-3 px-4 text-[#007979] font-bold">PRV-1102X</td>
                <td className="py-3 px-4 text-[#007979]/80 font-medium">Internal Medicine</td>
                <td className="py-3 px-4 text-right text-[#007979] font-medium">3,400</td>
                <td className="py-3 px-4 text-right text-yellow-600 font-extrabold">78</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-label-md text-[10px] font-bold border border-yellow-200">Monitoring</span>
                </td>
              </tr>
              <tr className="border-b border-[#FFDEC9]/50 hover:bg-[#FFF8F3]/80 transition-colors">
                <td className="py-3 px-4 text-[#007979] font-bold">PRV-7734B</td>
                <td className="py-3 px-4 text-[#007979]/80 font-medium">Dermatology</td>
                <td className="py-3 px-4 text-right text-[#007979] font-medium">450</td>
                <td className="py-3 px-4 text-right text-yellow-600 font-extrabold">62</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-label-md text-[10px] font-bold border border-yellow-200">Monitoring</span>
                </td>
              </tr>
              <tr className="hover:bg-[#FFF8F3]/80 transition-colors">
                <td className="py-3 px-4 text-[#007979] font-bold">PRV-9011F</td>
                <td className="py-3 px-4 text-[#007979]/80 font-medium">Neurology</td>
                <td className="py-3 px-4 text-right text-[#007979] font-medium">310</td>
                <td className="py-3 px-4 text-right text-yellow-600 font-extrabold">41</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-label-md text-[10px] font-bold border border-yellow-200">Monitoring</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InsurerCommand;
