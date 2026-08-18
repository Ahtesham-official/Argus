/**
 * Statistical helpers used across the Fraud Intelligence and Risk Score
 * Engine services. Kept pure / dependency-free so they're easy to unit test.
 */

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values, avg = mean(values)) {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function zScore(value, avg, sd) {
  if (sd === 0) return 0;
  return (value - avg) / sd;
}

function quartiles(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p) => {
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };
  return { q1: q(0.25), median: q(0.5), q3: q(0.75) };
}

function iqrBounds(values, multiplier = 1.5) {
  const { q1, q3 } = quartiles(values);
  const iqr = q3 - q1;
  return { lower: q1 - multiplier * iqr, upper: q3 + multiplier * iqr, iqr, q1, q3 };
}

/** Clamp a number to a range, used to keep composite scores within 0-100. */
function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

/** Levenshtein edit distance - used for fuzzy duplicate / text matching. */
function levenshtein(a = '', b = '') {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const matrix = Array.from({ length: al + 1 }, (_, i) => [i, ...Array(bl).fill(0)]);
  for (let j = 0; j <= bl; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= al; i += 1) {
    for (let j = 1; j <= bl; j += 1) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[al][bl];
}

/** Normalized string similarity in [0,1], 1 = identical. */
function stringSimilarity(a = '', b = '') {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/** Jaccard similarity between two sets (used for provider-patient overlap). */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(new Date(dateA) - new Date(dateB)) / msPerDay;
}

module.exports = {
  mean,
  stdDev,
  zScore,
  quartiles,
  iqrBounds,
  clamp,
  levenshtein,
  stringSimilarity,
  jaccardSimilarity,
  daysBetween,
};
