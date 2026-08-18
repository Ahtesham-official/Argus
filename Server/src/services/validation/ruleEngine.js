/**
 * Claim Validation - Rule Engine.
 *
 * Rules are plain data (id, description, severity, evaluate fn) so new
 * rules can be added, disabled, or externalised to a JSON/DB-backed rule
 * config without changing the evaluator. `evaluate` returns true when the
 * rule is VIOLATED.
 */
const MANDATORY_FIELDS = [
  'patientId',
  'providerId',
  'procedureCode',
  'diagnosisCode',
  'billedAmount',
  'admissionDate',
];

// Coarse procedure <-> diagnosis compatibility map used by R005 below.
// In production this would be sourced from a clinical coding reference table.
const PROCEDURE_DIAGNOSIS_COMPATIBILITY = {
  'PRC-CARD-01': ['I21', 'I25', 'I50'],
  'PRC-ORTH-02': ['S72', 'M17', 'M16'],
  'PRC-GSUR-03': ['K35', 'K80', 'K40'],
  'PRC-MAT-04': ['O80', 'O82', 'O34'],
};

const RULES = [
  {
    id: 'R001',
    description: 'Mandatory field missing',
    severity: 'HIGH',
    evaluate: (claim) => MANDATORY_FIELDS.some((f) => claim[f] === undefined || claim[f] === null || claim[f] === ''),
    evidence: (claim) => MANDATORY_FIELDS.filter((f) => !claim[f]),
  },
  {
    id: 'R002',
    description: 'Billed amount is zero or negative',
    severity: 'HIGH',
    evaluate: (claim) => typeof claim.billedAmount === 'number' && claim.billedAmount <= 0,
    evidence: (claim) => ({ billedAmount: claim.billedAmount }),
  },
  {
    id: 'R003',
    description: 'Discharge date precedes admission date',
    severity: 'HIGH',
    evaluate: (claim) =>
      claim.admissionDate && claim.dischargeDate &&
      new Date(claim.dischargeDate) < new Date(claim.admissionDate),
    evidence: (claim) => ({ admissionDate: claim.admissionDate, dischargeDate: claim.dischargeDate }),
  },
  {
    id: 'R004',
    description: 'Billed amount exceeds policy sum insured',
    severity: 'HIGH',
    evaluate: (claim, ctx) =>
      !!ctx.policy && typeof claim.billedAmount === 'number' &&
      claim.billedAmount > ctx.policy.sumInsured - ctx.policy.utilizedAmount,
    evidence: (claim, ctx) => ({
      billedAmount: claim.billedAmount,
      availableSumInsured: ctx.policy ? ctx.policy.sumInsured - ctx.policy.utilizedAmount : null,
    }),
  },
  {
    id: 'R005',
    description: 'Procedure code and diagnosis code are clinically incompatible',
    severity: 'MEDIUM',
    evaluate: (claim) => {
      const compatible = PROCEDURE_DIAGNOSIS_COMPATIBILITY[claim.procedureCode];
      if (!compatible || !claim.diagnosisCode) return false;
      return !compatible.includes(claim.diagnosisCode);
    },
    evidence: (claim) => ({ procedureCode: claim.procedureCode, diagnosisCode: claim.diagnosisCode }),
  },
  {
    id: 'R006',
    description: 'Claim submitted outside active policy period',
    severity: 'HIGH',
    evaluate: (claim, ctx) =>
      !!ctx.policy && ctx.policy.status !== 'ACTIVE',
    evidence: (claim, ctx) => ({ policyStatus: ctx.policy ? ctx.policy.status : null }),
  },
  {
    id: 'R007',
    description: 'Non-network hospital used under a network-only policy',
    severity: 'MEDIUM',
    evaluate: (claim, ctx) =>
      !!ctx.policy && !!ctx.provider &&
      ctx.policy.networkHospitalsOnly && !ctx.provider.networkHospital,
    evidence: (claim, ctx) => ({ providerNetworkStatus: ctx.provider ? ctx.provider.networkHospital : null }),
  },
];

function runRules(claim, context = {}) {
  const results = RULES.map((rule) => {
    const violated = !!rule.evaluate(claim, context);
    return {
      ruleId: rule.id,
      description: rule.description,
      severity: rule.severity,
      violated,
      evidence: violated ? rule.evidence(claim, context) : null,
    };
  });

  const violations = results.filter((r) => r.violated);
  const severityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const violationScore = violations.reduce((sum, v) => sum + severityWeight[v.severity], 0);

  return {
    passed: violations.length === 0,
    violations,
    allResults: results,
    violationScore, // used by the Risk Score Engine
  };
}

module.exports = { runRules, RULES, MANDATORY_FIELDS };
