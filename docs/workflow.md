# Clinical Workflow Problem

## The Problem

During patient intake in an orthopedic urgent care setting, clinical staff often need to piece together information from multiple parts of the chart before the patient is roomed. A complete intake picture typically requires reviewing:

- **Demographics** — name, date of birth, contact information
- **Allergies** — medications and environmental allergens with documented reactions
- **Prior encounters** — recent visits, procedures, and relevant history
- **Chronic conditions** — active diagnoses that affect orthopedic care decisions

In many EHR workflows, this information is spread across separate screens, tabs, or modules. Staff must navigate between views and mentally synthesize the relevant details — a process that adds steps, consumes time, and introduces opportunities for key information to be missed during a busy clinic.

## What OrthoIntake Demonstrates

OrthoIntake demonstrates how standardized FHIR R4 resources — `Patient`, `AllergyIntolerance`, `Condition`, and `Encounter` — can be aggregated from a FHIR-compliant data source into a single intake view.

The application surfaces the information most relevant to orthopedic intake in a layout organized around the clinical workflow, not the data model. The goal is to reduce the number of steps required to build a working picture of a patient before they are roomed.

## Design Boundaries

OrthoIntake is a workflow support tool, not a clinical decision support system. It does not:

- Suggest diagnoses or treatments
- Flag contraindications or drug interactions
- Replace clinical judgment or professional assessment

The application improves information accessibility and supports workflow efficiency. All clinical decisions remain with the licensed clinician.

## Applicability

While built for an orthopedic urgent care context, the underlying pattern — aggregating FHIR resources into a role-specific intake view — applies broadly to outpatient clinic settings where efficient pre-encounter information review is a workflow priority.
