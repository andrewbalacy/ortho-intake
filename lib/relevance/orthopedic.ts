import type { SpecialtyConfig } from "./keywords";

// Orthopedic specialty relevance definition.
//
// Weights reflect clinical specificity:
//   3 — highly specific to orthopedics (fracture, arthroplasty, rotator cuff)
//   2 — moderately specific (arthritis, ligament, spine, back pain)
//   1 — anatomical landmarks that carry contextual signal (knee, hip, shoulder)
export const orthopedic: SpecialtyConfig = {
  name: "Orthopedics",
  keywords: [
    // High-specificity
    { term: "fracture",        weight: 3 },
    { term: "osteoarthritis",  weight: 3 },
    { term: "rotator cuff",    weight: 3 },
    { term: "acl",             weight: 3 },
    { term: "meniscus",        weight: 3 },
    { term: "arthroplasty",    weight: 3 },
    { term: "arthroscopy",     weight: 3 },
    { term: "joint replacement", weight: 3 },
    { term: "dislocation",     weight: 3 },
    // Moderate-specificity
    { term: "sprain",          weight: 2 },
    { term: "strain",          weight: 2 },
    { term: "arthritis",       weight: 2 },
    { term: "tendon",          weight: 2 },
    { term: "ligament",        weight: 2 },
    { term: "spine",           weight: 2 },
    { term: "back pain",       weight: 2 },
    { term: "fusion",          weight: 2 },
    { term: "impingement",     weight: 2 },
    { term: "tendinitis",      weight: 2 },
    { term: "bursitis",        weight: 2 },
    { term: "scoliosis",       weight: 2 },
    { term: "herniated",       weight: 2 },
    { term: "carpal tunnel",   weight: 2 },
    // Anatomical landmarks
    { term: "shoulder",        weight: 1 },
    { term: "knee",            weight: 1 },
    { term: "hip",             weight: 1 },
    { term: "ankle",           weight: 1 },
    { term: "wrist",           weight: 1 },
    { term: "elbow",           weight: 1 },
    { term: "foot",            weight: 1 },
    { term: "hand",            weight: 1 },
    { term: "joint",           weight: 1 },
  ],
};
