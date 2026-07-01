# OrthoIntake

**A FHIR-powered clinical intake dashboard for orthopedic workflows.**

## Overview

OrthoIntake aggregates standardized FHIR R4 resources into a streamlined clinical intake dashboard designed for orthopedic urgent care settings. Rather than requiring staff to navigate multiple chart sections before a patient is roomed, OrthoIntake surfaces relevant information — demographics, allergies, prior encounters, and chronic conditions — in a single, organized view.

The project is built as a Health IT workflow prototype and demonstrates practical applications of the FHIR standard in point-of-care settings.

> **Design principle:** Clinical software should reduce cognitive load, not replace clinical judgment.

## Technology

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Clinical Standard | FHIR R4 |
| Data Source | SMART Health IT Sandbox |
| Deployment | Vercel |

## Status

**In Development**

## Roadmap

| Version | Milestone |
|---|---|
| v0.1 | Static dashboard layout with placeholder clinical data |
| v0.2 | Connect to public FHIR sandbox |
| v0.3 | Add patient search and multiple synthetic patients |
| v0.4 | Add SMART-on-FHIR authentication exploration |

See [docs/roadmap.md](docs/roadmap.md) for the full roadmap.

## Documentation

- [Architecture](docs/architecture.md) — project structure and component responsibilities
- [Workflow](docs/workflow.md) — the clinical problem this project addresses
- [Roadmap](docs/roadmap.md) — version milestones and planned features
