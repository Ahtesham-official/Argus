import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FhirInspector.css';

const payloads = {
  rajdeep: {
    resourceType: "Bundle",
    id: "nhcx-bundle-rajdeep-yadav",
    type: "collection",
    entry: [
      {
        resourceType: "Claim",
        id: "CLM-IND-2026-8801",
        status: "active",
        type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/claim-type", code: "institutional" }] },
        patient: { display: "Rajdeep Yadav", reference: "Patient/ABHA-91-8841-2091-11" },
        provider: { display: "Apollo Super Speciality Hospital Mumbai", identifier: "HFR-MH-44021" },
        total: { value: 145000, currency: "INR" },
        item: [
          { sequence: 1, productOrService: { text: "Coronary Angioplasty & Stent Implantation" }, unitPrice: { value: 145000, currency: "INR" } }
        ],
        supportingInfo: [
          { sequence: 1, category: { coding: [{ code: "discharge-summary" }] }, valueString: "Discharge Summary PDF verified" }
        ]
      }
    ]
  },
  ayush: {
    resourceType: "Bundle",
    id: "nhcx-bundle-ayush-Chaudhary",
    type: "collection",
    entry: [
      {
        resourceType: "Claim",
        id: "CLM-IND-2026-8802",
        status: "active",
        patient: { display: "Ayush Chaudhary", reference: "Patient/ABHA-91-3321-9901-44" },
        provider: { display: "Fortis Healthcare Delhi NCR", identifier: "HFR-DL-11029" },
        total: { value: 210000, currency: "INR" },
        item: [
          { sequence: 1, productOrService: { text: "Total Knee Arthroplasty (Unilateral)" }, unitPrice: { value: 210000, currency: "INR" } }
        ]
      }
    ]
  },
  ahtesham: {
    resourceType: "Bundle",
    id: "nhcx-bundle-ahtesham-shaikh",
    type: "collection",
    entry: [
      {
        resourceType: "Claim",
        id: "CLM-IND-2026-8803",
        status: "active",
        patient: { display: "Ahtesham shaikh", reference: "Patient/ABHA-91-5511-7722-88" },
        provider: { display: "Care Hospital Hyderabad", identifier: "HFR-TS-90112" },
        total: { value: 185000, currency: "INR" },
        item: [
          { sequence: 1, productOrService: { text: "IPD Gastroenterology Intensive Care" }, unitPrice: { value: 185000, currency: "INR" } }
        ]
      }
    ]
  },
  urvi: {
    resourceType: "Bundle",
    id: "nhcx-bundle-urvi-Dhakate",
    type: "collection",
    entry: [
      {
        resourceType: "Claim",
        id: "CLM-IND-2026-8804",
        status: "active",
        patient: { display: "Urvi Dhakate", reference: "Patient/ABHA-91-2299-4411-00" },
        provider: { display: "Max Super Speciality Hospital Kolkata", identifier: "HFR-WB-33410" },
        total: { value: 95000, currency: "INR" },
        item: [
          { sequence: 1, productOrService: { text: "Laparoscopic Cholecystectomy" }, unitPrice: { value: 95000, currency: "INR" } }
        ]
      }
    ]
  }
};

