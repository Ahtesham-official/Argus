import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import './Claims.css';

// Risk band → Tailwind color mapping
const RISK_COLORS = {
  LOW: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  MEDIUM: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  CRITICAL: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-600 animate-pulse' },
  UNKNOWN: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
};

const Claims = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Patient Auth
  const [abhaAddress, setAbhaAddress] = useState(''); // optional
  const [patientName, setPatientName] = useState('Sofiya Gowda');

  // Step 2 — Treatment
  const [hospital, setHospital] = useState('Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529');
  const [doctor, setDoctor] = useState('Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)');
  const [diagnosis, setDiagnosis] = useState('ICD-10: I21.9 Acute Myocardial Infarction');
  const [admissionDate, setAdmissionDate] = useState('2026-08-14');
  const [estimatedAmount, setEstimatedAmount] = useState('84600');
  const [category, setCategory] = useState('INPATIENT');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  const nextStep = (target) => setStep(target);
  const prevStep = (target) => setStep(target);

  const submitClaim = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const claimData = {
        patientName,
        abhaNumber: abhaAddress.trim() || undefined, // optional — only send if filled
        hospital,
        doctor,
        diagnosis,
        admissionDate,
        dischargeDate: admissionDate, // same as admission for now, can add separate field
        estimatedAmount: Number(estimatedAmount),
        billedAmount: Number(estimatedAmount),
        category,
      };
      const response = await api.post('/claims', claimData);
      setSubmittedClaimId(response.claimId);
      setAiResult(response);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAbhaAddress('');
    setPatientName('');
    setHospital('');
    setDoctor('');
    setDiagnosis('');
    setAdmissionDate('');
    setEstimatedAmount('');
    setAiResult(null);
    setSubmittedClaimId(null);
    setError(null);
  };

  const getProgressWidth = () => {
    if (step === 1) return '0%';
    if (step === 2) return '50%';
    return '100%';
  };

  const riskColors = aiResult ? (RISK_COLORS[aiResult.riskBand] || RISK_COLORS.UNKNOWN) : RISK_COLORS.UNKNOWN;

  return (
    <div className="claims-page flex-1 p-4 md:p-6 mx-auto space-y-4">
      {/* Title Header */}
      <div className="claims-header mb-2">
        <div className="claims-header-top">
          <div className="claims-eyebrow">
            <span className="claims-eyebrow-dot"></span>
            Claims Intelligence
          </div>
          <div className="claims-status">
            <span className="claims-status-dot"></span>
            NHCX Connected
          </div>
        </div>
        <h2 className="claims-title">
          Initiate <span>NHCX Claim</span>
        </h2>
        <p className="claims-description">
          Follow the guided workflow to verify the patient, capture treatment details, and submit a
          <strong> NHCX-compliant claim </strong> securely.
        </p>
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

            <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => prevStep(1)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 transform ${step === 1 ? 'bg-[#007979] text-white scale-110' : 'bg-[#007979] text-white scale-105'}`}>
                {step > 1 ? <span className="material-symbols-outlined text-[18px] font-bold">check</span> : '1'}
              </div>
              <span className={`mt-2.5 text-xs tracking-tight ${step === 1 ? 'font-bold text-[#007979]' : 'font-bold text-[#007979]'}`}>1. Patient Auth</span>
            </div>

            <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => step > 1 && nextStep(2)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step === 2 ? 'bg-[#007979] text-white scale-110' : step > 2 ? 'bg-[#007979] text-white scale-105' : 'bg-white text-[#007979] border-2 border-[#FFDEC9]'}`}>
                {step > 2 ? <span className="material-symbols-outlined text-[18px] font-bold">check</span> : '2'}
              </div>
              <span className={`mt-2.5 text-xs tracking-tight ${step >= 2 ? 'font-bold text-[#007979]' : 'font-medium text-[#007979]/70'}`}>2. Treatment & Tariff</span>
            </div>

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

          {/* ───── Step 1: Patient Auth ───── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#FFDEC9]">
                <div>
                  <h3 className="font-headline-sm text-lg text-[#007979] font-bold tracking-tight">Step 1: Patient Authentication & Policy Verification</h3>
                  <p className="text-xs text-[#007979]/80 mt-0.5">Enter the patient's details. ABHA address is optional.</p>
                </div>
                <span className="self-start sm:self-auto bg-white text-[#007979] px-3 py-1 rounded-full text-xs font-bold border border-[#FFDEC9] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#007979] animate-pulse"></span> Live ABDM Gateway
                </span>
              </div>

              {/* Patient Name */}
              <div className="mb-5">
                <label className="block font-label-md text-xs font-bold text-[#007979] mb-2 uppercase tracking-wider">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#007979]/60 text-xl pointer-events-none">person</span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#FFDEC9] rounded-xl focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/20 outline-none font-body-md text-sm transition-all shadow-xs"
                    placeholder="e.g. Sofiya Gowda"
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                  />
                </div>
              </div>

              {/* ABHA Address - Optional */}
              <div className="mb-6">
                <label className="block font-label-md text-xs font-bold text-[#007979] mb-2 uppercase tracking-wider">
                  ABHA Address / Linked Mobile Number
                  <span className="ml-2 text-[#007979]/50 normal-case font-medium">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#007979]/60 text-xl pointer-events-none">search</span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#FFDEC9] rounded-xl focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/20 outline-none font-body-md text-sm transition-all shadow-xs"
                    placeholder="e.g. user@abdm or +91 9876543210 (leave blank if unavailable)"
                    type="text"
                    value={abhaAddress}
                    onChange={e => setAbhaAddress(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-[#007979]/60 mt-1.5 ml-1">
                  ABHA linkage enhances fraud detection accuracy but is not mandatory for claim submission.
                </p>
              </div>

              {/* Patient Preview Card */}
              <div className="inner-white-box p-6 shadow-xs relative overflow-hidden bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9]">
                <div className="flex flex-col md:flex-row items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-[#007979] border border-[#FFDEC9] shrink-0">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="font-headline-sm text-lg text-[#007979] font-extrabold tracking-tight">{patientName || '—'}</h4>
                        <p className="text-xs text-[#007979]/80 mt-1 flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-sm text-[#007979]">badge</span>
                          {abhaAddress ? `ABHA: ${abhaAddress}` : 'ABHA: Not provided (optional)'}
                        </p>
                      </div>
                      {patientName && (
                        <span className="font-label-md text-[#007979] bg-white border border-[#FFDEC9] px-3 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#007979]">check_circle</span> Ready to Proceed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!patientName.trim()}
                  className="bg-[#007979] hover:bg-[#005959] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  onClick={() => nextStep(2)}>
                  Next: Treatment & Tariff Details <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ───── Step 2: Treatment ───── */}
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
                  <label className="claim-form-label">HFR Hospital Facility (Maharashtra) <span className="text-red-500">*</span></label>
                  <select className="claim-select" value={hospital} onChange={e => setHospital(e.target.value)}>
                    <option value="">Select Hospital Facility...</option>
                    <option value="Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529">Lilavati Hospital & Research Centre, BKC Mumbai — HFR-104529</option>
                    <option value="Ruby Hall Clinic, Koregaon Park, Pune — HFR-100214">Ruby Hall Clinic, Koregaon Park, Pune — HFR-100214</option>
                    <option value="Fortis Hospital, Vashi, Navi Mumbai — HFR-108821">Fortis Hospital, Vashi, Navi Mumbai — HFR-108821</option>
                    <option value="Jupiter Hospital, Thane West — HFR-112244">Jupiter Hospital, Thane West — HFR-112244</option>
                    <option value="Sahyadri Hospital, Deccan, Pune — HFR-103391">Sahyadri Hospital, Deccan, Pune — HFR-103391</option>
                    <option value="Apollo Hospitals, Navi Mumbai — HFR-109982">Apollo Hospitals, Navi Mumbai — HFR-109982</option>
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="claim-form-label">HPR Attending Clinician <span className="text-red-500">*</span></label>
                  <select className="claim-select" value={doctor} onChange={e => setDoctor(e.target.value)}>
                    <option value="">Select Attending Doctor...</option>
                    <option value="Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)">Dr. Rajesh Kulkarni — HPR-8821 (Cardiology)</option>
                    <option value="Dr. Ananya Deshmukh — HPR-9102 (Internal Medicine)">Dr. Ananya Deshmukh — HPR-9102 (Internal Medicine)</option>
                    <option value="Dr. Sameer Patel — HPR-7741 (Orthopedics)">Dr. Sameer Patel — HPR-7741 (Orthopedics)</option>
                    <option value="Dr. Priya Sharma — HPR-6643 (Neurology)">Dr. Priya Sharma — HPR-6643 (Neurology)</option>
                    <option value="Dr. Vikram Nair — HPR-5522 (Oncology)">Dr. Vikram Nair — HPR-5522 (Oncology)</option>
                  </select>
                </div>

                {/* Claim Category */}
                <div>
                  <label className="claim-form-label">Claim Category <span className="text-red-500">*</span></label>
                  <select className="claim-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="INPATIENT">Inpatient (IPD)</option>
                    <option value="OUTPATIENT">Outpatient (OPD)</option>
                    <option value="DAYCARE">Daycare</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>

                {/* Admission Date */}
                <div>
                  <label className="claim-form-label">Date of Admission <span className="text-red-500">*</span></label>
                  <input
                    className="claim-input"
                    type="date"
                    value={admissionDate}
                    onChange={e => setAdmissionDate(e.target.value)}
                  />
                </div>

                {/* Diagnosis */}
                <div className="md:col-span-2">
                  <label className="claim-form-label">Primary Diagnosis / ICD-10 Code <span className="text-red-500">*</span></label>
                  <input
                    className="claim-input"
                    type="text"
                    placeholder="e.g. ICD-10: I21.9 Acute Myocardial Infarction"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                </div>

                {/* Amount */}
                <div className="md:col-span-2">
                  <label className="claim-form-label">Estimated Amount (INR ₹) <span className="text-red-500">*</span></label>
                  <input
                    className="claim-input"
                    type="number"
                    placeholder="e.g. 84600"
                    value={estimatedAmount}
                    onChange={e => setEstimatedAmount(e.target.value)}
                  />
                </div>

              </div>

              {/* Auto Tariff */}
              <div className="mt-6 p-4 bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-white rounded-xl text-[#007979] border border-[#FFDEC9]">
                    <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#007979]">NHCX Auto-Tariff Validation</p>
                    <p className="text-[11px] text-[#007979]/80 font-medium">Estimated Amount: ₹{Number(estimatedAmount || 0).toLocaleString()} • Co-Pay: ₹ 0 (Cashless)</p>
                  </div>
                </div>
                <span className="bg-[#007979] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">Pre-approved</span>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button className="border border-[#007979]/30 text-[#007979] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5" onClick={() => prevStep(1)}>
                  <span className="material-symbols-outlined text-base">arrow_back</span> Back
                </button>
                <button
                  disabled={!hospital || !doctor || !diagnosis || !estimatedAmount || !admissionDate}
                  className="bg-[#007979] hover:bg-[#005959] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  onClick={() => nextStep(3)}>
                  Next: Upload FHIR Documents <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ───── Step 3: FHIR & Review ───── */}
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

              {/* Claim Summary Before Submit */}
              <div className="mb-6 p-4 bg-[#FFF8F3]/50 rounded-xl border border-[#FFDEC9] text-xs">
                <p className="font-bold text-[#007979] mb-3 uppercase tracking-wider text-[10px]">Claim Summary — Review Before Submission</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-[#007979]/60 font-bold">Patient:</span> <span className="text-[#007979] font-semibold ml-1">{patientName}</span></div>
                  <div><span className="text-[#007979]/60 font-bold">ABHA:</span> <span className="text-[#007979] font-semibold ml-1">{abhaAddress || 'Not provided'}</span></div>
                  <div className="col-span-2"><span className="text-[#007979]/60 font-bold">Hospital:</span> <span className="text-[#007979] font-semibold ml-1">{hospital || '—'}</span></div>
                  <div><span className="text-[#007979]/60 font-bold">Doctor:</span> <span className="text-[#007979] font-semibold ml-1">{doctor || '—'}</span></div>
                  <div><span className="text-[#007979]/60 font-bold">Category:</span> <span className="text-[#007979] font-semibold ml-1">{category}</span></div>
                  <div className="col-span-2"><span className="text-[#007979]/60 font-bold">Diagnosis:</span> <span className="text-[#007979] font-semibold ml-1">{diagnosis || '—'}</span></div>
                  <div><span className="text-[#007979]/60 font-bold">Admission:</span> <span className="text-[#007979] font-semibold ml-1">{admissionDate || '—'}</span></div>
                  <div><span className="text-[#007979]/60 font-bold">Amount:</span> <span className="text-[#007979] font-semibold ml-1">₹{Number(estimatedAmount || 0).toLocaleString()}</span></div>
                </div>
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

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-start gap-2">
                  <span className="material-symbols-outlined text-base shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center border-t border-[#FFDEC9] pt-6">
                <button className="border border-[#007979]/30 text-[#007979] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5" onClick={() => prevStep(2)} disabled={isSubmitting}>
                  <span className="material-symbols-outlined text-base">arrow_back</span> Back
                </button>
                <button
                  className={`bg-[#007979] hover:bg-[#005959] text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={submitClaim}
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                      Running AI Analysis...
                    </>
                  ) : (
                    <>Transmit Claim to NHCX <span className="material-symbols-outlined text-base">send</span></>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ───── Step 4: Success + AI Result ───── */}
          {step === 4 && (
            <div className="text-center py-8 animate-fade-in">
              {/* Status Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ${aiResult?.riskBand === 'CRITICAL' || aiResult?.riskBand === 'HIGH' ? 'bg-red-600' : aiResult?.riskBand === 'MEDIUM' ? 'bg-yellow-500' : 'bg-[#007979]'}`}>
                <span className="material-symbols-outlined text-white text-3xl font-bold">
                  {aiResult?.status === 'APPROVED' ? 'check' : aiResult?.status === 'FLAGGED' ? 'warning' : aiResult?.status === 'UNDER_INVESTIGATION' ? 'search' : 'check'}
                </span>
              </div>

              <h3 className="text-2xl text-[#007979] font-extrabold mb-2 tracking-tight">Claim Successfully Submitted</h3>
              <p className="text-sm text-[#007979]/80 mb-6 max-w-md mx-auto">
                Your claim has been analyzed by the Argus AI engine and placed in the investigator queue accordingly.
              </p>

              {/* Claim ID + AI Decision */}
              <div className="inline-block bg-white border border-[#FFDEC9] p-6 rounded-2xl mb-6 text-left shadow-xs max-w-lg w-full">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-[#007979]/70 mb-0.5 uppercase font-bold tracking-wider">Claim Reference ID</p>
                    <span className="text-xl font-extrabold tracking-tight text-[#007979]">{submittedClaimId || 'CLM-PENDING'}</span>
                  </div>
                  {/* Risk Band Badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${riskColors.bg} ${riskColors.text} ${riskColors.border}`}>
                    <span className={`w-2 h-2 rounded-full ${riskColors.dot}`}></span>
                    {aiResult?.riskBand || 'UNKNOWN'} RISK
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#FFDEC9]">
                  <div>
                    <p className="text-[10px] text-[#007979]/60 uppercase font-bold">AI Decision</p>
                    <p className="text-sm font-bold text-[#007979] mt-0.5">{aiResult?.recommendation?.replace(/_/g, ' ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#007979]/60 uppercase font-bold">Kanban Status</p>
                    <p className="text-sm font-bold text-[#007979] mt-0.5 capitalize">{aiResult?.kanbanColumn?.replace('_', ' ') || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#007979]/60 uppercase font-bold">Risk Score</p>
                    <p className="text-sm font-bold text-[#007979] mt-0.5">{aiResult?.riskScore ?? '—'} / 100</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#007979]/60 uppercase font-bold">Claim Status</p>
                    <p className="text-sm font-bold text-[#007979] mt-0.5">{aiResult?.status || '—'}</p>
                  </div>
                </div>

                {aiResult?.anomalyDescription && (
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <p className="text-[10px] text-red-600 uppercase font-bold mb-1">⚠ Fraud Flags Detected</p>
                    <p className="text-xs text-red-700">{aiResult.anomalyDescription}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  className="bg-[#007979] hover:bg-[#005959] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md"
                  onClick={resetForm}>
                  Submit Another Claim
                </button>
                <button
                  className="border border-[#007979] text-[#007979] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#FFF8F3] transition-all"
                  onClick={() => navigate('/investigator')}>
                  View in Investigator
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
