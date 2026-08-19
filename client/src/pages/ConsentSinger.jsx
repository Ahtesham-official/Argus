import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ConsentSinger.css';

const ConsentSinger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPatientName, setModalPatientName] = useState("ABHA Biometric Verification");

  const openSignModal = () => {
    setModalPatientName("ABHA Biometric Verification");
    setIsModalOpen(true);
  };

  const simulateVerify = (name) => {
    setModalPatientName("Verify Consent for " + name);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const submitVerification = () => {
    alert("✓ Biometric & OTP Verification Successful!\nDigital Signature SHA-256 attached to NHCX Payload.");
    setIsModalOpen(false);
  };

  return (
    <div className="p-2 md:p-6 max-w-full mx-auto space-y-8 w-full flex-1">
      {/* Title Card */}
      <div className="command-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-[#007979]">draw</span>
            <h2 className="text-2xl font-bold text-[#007979]">ABHA Consent & Biometric Digital Signer</h2>
          </div>
          <p className="text-sm text-[#007979]/80 mt-1">Biometric & OTP verification modal for high-cost line items ({">"} ₹50,000) under NHCX Protocol</p>
        </div>
        <button onClick={openSignModal} className="bg-[#007979] hover:bg-[#007979]/90 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2">
          <span className="material-symbols-outlined">fingerprint</span> Initiate Consent Signer
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="command-card p-4">
          <p className="text-xs font-semibold text-[#007979]/70 uppercase tracking-wider">Active Patient Consents</p>
          <p className="text-2xl font-bold text-[#007979] mt-1">24 Active</p>
          <span className="text-[10px] text-green-600 font-medium">100% ABDM Compliant</span>
        </div>
        <div className="command-card p-4">
          <p className="text-xs font-semibold text-[#007979]/70 uppercase tracking-wider">High-Cost Pending Authorization</p>
          <p className="text-2xl font-bold text-[#a36d10] mt-1">₹6,45,000</p>
          <span className="text-[10px] text-[#a36d10] font-medium">4 Line items pending OTP</span>
        </div>
        <div className="command-card p-4">
          <p className="text-xs font-semibold text-[#007979]/70 uppercase tracking-wider">Verified Signatures Today</p>
          <p className="text-2xl font-bold text-[#007979] mt-1">18 Verified</p>
          <span className="text-[10px] text-teal-600 font-medium">SHA-256 PKI Secured</span>
        </div>
        <div className="command-card p-4">
          <p className="text-xs font-semibold text-[#007979]/70 uppercase tracking-wider">Consent Revocation Rate</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">0.0%</p>
          <span className="text-[10px] text-gray-500 font-medium">Zero disputes logged</span>
        </div>
      </div>

      {/* Main Consent Log Table */}
      <div className="command-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#007979] flex items-center gap-2">
            <span className="material-symbols-outlined">verified</span> Active ABDM Patient Consent Registry
          </h3>
          <span className="text-xs bg-[#007979]/10 text-[#007979] px-3 py-1 rounded-full font-bold">Updated Live</span>
        </div>

        <div className="overflow-x-auto inner-white-box">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#A3D2D44D]/40 text-[#007979] font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Patient Name</th>
                <th className="p-3">ABHA Address</th>
                <th className="p-3">Consent ID</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">High-Cost Item Amount</th>
                <th className="p-3">Valid Until</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Ahtesham Shaikh</td>
                <td className="p-3 text-xs font-mono">ahtesham.Shaikh@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-8841</td>
                <td className="p-3">NHCX Claim Settlement</td>
                <td className="p-3 font-bold text-gray-900">₹1,85,000</td>
                <td className="p-3 text-xs">24 Aug 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">ACTIVE</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Ahtesham Shaikh')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">Verify OTP</button>
                </td>
              </tr>
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Urvi Dhakate</td>
                <td className="p-3 text-xs font-mono">urvi.Dhakate@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-9012</td>
                <td className="p-3">Surgical Pre-Auth</td>
                <td className="p-3 font-bold text-gray-900">₹2,40,000</td>
                <td className="p-3 text-xs">20 Aug 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">PENDING OTP</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Urvi Dhakate')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">Authorize</button>
                </td>
              </tr>
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Adityapratap Singh</td>
                <td className="p-3 text-xs font-mono">adityapratap.singh@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-7734</td>
                <td className="p-3">IPD Discharge Summary</td>
                <td className="p-3 font-bold text-gray-900">₹95,000</td>
                <td className="p-3 text-xs">30 Aug 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">ACTIVE</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Adityapratap Singh')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">View Artifact</button>
                </td>
              </tr>
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Rajdeep Yadav</td>
                <td className="p-3 text-xs font-mono">rajdeep.yadav@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-6102</td>
                <td className="p-3">Angioplasty Stent Auth</td>
                <td className="p-3 font-bold text-gray-900">₹1,45,000</td>
                <td className="p-3 text-xs">28 Aug 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">VERIFIED</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Rajdeep Yadav')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">Details</button>
                </td>
              </tr>
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Ayush Chaudhary</td>
                <td className="p-3 text-xs font-mono">ayush.c@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-5591</td>
                <td className="p-3">Implant Inventory Authorization</td>
                <td className="p-3 font-bold text-gray-900">₹2,10,000</td>
                <td className="p-3 text-xs">22 Aug 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">PENDING OTP</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Ayush Chaudhary')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">Authorize</button>
                </td>
              </tr>
              <tr className="hover:bg-teal-50/50">
                <td className="p-3 font-bold text-[#007979]">Sofiya Gowda</td>
                <td className="p-3 text-xs font-mono">sofiya.g@abdm</td>
                <td className="p-3 text-xs font-mono text-gray-500">CNS-2026-1001</td>
                <td className="p-3">Wellness & Diagnostic Consent</td>
                <td className="p-3 font-bold text-gray-900">₹45,000</td>
                <td className="p-3 text-xs">15 Sep 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">ACTIVE</span></td>
                <td className="p-3">
                  <button onClick={() => simulateVerify('Sofiya Gowda')} className="text-xs text-[#007979] font-bold underline hover:text-[#007979]/80">View Certificate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Signature Certificate Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="command-card p-6 space-y-3">
          <h4 className="font-bold text-md text-[#007979] flex items-center gap-2">
            <span className="material-symbols-outlined">verified_user</span> DSC / Aadhaar eSign PKI Payload
          </h4>
          <p className="text-xs text-gray-600">Encrypted digital signature payload generated during patient OTP auth for NHCX claim validation.</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
            <p>Algorithm: SHA256withRSA</p>
            <p>Issuer: Class-3 eSign CA India</p>
            <p>Timestamp: 2026-08-18T08:30:12+05:30</p>
            <p className="text-gray-400">SignatureHash: 4f9b8c2d1e0a98f7e6d5c4b3a2109876543210fe</p>
            <p className="text-gray-400">ABHA Token: token_live_abdm_88921_verified</p>
          </div>
        </div>

        <div className="command-card p-6 space-y-3">
          <h4 className="font-bold text-md text-[#007979] flex items-center gap-2">
            <span className="material-symbols-outlined">policy</span> High-Cost Item Rules Engine
          </h4>
          <p className="text-xs text-gray-600">NHCX Mandate: Any procedure or line item exceeding ₹50,000 requires active patient biometric/OTP consent signature.</p>
          <ul className="text-xs text-gray-700 space-y-2">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> Automatic OTP dispatch to patient registered mobile</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> Biometric fingerprint capture at hospital desk</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> Direct attachment to FHIR `supportingInfo` bundle</li>
          </ul>
        </div>
      </div>

      {/* Biometric Modal Simulator */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="command-card w-full max-w-md p-6 space-y-4 bg-white rounded-2xl shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-[#007979] flex items-center gap-2">
                <span className="material-symbols-outlined">fingerprint</span> {modalPatientName}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-gray-600">Enter 6-digit OTP sent to patient's ABDM-linked mobile number or scan fingerprint sensor.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#007979] mb-1">Enter 6-Digit OTP</label>
                <input type="text" maxLength="6" defaultValue="784920" className="w-full border-2 border-gray-300 focus:border-[#007979] rounded-xl px-3 py-2 text-center text-xl font-bold tracking-widest font-mono text-[#007979] focus:outline-none" />
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#007979] animate-pulse">fingerprint</span>
                <p className="text-xs font-bold text-[#007979]">Biometric Device Scanner Ready</p>
                <p className="text-[10px] text-gray-500">Mantra / Morpho L1 Scanner Connected</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={submitVerification} className="flex-1 bg-[#007979] hover:bg-[#007979]/90 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md">
                Verify & Attach Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentSinger;
