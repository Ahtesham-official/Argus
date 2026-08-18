/**
 * Deterministic synthetic data generator.
 *
 * This stands in for the Data Layer (Historical Claims, Provider Profiles,
 * Feature Store) so anomaly detection / risk scoring have a realistic
 * distribution to compare against out of the box. Swap `store.js` for real
 * DB queries in production - nothing above this layer needs to change since
 * consumers only call the store's query functions.
 */

// Simple mulberry32 PRNG so the "historical" dataset is stable across restarts.
function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(min + rand() * (max - min + 1));
const randDateWithinDays = (daysAgoMax) => {
  const d = new Date();
  d.setDate(d.getDate() - randInt(1, daysAgoMax));
  return d.toISOString().slice(0, 10);
};

const PROCEDURE_CATEGORIES = {
  CARDIAC: { code: 'PRC-CARD-01', avgAmount: 180000, diagnosisCodes: ['I21', 'I25', 'I50'] },
  ORTHOPEDIC: { code: 'PRC-ORTH-02', avgAmount: 95000, diagnosisCodes: ['S72', 'M17', 'M16'] },
  GENERAL_SURGERY: { code: 'PRC-GSUR-03', avgAmount: 55000, diagnosisCodes: ['K35', 'K80', 'K40'] },
  MATERNITY: { code: 'PRC-MAT-04', avgAmount: 45000, diagnosisCodes: ['O80', 'O82', 'O34'] },
};

const providerNames = [
  'Sunrise Multispecialty Hospital',
  'Green Valley Medical Center',
  'Lakeview Cardiac Institute',
  'Metro Ortho & Trauma Center',
  'City Care General Hospital',
];

function buildProviders() {
  return providerNames.map((name, idx) => ({
    providerId: `PRV-${1000 + idx}`,
    name,
    specialty: pick(Object.keys(PROCEDURE_CATEGORIES)),
    networkHospital: idx !== 3, // one out-of-network provider for eligibility testing
    claimCount: 0,
    flaggedCount: 0,
  }));
}

function buildPatientsAndPolicies(count = 40) {
  const patients = [];
  const policies = [];
  for (let i = 0; i < count; i += 1) {
    const patientId = `PAT-${2000 + i}`;
    const policyStart = randDateWithinDays(700);
    patients.push({ patientId, name: `Patient ${2000 + i}`, dob: `19${randInt(50, 99)}-0${randInt(1, 9)}-1${randInt(0, 9)}` });
    policies.push({
      policyId: `POL-${3000 + i}`,
      patientId,
      policyNumber: `NHCX-POL-${3000 + i}`,
      sumInsured: pick([300000, 500000, 1000000]),
      utilizedAmount: 0,
      subLimits: { ROOM_RENT_PER_DAY: 5000, ICU_PER_DAY: 10000 },
      waitingPeriodMonths: { MATERNITY: 9, PRE_EXISTING: 24, DEFAULT: 1 },
      status: 'ACTIVE',
      startDate: policyStart,
      networkHospitalsOnly: rand() > 0.7,
    });
  }
  return { patients, policies };
}

function buildHistoricalClaims(providers, patients, count = 70) {
  const claims = [];
  const categories = Object.keys(PROCEDURE_CATEGORIES);
  for (let i = 0; i < count; i += 1) {
    const category = pick(categories);
    const meta = PROCEDURE_CATEGORIES[category];
    const provider = pick(providers);
    const patient = pick(patients);
    const admissionDate = randDateWithinDays(500);
    const stay = randInt(1, category === 'CARDIAC' ? 8 : 4);
    const dischargeDate = new Date(admissionDate);
    dischargeDate.setDate(dischargeDate.getDate() + stay);

    // Inject natural variance, with an occasional intentional outlier so
    // anomaly detection has something real to find in demo data.
    const isOutlier = rand() > 0.93;
    const billedAmount = Math.round(
      meta.avgAmount * (isOutlier ? randInt(2, 4) : 0.7 + rand() * 0.6)
    );

    claims.push({
      claimId: `CLM-${5000 + i}`,
      providerId: provider.providerId,
      patientId: patient.patientId,
      category,
      procedureCode: meta.code,
      diagnosisCode: pick(meta.diagnosisCodes),
      admissionDate,
      dischargeDate: dischargeDate.toISOString().slice(0, 10),
      billedAmount,
      approvedAmount: Math.round(billedAmount * (0.85 + rand() * 0.15)),
      submittedAt: admissionDate,
      status: pick(['APPROVED', 'APPROVED', 'APPROVED', 'REJECTED', 'PENDING']),
    });
    provider.claimCount += 1;
  }
  return claims;
}

function generateSeedData() {
  const providers = buildProviders();
  const { patients, policies } = buildPatientsAndPolicies();
  const historicalClaims = buildHistoricalClaims(providers, patients);
  return { providers, patients, policies, historicalClaims, PROCEDURE_CATEGORIES };
}

module.exports = { generateSeedData, PROCEDURE_CATEGORIES };
