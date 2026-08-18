const store = require('../../data/store');
const Graph = require('../../utils/graph');
const { jaccardSimilarity, clamp } = require('../../utils/stats');

const COLLUSION_OVERLAP_THRESHOLD = 0.3; // Jaccard similarity of shared patients
const HIGH_DEGREE_PERCENTILE = 0.9;

/**
 * Builds a patient<->provider bipartite graph from all known claims and
 * looks for structural fraud signals:
 *   - Provider pairs with unusually high shared-patient overlap (possible
 *     referral rings / collusion)
 *   - Providers with abnormally high connectivity (many distinct patients
 *     relative to peers)
 * This mirrors the "Network Analysis" box in the Fraud Intelligence layer
 * and would back onto a real Graph DB (Neo4j/Neptune) in production - see
 * utils/graph.js for the swap point.
 */
async function buildClaimGraph(includeClaim) {
  const graph = new Graph();
  const allClaims = await store.getAllClaims();
  const claims = [...allClaims];
  if (includeClaim) claims.push(includeClaim);

  for (const c of claims) {
    graph.addNode(`PAT:${c.patientId}`, { type: 'patient' });
    graph.addNode(`PRV:${c.providerId}`, { type: 'provider' });
    graph.addEdge(`PAT:${c.patientId}`, `PRV:${c.providerId}`);
  }
  return graph;
}

function providerPatientSet(graph, providerId) {
  return new Set(
    [...graph.neighbors(`PRV:${providerId}`)].filter((n) => n.startsWith('PAT:'))
  );
}

async function analyzeNetwork(claim) {
  const graph = await buildClaimGraph(claim);
  const providers = await store.listProviders();

  // Pairwise provider overlap (shared patient base) - O(n^2) over a small
  // provider set, which is fine at this scale; bucket/index for larger graphs.
  const overlaps = [];
  for (let i = 0; i < providers.length; i += 1) {
    for (let j = i + 1; j < providers.length; j += 1) {
      const setA = providerPatientSet(graph, providers[i].providerId);
      const setB = providerPatientSet(graph, providers[j].providerId);
      const similarity = jaccardSimilarity(setA, setB);
      if (similarity >= COLLUSION_OVERLAP_THRESHOLD) {
        overlaps.push({
          providerA: providers[i].providerId,
          providerB: providers[j].providerId,
          sharedPatientOverlap: Number(similarity.toFixed(2)),
        });
      }
    }
  }

  const degrees = providers.map((p) => graph.degree(`PRV:${p.providerId}`));
  const sortedDegrees = [...degrees].sort((a, b) => a - b);
  const highDegreeCutoff =
    sortedDegrees[Math.floor(sortedDegrees.length * HIGH_DEGREE_PERCENTILE)] ?? Infinity;

  const claimProviderDegree = graph.degree(`PRV:${claim.providerId}`);
  const isHighDegreeProvider = claimProviderDegree >= highDegreeCutoff && highDegreeCutoff > 0;

  const involvesOverlappingProvider = overlaps.some(
    (o) => o.providerA === claim.providerId || o.providerB === claim.providerId
  );

  const score = clamp(
    (involvesOverlappingProvider ? 50 : 0) + (isHighDegreeProvider ? 30 : 0)
  );

  return {
    score,
    providerDegree: claimProviderDegree,
    isHighDegreeProvider,
    highDegreeCutoff,
    involvesOverlappingProvider,
    relevantOverlaps: overlaps.filter(
      (o) => o.providerA === claim.providerId || o.providerB === claim.providerId
    ),
    allOverlaps: overlaps,
  };
}

module.exports = { analyzeNetwork, buildClaimGraph };
