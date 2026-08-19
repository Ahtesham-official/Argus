import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LinkABHA.css';

const LinkABHA = () => {
  const [activeTab, setActiveTab] = useState('abha');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [abhaAddress, setAbhaAddress] = useState('sofiyasonu128@abdm');
  const [mobileNumber, setMobileNumber] = useState('+91 7400003455');
  const [isVerified, setIsVerified] = useState(false);
  const [linkedPolicies, setLinkedPolicies] = useState(0);

  const verifyAbhaDetails = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtp(true);
    }, 600);
  };

  const confirmOtpVerification = () => {
    setIsVerified(true);
    alert('KYC & ABDM Token successfully validated for Sofiya Gowda!');
  };

  const linkPolicyNow = () => {
    setLinkedPolicies(prev => prev + 1);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">ABHA Health ID Linkage & Verification Portal</h2>
          <span className="bg-mint-accent text-secondary border border-secondary/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> ABDM Standard
          </span>
        </div>
        <p className="text-sm text-sage-text">Verify Ayushman Bharat Health Account (ABHA) IDs, link policyholder insurance records, and audit NHCX consent tokens for fraud prevention.</p>
      </div>

      {/* Fraud Protection Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-sage-text uppercase font-bold tracking-wider">Total Linked ABHAs</p>
            <h3 className="font-headline text-3xl font-bold text-primary mt-1">{(12840 + linkedPolicies).toLocaleString()}</h3>
            <p className="text-xs text-secondary flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span> +142 today
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-mint-accent text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-sage-text uppercase font-bold tracking-wider">Demographic KYC Match</p>
            <h3 className="font-headline text-3xl font-bold text-primary mt-1">99.8%</h3>
            <p className="text-xs text-secondary flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-sm">shield</span> Fraud Risk: Minimal
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim/30 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs text-sage-text uppercase font-bold tracking-wider">Active NHCX Consents</p>
            <h3 className="font-headline text-3xl font-bold text-primary mt-1">11,920</h3>
            <p className="text-xs text-sage-text flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-sm">lock_clock</span> Valid tokens
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-mint-accent text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">key</span>
          </div>
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Verification Portal Form */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">fingerprint</span> Verify & Link Policyholder
              </h3>
              <span className="text-xs font-semibold text-sage-text">Step 1 of 2</span>
            </div>

            {/* Input Tabs */}
            <div className="flex border-b border-border-subtle mb-6">
              <button 
                onClick={() => setActiveTab('abha')}
                className={`py-2 px-4 border-b-2 text-xs transition-colors ${activeTab === 'abha' ? 'border-secondary font-bold text-secondary' : 'border-transparent font-semibold text-sage-text hover:text-primary'}`}
              >
                Via ABHA ID
              </button>
              <button 
                onClick={() => setActiveTab('mobile')}
                className={`py-2 px-4 border-b-2 text-xs transition-colors ${activeTab === 'mobile' ? 'border-secondary font-bold text-secondary' : 'border-transparent font-semibold text-sage-text hover:text-primary'}`}
              >
                Via Mobile / Aadhaar
              </button>
            </div>

            {/* ABHA Input Form */}
            {activeTab === 'abha' && (
              <div>
                <label className="block text-xs font-semibold text-sage-text mb-2">ABHA Address / ABHA Number</label>
                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sage-text text-lg">badge</span>
                  <input 
                    type="text" 
                    value={abhaAddress}
                    onChange={(e) => setAbhaAddress(e.target.value)}
                    className="w-full pl-10 pr-28 py-2.5 bg-surface-container-lowest border border-border-subtle rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm"
                    placeholder="e.g. 91-xxxx-xxxx-xxxx or name@abdm" 
                  />
                  <button 
                    onClick={verifyAbhaDetails}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-secondary text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-1 shadow-sm"
                  >
                    {isVerifying && <span className="material-symbols-outlined text-sm animate-spin">refresh</span>}
                    <span>Fetch ABHA</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile/Aadhaar Input Form */}
            {activeTab === 'mobile' && (
              <div>
                <label className="block text-xs font-semibold text-sage-text mb-2">Registered Mobile Number / Aadhaar</label>
                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sage-text text-lg">call</span>
                  <input 
                    type="text" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-10 pr-28 py-2.5 bg-surface-container-lowest border border-border-subtle rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm" 
                  />
                  <button 
                    onClick={verifyAbhaDetails}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-secondary text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-primary transition-colors shadow-sm"
                  >
                    Request OTP
                  </button>
                </div>
              </div>
            )}

            {/* OTP Simulation Box */}
            {showOtp && !isVerified && (
              <div className="bg-surface-container-low border border-border-subtle p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary">Enter 6-Digit ABDM OTP</span>
                  <span className="text-[11px] text-secondary font-mono font-bold">OTP Sent</span>
                </div>
                <div className="flex gap-2 mb-3 justify-between">
                  {['7', '4', '0', '0', '3', '4'].map((val, idx) => (
                    <input key={idx} type="text" maxLength="1" defaultValue={val} className="w-10 h-10 text-center font-bold bg-white border border-border-subtle rounded-md focus:border-secondary outline-none text-sm" />
                  ))}
                </div>
                <button 
                  onClick={confirmOtpVerification}
                  className="w-full bg-secondary text-white py-2 rounded-lg text-xs font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">lock_open</span> Submit OTP & Validate KYC
                </button>
              </div>
            )}
          </div>

          {/* Select Policy Section */}
          <div className="border-t border-border-subtle pt-4 mt-4">
            <label className="block text-xs font-semibold text-sage-text mb-2">Select Active Insurance Policy</label>
            <select className="w-full p-2.5 bg-surface-container-lowest border border-border-subtle rounded-lg focus:border-secondary outline-none text-sm text-on-surface mb-4">
              <option value="POL-2026-99214">POL-2026-99214 — Star Health Comprehensive (Coverage: ₹10,00,000)</option>
              <option value="POL-2026-77312">POL-2026-77312 — HDFC ERGO Optima Secure (Coverage: ₹15,00,000)</option>
              <option value="POL-2026-33109">POL-2026-33109 — Niva Bupa Health Companion (Coverage: ₹5,00,000)</option>
            </select>

            <button 
              onClick={linkPolicyNow}
              className="w-full bg-primary text-white py-3 rounded-lg font-headline font-semibold hover:bg-secondary transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">link</span> Authorize & Link Policy to ABHA
            </button>
          </div>
        </div>

        {/* ABHA Verified Card Preview */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">id_card</span> ABHA Card & KYC Audit
              </h3>
              {isVerified && (
                <span className="bg-mint-accent text-secondary text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span> Verified Live
                </span>
              )}
            </div>

            {/* Virtual ABHA Health Card */}
            <div className="bg-gradient-to-br from-[#003838] via-[#007979] to-[#00a3a3] text-white p-6 rounded-2xl shadow-md relative overflow-hidden mb-6 transition-all duration-500">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                <span className="material-symbols-outlined text-[160px]">security</span>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-bold">Ayushman Bharat Health Account</p>
                  <h4 className="font-headline text-xl font-bold text-white mt-0.5">Sofiya Gowda</h4>
                  <p className="text-[11px] text-mint-accent">Bandra-Kurla Complex, Mumbai, Maharashtra 400051</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-mint-accent text-xl">verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-wider">ABHA Number</p>
                  <p className="font-mono text-xs font-bold tracking-wider text-mint-accent">91-XXXX-XXXX-5512</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-wider">ABHA Address</p>
                  <p className="font-mono text-xs font-bold text-white truncate">{isVerified ? abhaAddress : '---'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-wider">Mobile / Email</p>
                  <p className="text-xs font-semibold text-white">+91 7400003455</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-wider">KYC Status</p>
                  <p className="text-xs font-bold text-secondary-fixed flex items-center gap-1">
                    {isVerified ? <><span className="material-symbols-outlined text-xs">check_circle</span> Verified</> : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px]">
                <span className="text-primary-fixed-dim">Issued by National Health Authority (NHA)</span>
                <span className="bg-secondary/80 px-2 py-0.5 rounded text-white font-mono">NHCX GATEWAY OK</span>
              </div>
            </div>

            {/* Demographic Match Meter */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sage-text">Demographic Match Score</span>
                  <span className="text-secondary font-bold">{isVerified ? '99.8% Perfect Match' : '---'}</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: isVerified ? '99.8%' : '0%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-border-subtle flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">verified</span>
                  <span className="text-on-surface font-medium">Consent Token #CT-88921-NHCX Active</span>
                </div>
                <span className="text-sage-text text-[11px]">Expires in 365 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline text-lg font-bold text-primary">Linked Policyholders & Fraud Audit Directory</h3>
            <p className="text-xs text-sage-text mt-0.5">Real-time listing of policyholders connected with verified ABDM ABHA credentials.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sage-text text-base">search</span>
              <input type="text" placeholder="Search by ABHA or Policy..." className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-xs outline-none focus:border-secondary" />
            </div>
            <button className="bg-surface-container-low text-primary px-3 py-2 rounded-lg text-xs font-semibold border border-border-subtle flex items-center gap-1 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border-subtle text-sage-text font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Policyholder & Location</th>
                <th className="py-3 px-4">ABHA Details</th>
                <th className="py-3 px-4">Linked Policy #</th>
                <th className="py-3 px-4">KYC Match</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4">Fraud Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-border-subtle">
              {linkedPolicies > 0 && Array.from({ length: linkedPolicies }).map((_, i) => (
                <tr key={`new-${i}`} className="bg-mint-accent/20 hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs">SG</div>
                      <div>
                        <p className="font-bold text-primary">Sofiya Gowda</p>
                        <p className="text-[10px] text-sage-text">BKC, Mumbai, MH</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-mono text-xs text-primary font-semibold">91-XXXX-XXXX-5512</p>
                    <p className="text-[11px] text-sage-text">sofiyasonu128@abdm</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">POL-2026-99214</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-mint-accent text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full">99.8% Match</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-primary-container text-secondary-fixed text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">Active Token</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-secondary font-bold text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span> Clean
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-secondary p-1" title="Active"><span className="material-symbols-outlined text-base">check_circle</span></button>
                  </td>
                </tr>
              ))}
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-mint-accent text-secondary flex items-center justify-center font-bold text-xs">SG</div>
                    <div>
                      <p className="font-bold text-primary">Sofiya Gowda</p>
                      <p className="text-[10px] text-sage-text">BKC, Mumbai, MH</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-mono text-xs text-primary font-semibold">91-XXXX-XXXX-5512</p>
                  <p className="text-[11px] text-sage-text">sofiyasonu128@abdm</p>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">POL-2026-99214</td>
                <td className="py-3.5 px-4">
                  <span className="bg-mint-accent text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full">99.8% Match</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-primary-container text-secondary-fixed text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">Active</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-secondary font-bold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary pulse-dot"></span> Low Risk
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button className="text-secondary hover:text-primary p-1 rounded hover:bg-mint-accent transition-colors">
                    <span className="material-symbols-outlined text-base">published_with_changes</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LinkABHA;
