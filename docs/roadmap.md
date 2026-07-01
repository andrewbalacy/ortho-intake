# OrthoIntake Roadmap

## v0.1 — Project Foundation and Static Dashboard

- Initialize Next.js project with TypeScript and Tailwind CSS
- Establish folder structure: `components/`, `lib/`, `types/`, `docs/`
- Create static dashboard layout with placeholder clinical data
- Define visual design language appropriate for clinical workflows
- Write project documentation (README, architecture, workflow)

## v0.2 — FHIR Data Integration

- Connect to the SMART Health IT public FHIR R4 sandbox
- Fetch and display real Patient resources
- Fetch and display Condition, AllergyIntolerance, and Encounter resources
- Build FHIR fetch utilities in `lib/`
- Define TypeScript models in `types/` for relevant FHIR resources

## v0.3 — Patient Search and Filtering

- Add patient search UI to locate synthetic patients by name or identifier
- Support switching between multiple synthetic patient records
- Handle loading and error states gracefully

## v0.4 — SMART-on-FHIR Auth Exploration

- Explore the SMART-on-FHIR authorization flow
- Document findings on OAuth 2.0 launch sequences for EHR-embedded apps
- Prototype a launch context handler if feasible with the public sandbox

## v1.0 — Portfolio-Ready Release

- Polish UI for professional presentation
- Ensure full TypeScript coverage with no `any` types
- Add inline documentation for non-obvious implementation decisions
- Verify Vercel deployment is stable and publicly accessible
- Write a project summary suitable for a portfolio or technical interview
