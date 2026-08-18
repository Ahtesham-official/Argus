const store = require('../../data/store');
const { daysBetween } = require('../../utils/stats');

/**
 * Policy eligibility checks: is this claim even coverable under the
 * patient's policy, independent of whether it looks fraudulent.
 */
async function checkEligibility(claim) {
  const policy = await store.findPolicyByPatient(claim.patientId);
  const provider = await store.findProvider(claim.providerId);
  const reasons = [];

  if (!policy) {
    reasons.push('No active policy found for patient');
    return { eligible: false, reasons, policy: null, provider };
  }

  if (policy.status !== 'ACTIVE') {
    reasons.push(`Policy status is ${policy.status}, not ACTIVE`);
  }

  const remainingSumInsured = policy.sumInsured - policy.utilizedAmount;
  if (claim.billedAmount > remainingSumInsured) {
    reasons.push(
      `Billed amount (${claim.billedAmount}) exceeds remaining sum insured (${remainingSumInsured})`
    );
  }

  if (claim.admissionDate) {
    const monthsSincePolicyStart = daysBetween(policy.startDate, claim.admissionDate) / 30;
    const requiredWaiting =
      policy.waitingPeriodMonths[claim.category] ?? policy.waitingPeriodMonths.DEFAULT;
    if (monthsSincePolicyStart < requiredWaiting) {
      reasons.push(
        `Claim falls within the ${requiredWaiting}-month waiting period for ${claim.category} ` +
          `(only ${monthsSincePolicyStart.toFixed(1)} months elapsed since policy start)`
      );
    }
  }

  if (policy.networkHospitalsOnly && provider && !provider.networkHospital) {
    reasons.push(`Policy requires network hospitals only; ${provider.name} is out-of-network`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    policy,
    provider,
    remainingSumInsured,
  };
}

module.exports = { checkEligibility };
