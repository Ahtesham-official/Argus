import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicalDocument.css';

const ClinicalDocument = () => {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('Lilavati_Hospital_Discharge_Summary.pdf');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [viewMode, setViewMode] = useState('fhir'); // fhir, entities, fraud

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      startLaserScanParsing();
    }
  };

  const startLaserScanParsing = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsScanning(false);
              alert('Clinical Document parsed successfully into FHIR R4 Bundle!');
            }, 300);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const copyFhirJson = () => {
    const code = document.getElementById('fhir-json-code')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code);
      alert('FHIR R4 JSON copied to clipboard!');
    }
  };

  const exportFhirJson = () => {
    const code = document.getElementById('fhir-json-code')?.textContent;
    if (code) {
      const blob = new Blob([code], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FHIR_R4_Bundle_${selectedFileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full">
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/95 to-[#fff5ee]/90 border border-[#007979]/10 shadow-[0_6px_20px_rgba(0,121,121,0.06)]">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="inline-flex items-center gap-2 font-inter text-[10px] leading-[14px] font-bold tracking-widest uppercase text-[#007979]">
            <span className="w-[7px] h-[7px] inline-block rounded-full bg-[#007979]"></span>
            Clinical Interoperability
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#007979]/10 border border-[#007979]/10 font-inter text-[10px] leading-[14px] font-semibold text-[#007979]">
            <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#007979]"></span>
            FHIR R4 • NHCX Ready
          </div>
        </div>

        {/* Main Heading - Fixed the size to match standard text-2xl/3xl instead of the massive overridden one */}
        <h1 className="font-inter text-2xl md:text-3xl font-extrabold tracking-tight text-[#007979] text-left">
          Clinical Document <span className="text-[#181c1a]">FHIR Interoperability Engine</span>
        </h1>

        {/* Description */}
        <p className="mt-2 max-w-[780px] font-inter text-sm leading-relaxed text-[#59615e]">
          Convert clinical discharge summaries, lab reports, and medical PDFs into structured
          <strong className="text-[#007979] font-semibold ml-1 mr-1">FHIR R4 JSON bundles</strong>
          for seamless NHCX exchange.
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#007979]/10 flex-wrap font-inter text-[10px] leading-[14px] text-[#717974]">
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#007979]">description</span>
            Clinical Documents
          </span>
          <span className="text-[#c1c8c3]">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#007979]">data_object</span>
            Structured FHIR Resources
          </span>
          <span className="text-[#c1c8c3]">•</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#007979]">sync_alt</span>
            NHCX Exchange
          </span>
        </div>
      </div>

      {/* Pink/Peach Glassmorphism PDF Drag & Drop Upload Zone */}
      <div 
        onClick={triggerFileInput}
        className="pink-dropzone p-8 rounded-2xl mb-8 text-center cursor-pointer relative overflow-hidden group shadow-sm bg-gradient-to-br from-white to-[#fff5ee] border border-[#ffdec9]"
      >
        {/* Laser Scanning Line Beam */}
        {isScanning && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#007979] to-transparent shadow-[0_0_15px_#007979] z-20 animate-[scan_2s_ease-in-out_infinite_alternate]"></div>
        )}

        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".pdf,.png,.jpg,.jpeg" 
          className="hidden"
          onChange={handleFileSelected} 
        />

        <div className="w-16 h-16 rounded-2xl bg-white/80 border border-[#ffd2aa] text-[#007979] mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>

        <h3 className="text-lg text-[#007979] mb-1 font-bold">Drag & Drop Clinical PDF / Discharge Summary</h3>
        <p className="text-sm text-[#007979]/80 max-w-md mx-auto mb-4">
          Upload lab bills, operative notes, or hospital discharge summaries to instantly extract FHIR resources & analyze fraud risk.
        </p>

        <div className="inline-flex items-center gap-2 bg-white/90 text-[#007979] border border-[#ffd2aa] px-4 py-2 rounded-lg font-medium text-xs shadow-sm">
          <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Select Medical PDF Document
        </div>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="mb-8 glass-panel p-4 rounded-xl bg-white border border-[#e0e3df] shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-[#007979] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd2aa] animate-spin">sync</span>
              AI Clinical Parsing & FHIR Resource Extraction...
            </span>
            <span className="text-[#007979] font-mono">{scanProgress}%</span>
          </div>
          <div className="w-full bg-[#f1fafc] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#007979] h-full rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Main Split Converter Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* PDF Document Viewer Panel */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-6 flex flex-col bg-white shadow-sm border border-[#e0e3df]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#007979]">picture_as_pdf</span>
              <h3 className="text-lg text-[#007979] font-bold truncate max-w-[200px]" title={selectedFileName}>
                {selectedFileName}
              </h3>
            </div>
            <span className="bg-[#ffd2aa] text-[#007979] text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0">PDF Parsed</span>
          </div>

          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5 font-mono text-xs overflow-y-auto max-h-[500px] space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-[#007979]">LILAVATI HOSPITAL & RESEARCH CENTRE</h4>
                  <p className="text-[10px] text-gray-500">Bandra West, Mumbai, Maharashtra 400050</p>
                </div>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">HFR: HFR-104529</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-md border border-gray-200">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Patient Name</span>
                <span className="font-bold text-[#007979]">Sofiya Gowda</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">ABHA Address</span>
                <span className="font-bold text-[#007979]">sofiyasonu128@abdm</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Admission Date</span>
                <span className="text-gray-800">12-Aug-2026</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Discharge Date</span>
                <span className="text-gray-800">15-Aug-2026</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-[#007979] block mb-1">FINAL DIAGNOSIS:</span>
              <p className="text-gray-600 bg-white p-2 border border-gray-200 rounded text-[11px]">
                Acute Coronary Syndrome (ICD-10: I24.9), Essential Hypertension (I10).
              </p>
            </div>

            <div>
              <span className="font-bold text-[#007979] block mb-1">PROCEDURES PERFORMED:</span>
              <p className="text-gray-600 bg-white p-2 border border-gray-200 rounded text-[11px]">
                Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent insertion into LAD artery.
              </p>
            </div>

            <div>
              <span className="font-bold text-[#007979] block mb-1">DISCHARGE MEDICATIONS:</span>
              <ul className="list-disc pl-4 text-gray-600 text-[11px] space-y-1">
                <li>Tab. Aspirin 75mg OD x 30 days</li>
                <li>Tab. Clopidogrel 75mg OD x 30 days</li>
                <li>Tab. Atorvastatin 40mg HS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FHIR R4 JSON & AI Analysis Panel */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 flex flex-col bg-white shadow-sm border border-[#e0e3df]">
          {/* View Mode Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setViewMode('fhir')}
                className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors ${viewMode === 'fhir' ? 'bg-[#ffd2aa] text-[#007979]' : 'bg-gray-50 text-gray-500 hover:text-[#007979]'}`}
              >
                <span className="material-symbols-outlined text-sm">code</span> FHIR R4 Bundle JSON
              </button>
              <button 
                onClick={() => setViewMode('entities')}
                className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors ${viewMode === 'entities' ? 'bg-[#ffd2aa] text-[#007979]' : 'bg-gray-50 text-gray-500 hover:text-[#007979]'}`}
              >
                <span className="material-symbols-outlined text-sm">dataset</span> Extracted Resources
              </button>
              <button 
                onClick={() => setViewMode('fraud')}
                className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors ${viewMode === 'fraud' ? 'bg-[#ffd2aa] text-[#007979]' : 'bg-gray-50 text-gray-500 hover:text-[#007979]'}`}
              >
                <span className="material-symbols-outlined text-sm">shield</span> AI Fraud Analysis
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={copyFhirJson} className="text-gray-500 hover:text-[#007979] p-1.5 rounded hover:bg-gray-50 transition-colors" title="Copy JSON">
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
              <button onClick={exportFhirJson} className="bg-[#007979] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-[#005e5e] shadow-sm">
                <span className="material-symbols-outlined text-sm">download</span> Export Bundle
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto max-h-[480px]">
            {viewMode === 'fhir' && (
              <div className="bg-[#003838] text-[#ffd2aa] p-4 rounded-lg font-mono text-xs h-full">
                <pre id="fhir-json-code"><code>{JSON.stringify({
                  "resourceType": "Bundle",
                  "id": "bundle-nhcx-992148",
                  "type": "document",
                  "timestamp": "2026-08-16T10:30:00+05:30",
                  "entry": [
                    {
                      "fullUrl": "Patient/abdm-sofiya-gowda",
                      "resource": {
                        "resourceType": "Patient",
                        "id": "abdm-sofiya-gowda",
                        "name": [{ "text": "Sofiya Gowda" }],
                        "telecom": [{ "system": "phone", "value": "+917400003455" }],
                        "gender": "female",
                        "address": [{ "text": "Bandra-Kurla Complex, Mumbai, Maharashtra" }]
                      }
                    },
                    {
                      "fullUrl": "Condition/icd-10-I24.9",
                      "resource": {
                        "resourceType": "Condition",
                        "code": {
                          "coding": [{
                            "system": "http://hl7.org/fhir/sid/icd-10",
                            "code": "I24.9",
                            "display": "Acute Coronary Syndrome"
                          }]
                        }
                      }
                    },
                    {
                      "fullUrl": "Procedure/cpt-92928",
                      "resource": {
                        "resourceType": "Procedure",
                        "status": "completed",
                        "code": {
                          "coding": [{
                            "system": "http://www.ama-assn.org/go/cpt",
                            "code": "92928",
                            "display": "Percutaneous transcatheter placement of intracoronary stent(s)"
                          }]
                        }
                      }
                    }
                  ]
                }, null, 2)}</code></pre>
              </div>
            )}

            {viewMode === 'entities' && (
              <div className="space-y-3 h-full">
                <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#ffd2aa] text-[#007979] flex items-center justify-center font-bold text-xs">Pt</span>
                    <div>
                      <h4 className="font-bold text-xs text-[#007979]">Patient / ABDM Subject</h4>
                      <p className="text-[11px] text-gray-500">Sofiya Gowda (ABHA: 91-7400-0034-5512)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#007979]">FHIR Resource OK</span>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#007979]/10 text-[#007979] flex items-center justify-center font-bold text-xs">Dx</span>
                    <div>
                      <h4 className="font-bold text-xs text-[#007979]">Condition (ICD-10)</h4>
                      <p className="text-[11px] text-gray-500">I24.9 — Acute Coronary Syndrome</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#007979]">Mapped Standard</span>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">Px</span>
                    <div>
                      <h4 className="font-bold text-xs text-[#007979]">Procedure (CPT)</h4>
                      <p className="text-[11px] text-gray-500">92928 — Intracoronary Stent Placement (LAD)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#007979]">Verified</span>
                </div>
              </div>
            )}

            {viewMode === 'fraud' && (
              <div className="space-y-4 h-full">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 text-2xl">verified</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#007979]">Fraud Risk Score: 12 / 100 (Low Risk)</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Discharge summary matches hospital admission timeline, ICD-10 diagnosis codes align perfectly with stent procedures, and hospital billing matches standard CGHS/NHCX package rates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Billing Consistency</span>
                    <p className="text-sm font-bold text-[#007979] mt-1">100% CGHS Aligned</p>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Length of Stay Audit</span>
                    <p className="text-sm font-bold text-[#007979] mt-1">3 Days (Appropriate)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalDocument;
