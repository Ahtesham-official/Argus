import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Claims.css';

const Claims = () => {
  const [step, setStep] = useState(1);
  const [abhaAddress, setAbhaAddress] = useState('sofiyasonu128@abdm');

  const nextStep = (target) => {
    setStep(target);
  };

  const prevStep = (target) => {
    setStep(target);
  };

  const submitClaim = () => {
    setStep(4);
  };

  const getProgressWidth = () => {
    if (step === 1) return '0%';
    if (step === 2) return '50%';
    return '100%';
  };

  return (
    <div className="claims-page flex-1 p-4 md:p-6 mx-auto space-y-4">
      {/* Title Header */}
      <div className="claims-header mb-2">
        {/* Header Row */}
        <div className="claims-header-top">
          <div className="claims-eyebrow">
            <span className="claims-eyebrow-dot"></span>
            Claims Intelligence
          </div>

          {/* Status Badge */}
          <div className="claims-status">
            <span className="claims-status-dot"></span>
            NHCX Connected
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="claims-title">
          Initiate <span>NHCX Claim</span>
        </h2>

        {/* Description */}
        <p className="claims-description">
          Follow the guided workflow to verify the patient, capture treatment details, and submit a
          <strong> NHCX-compliant claim </strong> securely.
        </p>

        {/* Metadata */}
        <div className="claims-metadata">
          <span className="claims-metadata-item">
            <span className="material-symbols-outlined">person_search</span>
            Patient Verification
          </span>
          <span className="claims-metadata-separator">•</span>
          <span className="claims-metadata-item">
            <span className="material-symbols-outlined">medical_services</span>
            Treatment & Tariff
          </span>
          <span className="claims-metadata-separator">•</span>
          <span className="claims-metadata-item">
            <span className="material-symbols-outlined">send</span>
            NHCX Submission
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      {step < 4 && (
        <div className="relative px-4 sm:px-12 py-2">
          <div className="relative w-full flex items-center justify-between">
            <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1.5 bg-[#FFDEC9] rounded-full z-0"></div>
            <div className="absolute left-0 top-5 -translate-y-1/2 h-1.5 bg-[#007979] rounded-full transition-all duration-500 ease-out z-0" style={{ width: getProgressWidth() }}></div>

            {/* Step 1 Indicator */}
            <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => prevStep(1)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 transform ${step === 1 ? 'bg-[#007979] text-white scale-110' : 'bg-[#007979] text-white scale-105'}`}>
                {step > 1 ? <span className="material-symbols-outlined text-[18px] font-bold">check</span> : '1'}
              </div>
              <span className={`mt-2.5 text-xs tracking-tight ${step === 1 ? 'font-bold text-[#007979]' : 'font-bold text-[#007979]'}`}>1. Patient Auth</span>
            </div>

            {/* Step 2 Indicator */}
            <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => step > 1 && nextStep(2)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step === 2 ? 'bg-[#007979] text-white scale-110' : step > 2 ? 'bg-[#007979] text-white scale-105' : 'bg-white text-[#007979] border-2 border-[#FFDEC9]'}`}>
                {step > 2 ? <span className="material-symbols-outlined text-[18px] font-bold">check</span> : '2'}
              </div>
              <span className={`mt-2.5 text-xs tracking-tight ${step >= 2 ? 'font-bold text-[#007979]' : 'font-medium text-[#007979]/70'}`}>2. Treatment & Tariff</span>
            </div>

            {/* Step 3 Indicator */}
            <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => step > 2 && nextStep(3)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step === 3 ? 'bg-[#007979] text-white scale-110' : 'bg-white text-[#007979] border-2 border-[#FFDEC9]'}`}>
                3
              </div>
              <span className={`mt-2.5 text-xs tracking-tight ${step === 3 ? 'font-bold text-[#007979]' : 'font-medium text-[#007979]/70'}`}>3. FHIR & Review</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Section Card */}
      <div className="command-card p-6 md:p-8">
        <div className="relative min-h-[460px]">
          {/* Step 1 Content */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#FFDEC9]">
                <div>
                  <h3 className="font-headline-sm text-lg text-[#007979] font-bold tracking-tight">Step 1: Patient Authentication & Policy Verification</h3>
                  <p className="text-xs text-[#007979]/80 mt-0.5">Verify ABDM identity and pull active health insurance policies automatically.</p>
                </div>
                <span className="self-start sm:self-auto bg-white text-[#007979] px-3 py-1 rounded-full text-xs font-bold border border-[#FFDEC9] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#007979] animate-pulse"></span> Live ABDM Gateway
                </span>
              </div>

              <div className="mb-6">
                <label className="block font-label-md text-xs font-bold text-[#007979] mb-2 uppercase tracking-wider">Search by ABHA Address or Linked Mobile Number</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#007979]/60 text-xl pointer-events-none">search</span>
                  <input
                    className="w-full pl-11 pr-32 py-3 bg-white border border-[#FFDEC9] rounded-xl focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/20 outline-none font-body-md text-sm transition-all shadow-xs"
                    placeholder="e.g. user@abdm or +91 9876543210" type="text" value={abhaAddress} onChange={e => setAbhaAddress(e.target.value)} />
                  <button className="absolute right-1.5 bg-[#007979] hover:bg-[#005959] text-white px-4 py-2 rounded-lg font-label-md text-xs transition-all shadow-xs flex items-center gap-1.5 font-bold active:scale-95" type="button">
                    <span className="material-symbols-outlined text-base">verified</span> Verify
                  </button>
                </div>
              </div>

              {/* Inner White Patient Inset Card */}
              <div className="inner-white-box p-6 shadow-xs relative overflow-hidden bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9]">
                <div className="flex flex-col md:flex-row items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-[#007979] border border-[#FFDEC9] shrink-0">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="font-headline-sm text-lg text-[#007979] font-extrabold tracking-tight">Sofiya Gowda</h4>
                        <p className="text-xs text-[#007979]/80 mt-1 flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-sm text-[#007979]">location_on</span> Bandra-Kurla Complex (BKC), Mumbai, Maharashtra 400051
                        </p>
                      </div>
                      <span className="font-label-md text-[#007979] bg-white border border-[#FFDEC9] px-3 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#007979]">check_circle</span> Aadhaar KYC Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#FFDEC9]">
                      <div>
                        <p className="font-label-md text-[10px] text-[#007979]/70 uppercase tracking-wider font-bold">ABHA Number</p>
                        <p className="font-data-tabular text-sm font-bold text-on-surface mt-0.5">[Aadhaar Redacted]</p>
                      </div>
                      <div>
                        <p className="font-label-md text-[10px] text-[#007979]/70 uppercase tracking-wider font-bold">Linked Policy</p>
                        <p className="font-data-tabular text-sm font-bold text-[#007979] mt-0.5">Health Secure Plus (#POL-8842)</p>
                      </div>
                      <div>
                        <p className="font-label-md text-[10px] text-[#007979]/70 uppercase tracking-wider font-bold">Available Sum Insured</p>
                        <p className="font-data-tabular text-sm font-bold text-[#007979] mt-0.5">₹ 5,00,000 / ₹ 5,00,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  className="bg-[#007979] hover:bg-[#005959] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  onClick={() => nextStep(2)}>
                  Next: Treatment & Tariff Details <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 Content */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#FFDEC9]">
                <div>
                  <h3 className="font-headline-sm text-lg text-[#007979] font-bold tracking-tight">Step 2: Treatment & Provider Information</h3>
                  <p className="text-xs text-[#007979]/80 mt-0.5">Select empanelled hospital (HFR), clinician (HPR), and diagnosis codes.</p>
                </div>
                <span className="self-start sm:self-auto bg-white text-[#007979] px-3 py-1 rounded-full text-xs font-bold border border-[#FFDEC9]">
                  HFR & HPR Registry Connected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Hospital */}
                <div>
                  <label className="claim-form-label">
                    HFR Hospital Facility (Maharashtra)
                  </label>

                  <select
                    defaultValue="Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529"
                    className="claim-select"
                  >
                    <option value="">
                      Select Hospital Facility...
                    </option>

                    <option value="Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529">
                      Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529
                    </option>

                    <option value="Ruby Hall Clinic, Koregaon Park, Pune — HFR-100214">
                      Ruby Hall Clinic, Koregaon Park, Pune — HFR-100214
                    </option>

                    <option value="Fortis Hospital, Vashi, Navi Mumbai — HFR-108821">
                      Fortis Hospital, Vashi, Navi Mumbai — HFR-108821
                    </option>
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="claim-form-label">
                    HPR Attending Clinician
                  </label>

                  <select
                    defaultValue="Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)"
                    className="claim-select"
                  >
                    <option value="">
                      Select Attending Doctor...
                    </option>

                    <option value="Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)">
                      Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)
                    </option>

                    <option value="Dr. Ananya Deshmukh — HPR-9102 (Internal Medicine)">
                      Dr. Ananya Deshmukh — HPR-9102 (Internal Medicine)
                    </option>
                  </select>
                </div>

                {/* Diagnosis */}
                <div className="md:col-span-2">
                  <label className="claim-form-label">
                    Primary Diagnosis / ICD-10 Code
                  </label>

                  <input
                    className="claim-input"
                    type="text"
                    defaultValue="ICD-10: I21.9 Acute Myocardial Infarction"
                  />
                </div>

                {/* Admission */}
                <div>
                  <label className="claim-form-label">
                    Date of Admission
                  </label>

                  <input
                    className="claim-input"
                    type="date"
                    defaultValue="2026-08-14"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="claim-form-label">
                    Estimated Amount (INR ₹)
                  </label>

                  <input
                    className="claim-input"
                    type="number"
                    defaultValue="84600"
                  />
                </div>

              </div>

              {/* Auto Tariff Inner Box */}
              <div className="mt-6 p-4 bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-white rounded-xl text-[#007979] border border-[#FFDEC9]">
                    <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#007979]">NHCX Auto-Tariff Validation</p>
                    <p className="text-[11px] text-[#007979]/80 font-medium">Standard Package Code: CABG-V1 • Estimated Co-Pay: ₹ 0 (Cashless)</p>
                  </div>
                </div>
                <span className="bg-[#007979] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">Pre-approved</span>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button className="border border-[#007979]/30 text-[#007979] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5" onClick={() => prevStep(1)}>
                  <span className="material-symbols-outlined text-base">arrow_back</span> Back
                </button>
                <button className="bg-[#007979] hover:bg-[#005959] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2" onClick={() => nextStep(3)}>
                  Next: Upload FHIR Documents <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 Content */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#FFDEC9]">
                <div>
                  <h3 className="font-headline-sm text-lg text-[#007979] font-bold tracking-tight">Step 3: Clinical Document Attachment & FHIR Pre-validation</h3>
                  <p className="text-xs text-[#007979]/80 mt-0.5">Upload discharge summaries, lab reports, and itemized hospital bills.</p>
                </div>
                <span className="self-start sm:self-auto bg-white text-[#007979] px-3 py-1 rounded-full text-xs font-bold border border-[#FFDEC9]">
                  FHIR R4 Ready
                </span>
              </div>

              <div className="bg-[#FFF8F3]/30 border border-dashed border-[#007979]/40 p-8 text-center rounded-2xl cursor-pointer hover:border-[#007979] transition-all group">
                <div className="w-12 h-12 rounded-full bg-white text-[#007979] border border-[#FFDEC9] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <p className="text-base text-[#007979] font-bold">Drag & Drop Clinical FHIR Bundles or PDFs</p>
                <p className="text-xs text-[#007979]/70 mt-1">Supports FHIR JSON, Discharge PDFs, Lab XML (Max 10MB per file)</p>
                <button className="mt-4 border border-[#007979] text-[#007979] bg-white hover:bg-[#007979] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs">
                  Browse Medical Files
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-xs text-[#007979] mb-3 uppercase tracking-wider font-bold">Required Documents Checklist</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-white border border-[#FFDEC9] rounded-xl shadow-xs">
                    <span className="material-symbols-outlined text-[#007979] text-xl">check_circle</span>
                    <span className="text-xs text-[#007979] flex-1 font-bold">Discharge Summary (FHIR Bundle Document)</span>
                    <span className="bg-[#FFF8F3] text-[#007979] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#FFDEC9]">Verified FHIR R4</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-white border border-[#FFDEC9] rounded-xl shadow-xs">
                    <span className="material-symbols-outlined text-[#007979] text-xl">check_circle</span>
                    <span className="text-xs text-[#007979] flex-1 font-bold">Itemized Hospital Bill Breakdown</span>
                    <span className="bg-[#FFF8F3] text-[#007979] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#FFDEC9]">Verified PDF</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-[#FFDEC9] pt-6">
                <button className="border border-[#007979]/30 text-[#007979] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5" onClick={() => prevStep(2)}>
                  <span className="material-symbols-outlined text-base">arrow_back</span> Back
                </button>
                <button className="bg-[#007979] hover:bg-[#005959] text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2" onClick={submitClaim}>
                  Transmit Claim to NHCX <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 4 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#007979] text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="material-symbols-outlined text-3xl font-bold">check</span>
              </div>
              <h3 className="text-2xl text-[#007979] font-extrabold mb-2 tracking-tight">Claim Successfully Transmitted</h3>
              <p className="text-sm text-[#007979]/80 mb-6 max-w-md mx-auto">Your claim has been encrypted and submitted to the NHCX Insurance Exchange Network.</p>

              <div className="inline-block bg-white border border-[#FFDEC9] p-6 rounded-2xl mb-8 text-left shadow-xs max-w-md w-full">
                <p className="text-[10px] text-[#007979]/70 mb-1 uppercase font-bold tracking-wider">Generated Claim Reference ID</p>
                <div className="flex items-center justify-between gap-4 mt-1">
                  <span className="text-xl font-extrabold tracking-tight text-[#007979]">CLM-2026-992148</span>
                  <span className="bg-[#007979] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Processing
                  </span>
                </div>
              </div>
              <div>
                <button className="bg-[#007979] hover:bg-[#005959] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md" onClick={() => setStep(1)}>
                  Submit Another Claim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Claims;
