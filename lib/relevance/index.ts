export type { WeightedKeyword, SpecialtyConfig } from "./keywords";
export { scoreSources } from "./score";
export { orthopedic } from "./orthopedic";

import { scoreSources } from "./score";
import { orthopedic } from "./orthopedic";
import type { SpecialtyConfig } from "./keywords";

// Scores a patient's clinical signals against a specialty config.
// `sources` is an array of free-text strings (condition names, encounter types, etc.).
// Defaults to the orthopedic specialty when no config is provided.
export function scorePatient(
  sources: string[],
  config: SpecialtyConfig = orthopedic,
): number {
  return scoreSources(sources, config.keywords);
}