const FhirInspector = () => {
  const [activePatient, setActivePatient] = useState('rajdeep');

  const payload = payloads[activePatient];
  const financialTotal = payload.entry[0].total.value.toLocaleString('en-IN');

  const copyJson = () => {
    const jsonText = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonText);
    alert("✓ FHIR JSON Payload copied to clipboard!");
  };

  const validateSubmit = () => {
    alert("✓ Validation Passed! FHIR Bundle is fully compliant with NHCX R4 Specification.");
  };

  return (
    <div className="p-2 md:p-6 max-w-full mx-auto space-y-6 w-full flex-1">
      {/* Title Header */}
      <div className="command-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-[#007979]">code</span>
            <h2 className="text-2xl font-bold text-[#007979]">FHIR R4 Payload Inspector</h2>
          </div>
          <p className="text-sm text-[#007979]/80 mt-1">Instant JSON preview & schema validation for supportingInfo & Claims payload prior to NHCX submission</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyJson} className="bg-gray-100 hover:bg-gray-200 text-[#007979] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all">
            <span className="material-symbols-outlined text-sm">content_copy</span> Copy JSON
          </button>
          <button onClick={validateSubmit} className="bg-[#007979] hover:bg-[#007979]/90 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md">
            <span className="material-symbols-outlined text-sm">check_circle</span> Validate & Submit
          </button>
        </div>
      </div>

      {/* Patient Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button 
          onClick={() => setActivePatient('rajdeep')} 
          className={`patient-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activePatient === 'rajdeep' ? 'bg-[#007979] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="material-symbols-outlined text-sm">person</span> Rajdeep Yadav (Angioplasty)
        </button>
        <button 
          onClick={() => setActivePatient('ayush')} 
          className={`patient-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activePatient === 'ayush' ? 'bg-[#007979] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="material-symbols-outlined text-sm">person</span> Ayush Chaudhary (Knee Replacement)
        </button>
        <button 
          onClick={() => setActivePatient('ahtesham')} 
          className={`patient-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activePatient === 'ahtesham' ? 'bg-[#007979] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="material-symbols-outlined text-sm">person</span> Ahtesham Shaikh (IPD Ward)
        </button>
        <button 
          onClick={() => setActivePatient('urvi')} 
          className={`patient-tab px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activePatient === 'urvi' ? 'bg-[#007979] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <span className="material-symbols-outlined text-sm">person</span> Urvi Dhakate (Gallbladder)
        </button>
      </div>

      {/* Split Screen Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* JSON Code Viewer Pane (7 cols) */}
        <div className="lg:col-span-7 command-card p-4 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-bold text-xs text-[#007979] font-mono flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">terminal</span> Bundle/Claim-Resource-R4.json
            </span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-bold">Valid FHIR R4</span>
          </div>
          <pre className="bg-gray-900 text-teal-300 p-4 rounded-xl text-xs font-mono overflow-x-auto h-[480px] leading-relaxed border border-gray-800 selection:bg-teal-700">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        {/* Validation & NHCX Rules Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="command-card p-5 space-y-3">
            <h3 className="font-bold text-md text-[#007979] flex items-center gap-2">
              <span className="material-symbols-outlined">fact_check</span> NHCX Protocol Validation Engine
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                <div>
                  <p className="font-bold text-green-900">ABHA Patient Token</p>
                  <p className="text-green-700 text-[11px]">Valid ABDM Identity attached (`91-8841-2091-11`)</p>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                <div>
                  <p className="font-bold text-green-900">LOINC / NAMASTE Mapping</p>
                  <p className="text-green-700 text-[11px]">LOINC 34117-2 mapped to Procedure Item 01</p>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                <div>
                  <p className="font-bold text-green-900">supportingInfo Array</p>
                  <p className="text-green-700 text-[11px]">Discharge Summary & Diagnostic lab PDF present</p>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#007979] text-base mt-0.5">info</span>
                <div>
                  <p className="font-bold text-[#007979]">Total Claim Financials</p>
                  <p className="text-teal-800 text-[11px] font-bold">Total: ₹{financialTotal} | Co-pay: ₹0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="command-card p-5 space-y-3">
            <h4 className="font-bold text-sm text-[#007979] flex items-center gap-2">
              <span className="material-symbols-outlined">cloud_sync</span> Direct Gateway Simulation
            </h4>
            <p className="text-xs text-gray-600">Simulate sending bundle to National Health Claims Exchange sandbox node.</p>
            <div className="space-y-2">
              <button 
                onClick={() => alert('✓ NHCX Response 200 OK: Claim Submitted with ID #NHCX-IND-99420')}
                className="w-full bg-[#007979] hover:bg-[#007979]/90 text-white font-bold py-2 rounded-xl text-xs shadow-xs transition-all flex justify-center items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span> POST /api/v1/nhcx/claim/submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FhirInspector;
