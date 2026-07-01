# OrthoIntake Architecture

## Overview

OrthoIntake is a Next.js App Router application. The folder structure separates routing, UI components, data utilities, and type definitions to keep each layer focused and maintainable.

## Directory Structure

```
ortho-intake/
├── app/                        # Next.js App Router routes and pages
│   ├── layout.tsx              # Root layout with shell and global styles
│   └── page.tsx                # Dashboard entry point
│
├── components/
│   ├── dashboard/              # Dashboard-level sections (intake summary, status panels)
│   ├── patient/                # Patient-specific cards (demographics, conditions, allergies)
│   ├── layout/                 # Shell and structural components (header, sidebar, page wrapper)
│   └── ui/                     # Reusable interface primitives (badge, card, label, spinner)
│
├── lib/                        # FHIR fetch utilities and resource parsing helpers
├── types/                      # TypeScript models for FHIR resources and app state
├── docs/                       # Project documentation
└── public/                     # Static assets
```

## Layer Responsibilities

### `app/`

Handles routing and page composition. Pages import from `components/` and do not contain business logic or data fetching utilities directly.

### `components/dashboard/`

Dashboard-level sections that compose the intake view. These components are aware of the overall layout but not of FHIR internals.

### `components/patient/`

Components that render a single patient's clinical data. Each component accepts typed props derived from FHIR resources (e.g., `Patient`, `Condition`, `AllergyIntolerance`).

### `components/layout/`

Structural components that define the application shell: header, navigation, and page-level wrappers. These components are data-agnostic.

### `components/ui/`

Reusable interface primitives: badges, cards, labels, loading indicators, and other stateless UI elements. These have no knowledge of clinical data.

### `lib/`

Utility functions for fetching FHIR resources from the sandbox API and parsing resource bundles into typed objects. Keeping this layer separate allows the data layer to evolve independently of the UI.

### `types/`

TypeScript interfaces and types for FHIR R4 resources used by this application (`Patient`, `Condition`, `AllergyIntolerance`, `Encounter`) and any application-level types (e.g., intake view state).

## Data Flow

```
FHIR Sandbox API
      ↓
lib/ (fetch + parse)
      ↓
app/ page (passes typed props)
      ↓
components/dashboard/ and components/patient/
      ↓
components/ui/ (primitives)
```
