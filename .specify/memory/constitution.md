# Presentation with Animation Constitution

## Core Principles

### I. Test-Driven Development

All development MUST follow the Red-Green-Refactor cycle. Every new feature and bug fix
MUST have corresponding tests derived from its requirements and expected behavior. Tests
MUST be written before implementation, and the relevant test MUST be observed failing
for the intended reason before production code is changed. Implementation MUST make the
test pass; subsequent refactoring MUST preserve passing tests. This sequence demonstrates
that tests detect the behavior they are intended to protect.

### II. Enforced Quality Gates

All code MUST pass ESLint checks and conform to the project's coding and formatting
standards. All tests MUST pass. New features and bug fixes MUST achieve at least 80%
code coverage for the newly added or modified application code. Coverage reports MUST
identify the measured code and metric; executable-line coverage MUST meet the 80% minimum.
Aggregate coverage MUST NOT conceal insufficient coverage in the changed code. These
gates MUST be satisfied before a change is accepted or merged.

### III. Explicit Type Safety and Consistent Style

All TypeScript code MUST follow the Google TypeScript Style Guide. Types MUST be explicitly
defined for every class and interface, every constant and variable, every function
parameter, and every function return value. Inferred types alone MUST NOT substitute for
these explicit declarations or annotations. The `any` type MUST NOT be used. External or
unvalidated values MUST use explicit types such as `unknown` with appropriate narrowing
before use. These rules make contracts visible and preserve type safety during maintenance.

### IV. Public API Documentation

Every public class, interface, and function MUST have a documentation comment in
TypeScript-compatible JSDoc/TSDoc form. Documentation MUST describe the public contract,
including purpose, parameters and return values where applicable, and externally visible
side effects or constraints. Documentation MUST be updated whenever that contract changes
so callers can understand the API without inspecting its implementation.

### V. Prescribed Application and Animation Architecture

The application MUST use TypeScript and Next.js with the App Router. Presentation animation
implementation MUST use GSAP, with ScrollTrigger for scroll-driven animations. Work MUST
serve the project's purpose of interactive presentations with smooth animations. Changes
that replace the prescribed framework, routing model, or animation stack MUST first amend
this constitution; feature-level convenience does not authorize a stack substitution.

## Technical Stack

- Language: TypeScript.
- Frontend framework and routing: Next.js with the App Router.
- Animation: GSAP and ScrollTrigger.
- Unit testing: Jest.
- End-to-end testing: Playwright.
- Linting and formatting: ESLint and Prettier.
- Code style: Google TypeScript Style Guide, with the explicit typing and documentation
  requirements stated above.

Implementation MUST respect the installed Next.js version. Before writing Next.js code,
contributors MUST read the relevant guides in `node_modules/next/dist/docs/` as required
by `AGENTS.md`, and heed deprecation notices. Framework APIs and conventions MUST NOT be
assumed from familiarity with older versions.

## Development Workflow and Review

1. Define the feature or defect's requirements and observable acceptance behavior before
   implementation. Identify the tests and coverage scope that demonstrate that behavior.
2. Write the corresponding tests first, using Jest for unit behavior and Playwright for
   end-to-end behavior where the requirements call for a browser-level check. Run the
   relevant tests and confirm the expected failure before implementing the change.
3. Implement the behavior using the prescribed stack, explicit types, and public API
   documentation. Refactor only while preserving passing tests.
4. Before acceptance or merge, run linting, formatting checks, all project tests, and
   coverage measurement for new features and bug fixes. All tests MUST pass, and the
   coverage and style gates in Principle II MUST be met.
5. Every change review MUST verify compliance with all five principles and record the
   validation results. Failed or omitted required checks MUST block acceptance until
   resolved; incomplete tooling MUST be addressed rather than treated as an exemption.

## Governance

This constitution governs project specifications, plans, implementation, and review.
Project guidance and feature artifacts MUST remain consistent with it. Contributors MUST
check compliance during specification and planning and again before accepting a change.
Conflicts MUST be resolved through an explicit constitution amendment before conflicting
work is accepted.

Amendments MUST document the proposed change, its rationale, affected principles, and any
migration required for existing code or processes. A project maintainer MUST approve the
amendment. The amendment MUST update this document's version and last-amended date, and
identify dependent artifacts that require subsequent alignment. The original ratification
date MUST remain unchanged.

Constitution versions MUST use semantic versioning: increment MAJOR for backward-incompatible
principle removals or redefinitions; MINOR for new principles, new sections, or materially
expanded guidance; and PATCH for clarifications, wording corrections, or other changes
that do not alter governance semantics. The initial adoption is version 1.0.0.

Compliance exceptions MUST NOT be implicit. Any exception to a mandatory rule MUST be
authorized through the amendment procedure, with its scope and rationale recorded.
Amendment review MUST include a temporary Sync Impact Report; that report MUST be removed
before the amended constitution is committed.

**Version**: 1.0.0 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13
