import type { WeightedKeyword } from "./keywords";

// Word-boundary match prevents "hand" from matching "handle", etc.
function containsTerm(text: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

// Scores a collection of text strings against a keyword list.
// Each keyword contributes its weight at most once across all sources,
// so a patient with 10 mentions of "knee" scores the same as one with 1.
export function scoreSources(sources: string[], keywords: WeightedKeyword[]): number {
  const normalized = sources.map((s) => s.toLowerCase());
  return keywords.reduce((total, { term, weight }) => {
    const hit = normalized.some((src) => containsTerm(src, term));
    return total + (hit ? weight : 0);
  }, 0);
}
