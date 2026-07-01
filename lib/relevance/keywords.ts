export interface WeightedKeyword {
  term: string;   // lowercase; matched against lowercased source text
  weight: number; // additive contribution to the relevance score
}

export interface SpecialtyConfig {
  name: string;
  keywords: WeightedKeyword[];
}
