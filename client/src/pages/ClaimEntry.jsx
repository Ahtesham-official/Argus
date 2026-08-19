import React, { useState } from 'react';
import api from '../api/client';

const ClaimEntry = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    abhaNumber: '',
    providerId: '',
    estimatedAmount: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claim, setClaim] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.patientName.trim()) {
      return 'Please enter the patient name.';
    }

    if (!formData.providerId.trim()) {
      return 'Please enter the Provider / HFR ID.';
    }

    if (!formData.estimatedAmount) {
      return 'Please enter the estimated amount.';
    }

    if (Number(formData.estimatedAmount) < 0) {
      return 'Estimated amount cannot be negative.';
    }

    return null;
  };

  const handleStepOne = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const claimData = {
      patientName: formData.patientName.trim(),
      abhaNumber: formData.abhaNumber.trim() || undefined,
      providerId: formData.providerId.trim(),
      estimatedAmount: Number(formData.estimatedAmount),
    };

    try {
      const response = await api.post('/claims', claimData);

      if (!response.claimId) {
        throw new Error('Unable to create claim.');
      }

      setClaim(response);
      setSuccess('Claim submitted successfully. It is now in the processing queue.');
      // Keep on step 3 but disable further submission, or show a completion view
    } catch (err) {
      setError(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
    setSuccess('');
  };

  const renderStepTwo = () => {
    return (
      <div className="px-6 md:px-8 py-6">

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}

            {claim?.claimId && (
              <div className="mt-1 font-semibold">
                Claim ID: {claim.claimId}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-[#ffdec9] bg-[#fffaf7] p-6">

          <p className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#007979]">
            Step 2
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#181c1a]">
            Treatment &amp; Tariff
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Patient authorization has been completed. Treatment and tariff
            information can be added here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#007979]">
                Treatment / Procedure
              </label>

              <input
                type="text"
                placeholder="Enter treatment or procedure"
                className="w-full h-11 px-3 rounded-lg border border-[#ffdec9] bg-white text-sm outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-[#007979]">
                Tariff amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ₹
                </span>

                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  className="w-full h-11 pl-8 pr-3 rounded-lg border border-[#ffdec9] bg-white text-sm outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-between mt-7 pt-5 border-t border-slate-100">

            <button
              type="button"
              onClick={handleBack}
              className="h-11 px-5 rounded-lg border border-[#ffdec9] text-sm font-bold text-[#007979] hover:bg-[#fff5ee] transition-colors"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="h-11 px-5 rounded-lg bg-[#007979] text-white text-sm font-bold hover:bg-[#005c5c] transition-colors"
            >
              Continue to FHIR review →
            </button>

          </div>

        </div>

      </div>
    );
  };

  const renderStepThree = () => {
    return (
      <div className="px-6 md:px-8 py-6">

        <div className="rounded-xl border border-[#ffdec9] bg-[#fffaf7] p-6">

          <p className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#007979]">
            Step 3
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#181c1a]">
            FHIR Review
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Review the claim information before final submission.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-white border border-[#ffdec9] rounded-lg p-4">
              <p className="text-xs text-slate-500">
                Patient
              </p>

              <p className="mt-1 text-sm font-semibold text-[#181c1a]">
                {formData.patientName}
              </p>
            </div>

            <div className="bg-white border border-[#ffdec9] rounded-lg p-4">
              <p className="text-xs text-slate-500">
                ABHA Number
              </p>

              <p className="mt-1 text-sm font-semibold text-[#181c1a]">
                {formData.abhaNumber}
              </p>
            </div>

            <div className="bg-white border border-[#ffdec9] rounded-lg p-4">
              <p className="text-xs text-slate-500">
                Provider / HFR
              </p>

              <p className="mt-1 text-sm font-semibold text-[#181c1a]">
                {formData.providerId}
              </p>
            </div>

            <div className="bg-white border border-[#ffdec9] rounded-lg p-4">
              <p className="text-xs text-slate-500">
                Estimated Amount
              </p>

              <p className="mt-1 text-sm font-semibold text-[#181c1a]">
                ₹ {Number(formData.estimatedAmount).toLocaleString('en-IN')}
              </p>
            </div>

          </div>

          <div className="flex justify-between mt-7 pt-5 border-t border-slate-100">

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="h-11 px-5 rounded-lg border border-[#ffdec9] text-sm font-bold text-[#007979] hover:bg-[#fff5ee] transition-colors"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-lg bg-[#007979] text-white text-sm font-bold hover:bg-[#005c5c] transition-colors disabled:bg-[#7aabab] flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Claim'}
            </button>

          </div>

        </div>

      </div>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">

        <div className="w-full bg-white border border-[#ffdec9] rounded-2xl shadow-sm">

          <div className="px-6 py-7 md:px-8 md:py-8">

            <p className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#007979]">
              Submission &amp; Ingest
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl leading-tight font-extrabold text-[#181c1a]">
              <span className="text-[#007979]">
                Initiate
              </span>{' '}
              NHCX Claim
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-600">
              Capture patient, provider and treatment details before secure
              claim submission.
            </p>

          </div>

        </div>

        <div className="w-full bg-white border border-[#ffdec9] rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 md:px-8 py-5 border-b border-[#ffdec9]">

            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-bold">

              <span
                className={
                  currentStep >= 1
                    ? 'text-[#007979]'
                    : 'text-slate-400'
                }
              >
                1. Patient auth
              </span>

              <span className="text-slate-400">
                →
              </span>

              <span
                className={
                  currentStep >= 2
                    ? 'text-[#007979]'
                    : 'text-slate-400'
                }
              >
                2. Treatment &amp; tariff
              </span>

              <span className="text-slate-400">
                →
              </span>

              <span
                className={
                  currentStep >= 3
                    ? 'text-[#007979]'
                    : 'text-slate-400'
                }
              >
                3. FHIR review
              </span>

            </div>

          </div>

          {currentStep === 1 && (
            <form onSubmit={handleStepOne}>

              <div className="px-6 md:px-8 py-6">

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                  <div>
                    <label
                      htmlFor="patientName"
                      className="block mb-1.5 text-xs font-bold text-[#007979]"
                    >
                      Patient full name
                    </label>

                    <input
                      id="patientName"
                      name="patientName"
                      type="text"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder="Patient name"
                      disabled={isSubmitting}
                      className="w-full h-11 px-3 rounded-lg border border-[#ffdec9] bg-white text-sm text-[#181c1a] placeholder:text-[#8ccaca] outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="abhaNumber"
                      className="block mb-1.5 text-xs font-bold text-[#007979]"
                    >
                      ABHA number <span className="text-[#007979]/60 font-medium normal-case ml-1">(Optional)</span>
                    </label>

                    <input
                      id="abhaNumber"
                      name="abhaNumber"
                      type="text"
                      value={formData.abhaNumber}
                      onChange={handleChange}
                      placeholder="XX-XXXX-XXXX-XXXX"
                      disabled={isSubmitting}
                      className="w-full h-11 px-3 rounded-lg border border-[#ffdec9] bg-white text-sm text-[#181c1a] placeholder:text-[#8ccaca] outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="providerId"
                      className="block mb-1.5 text-xs font-bold text-[#007979]"
                    >
                      Provider / HFR
                    </label>

                    <input
                      id="providerId"
                      name="providerId"
                      type="text"
                      value={formData.providerId}
                      onChange={handleChange}
                      placeholder="Hospital or HFR ID"
                      disabled={isSubmitting}
                      className="w-full h-11 px-3 rounded-lg border border-[#ffdec9] bg-white text-sm text-[#181c1a] placeholder:text-[#8ccaca] outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="estimatedAmount"
                      className="block mb-1.5 text-xs font-bold text-[#007979]"
                    >
                      Estimated amount
                    </label>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        ₹
                      </span>

                      <input
                        id="estimatedAmount"
                        name="estimatedAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.estimatedAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={isSubmitting}
                        className="w-full h-11 pl-8 pr-3 rounded-lg border border-[#ffdec9] bg-white text-sm text-[#181c1a] placeholder:text-[#8ccaca] outline-none focus:border-[#007979] focus:ring-2 focus:ring-[#007979]/10 disabled:bg-slate-50"
                      />

                    </div>
                  </div>

                </div>

                <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <p className="text-xs text-slate-500">
                    Secure claim submission workflow
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center h-11 min-w-[190px] px-5 rounded-lg bg-[#007979] hover:bg-[#005c5c] disabled:bg-[#7aabab] disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to treatment
                        <span className="ml-2">→</span>
                      </>
                    )}
                  </button>

                </div>

              </div>

            </form>
          )}

          {currentStep === 2 && renderStepTwo()}

          {currentStep === 3 && renderStepThree()}

        </div>

      </div>
    </div>
  );
};

export default ClaimEntry;