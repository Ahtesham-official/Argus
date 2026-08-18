const config = require('../../config');

/**
 * Explainability AI.
 *
 * Takes the raw outputs of Validation + Fraud Intelligence + Risk Scoring
 * and turns them into: (1) a "why was this flagged" narrative, (2) concrete
 * evidence points, (3) an actionable recommendation. This is what a claims
 * officer actually reads - nothing here re-derives scores, it only explains
 * decisions already made upstream.
 */
function buildExplanation({ claim, validationResult, consistencyResult, eligibilityResult, anomalyResult, duplicateResult, patternResult, networkResult, riskResult }) {
  const reasons = [];
  const evidence = [];

  if (!validationResult.passed) {
    for (const v of validationResult.violations) {
      reasons.push(`Validation rule ${v.ruleId} violated: ${v.description}`);
      evidence.push({ source: 'ClaimValidation', rule: v.ruleId, detail: v.evidence });
    }
  }

  if (consistencyResult && !consistencyResult.passed) {
    for (const c of consistencyResult.failedChecks) {
      reasons.push(`Consistency check failed: ${c.check}`);
      evidence.push({ source: 'ConsistencyCheck', check: c.check, detail: c.detail });
    }
  }

  if (eligibilityResult && !eligibilityResult.eligible) {
    for (const r of eligibilityResult.reasons) {
      reasons.push(`Eligibility issue: ${r}`);
      evidence.push({ source: 'EligibilityCheck', detail: r });
    }
  }

  if (anomalyResult.isAnomaly) {
    reasons.push(
      `Billed amount (₹${anomalyResult.billedAmount}) is a statistical outlier for ${claim.category} claims ` +
        `(z-score ${anomalyResult.zScore}, category average ₹${anomalyResult.categoryMean})`
    );
    evidence.push({ source: 'AnomalyDetection', detail: anomalyResult });
  }

  if (duplicateResult.isDuplicate) {
    reasons.push(`Exact duplicate of existing claim(s): ${duplicateResult.exactMatches.join(', ')}`);
    evidence.push({ source: 'DuplicateDetection', detail: duplicateResult.exactMatches });
  } else if (duplicateResult.isNearDuplicate) {
    reasons.push(`Possible split-billing / resubmission: similar claim(s) filed within a short window`);
    evidence.push({ source: 'DuplicateDetection', detail: duplicateResult.nearMatches });
  }

  for (const p of patternResult.matchedPatterns) {
    reasons.push(`Fraud pattern matched: ${p.pattern} - ${p.description}`);
    evidence.push({ source: 'PatternDetection', pattern: p.pattern, detail: p.evidence });
  }

  if (networkResult.involvesOverlappingProvider) {
    reasons.push(
      `Provider shares an unusually high proportion of patients with another provider ` +
        `(possible referral/collusion ring)`
    );
    evidence.push({ source: 'NetworkAnalysis', detail: networkResult.relevantOverlaps });
  }
  if (networkResult.isHighDegreeProvider) {
    reasons.push(`Provider has an unusually high number of distinct patients relative to peers`);
    evidence.push({ source: 'NetworkAnalysis', detail: { degree: networkResult.providerDegree, cutoff: networkResult.highDegreeCutoff } });
  }

  const recommendation = recommend(riskResult.claimRiskScore, reasons.length);

  // Agreement across independent signal families increases how much weight
  // to put on the explanation itself.
  const signalFamiliesTriggered = [
    !validationResult.passed,
    consistencyResult && !consistencyResult.passed,
    anomalyResult.isAnomaly,
    duplicateResult.isDuplicate || duplicateResult.isNearDuplicate,
    patternResult.hasPatternMatch,
    networkResult.involvesOverlappingProvider || networkResult.isHighDegreeProvider,
  ].filter(Boolean).length;

  return {
    riskScore: riskResult.claimRiskScore,
    riskBand: riskResult.band,
    summary: reasons.length
      ? `Flagged on ${signalFamiliesTriggered} independent signal(s): ${reasons.length} finding(s) below.`
      : 'No validation, consistency, or fraud signals triggered.',
    reasons,
    evidence,
    recommendation,
    signalFamiliesTriggered,
  };
}

function recommend(riskScore, findingCount) {
  const { autoApproveMax, investigateMin } = config.risk;
  if (riskScore <= autoApproveMax && findingCount === 0) {
    return { action: 'AUTO_APPROVE', rationale: 'Low risk score with no triggered findings.' };
  }
  if (riskScore >= investigateMin) {
    return { action: 'INVESTIGATE', rationale: 'Risk score at or above the investigation threshold.' };
  }
  return { action: 'MANUAL_REVIEW', rationale: 'Risk score or findings warrant a claims officer review before decisioning.' };
}

module.exports = { buildExplanation };
