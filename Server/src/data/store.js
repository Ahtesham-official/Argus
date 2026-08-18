/**
 * In-memory Data Layer facade.
 *
 * Maps directly onto the diagram's Data Layer boxes:
 *   - historicalClaims  -> "Claim DB" / "Historical Claims"
 *   - providers         -> "Provider Profiles"
 *   - policies          -> "Claim DB" (policy/eligibility slice)
 *   - graph (built lazily) -> "Graph DB"
 *
 * This is intentionally the ONLY module that knows data is in-memory.
 * Every service below queries through the functions exported here, so
 * replacing this file with a Postgres/Mongo/Neo4j-backed implementation
 * does not require touching Document AI, Validation, Fraud, Risk or
 * Explainability code.
 */


const ClaimModel = require("../Models/ClaimModel");
const ProviderModel = require("../Models/ProviderModel");
const PolicyModel = require("../Models/PolicyModel");
// const { generateSeedData, PROCEDURE_CATEGORIES } = require('./seed');
const {
  PROCEDURE_CATEGORIES,
} = require("./seed");

async function getHistoricalClaims({
  category,
  providerId,
  excludeClaimId,
} = {}) {
  const query = {
    source: "historical",
  };

  if (category) {
    query.category = category;
  }

  if (providerId) {
    query.providerId = providerId;
  }

  if (excludeClaimId) {
    query.claimId = {
      $ne: excludeClaimId,
    };
  }

  return ClaimModel.find(query).lean();
}

async function getAllClaims() {
  return ClaimModel.find({}).lean();
}

async function findProvider(providerId) {
  return ProviderModel.findOne({
    providerId,
  }).lean();
}

async function listProviders() {
  return ProviderModel.find({}).lean();
}

async function findPolicyByPatient(patientId) {
  return PolicyModel.findOne({
    patientId,
  }).lean();
}

async function findPolicyByNumber(policyNumber) {
  return PolicyModel.findOne({
    policyNumber,
  }).lean();
}

async function saveSubmittedClaim(claim) {
  const savedClaim = await ClaimModel.create({
    ...claim,
    source: "submitted",
  });

  await ProviderModel.updateOne(
    {
      providerId: claim.providerId,
    },
    {
      $inc: {
        claimCount: 1,
      },
    }
  );

  return savedClaim;
}

async function flagProvider(providerId) {
  await ProviderModel.updateOne(
    {
      providerId,
    },
    {
      $inc: {
        flaggedCount: 1,
      },
    }
  );
}

function getProcedureCategoryMeta(category) {
  return PROCEDURE_CATEGORIES[category] || null;
}

function listProcedureCategories() {
  return Object.keys(PROCEDURE_CATEGORIES);
}

module.exports = {
  getHistoricalClaims,
  getAllClaims,
  findProvider,
  listProviders,
  findPolicyByPatient,
  findPolicyByNumber,
  saveSubmittedClaim,
  flagProvider,
  getProcedureCategoryMeta,
  listProcedureCategories,
};
