# Implementation Plan: Animated Presentation on Attractive Slide Design

**Branch**: `how-to-create-attractive-presentation-materials` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-animated-presentation/spec.md`

## Summary

Create the four-slide Japanese presentation at `/how-to-create-attractive-presentation-materials`, preserving every supplied content string. A synchronous route shell renders a scoped interactive presentation. A finite GSAP master timeline handles opening, forward transitions, reverse transitions, and staggered tips; a standalone ScrollTrigger drives its playhead through one replaceable tween. One example pair persists across slides 2 and 3, and one presentation-wide scroll cue disappears on the final slide. Responsive flow layouts preserve long content on narrow screens; reduced-motion mode suppresses decorative movement.

Research decisions and primary-source references are recorded in [research.md](research.md). This command produces design documentation only; tasks and application code follow in later phases.

## Technical Context

**Language/Version**: TypeScript 5.9.3 with explicit annotations, strict checks, and no `any`; Node 24.17.0 and npm 11.13.0 are the inspected local runtime.

**Primary Dependencies**: Installed Next.js 16.4.0 App Router, React/React DOM 19.3.0, GSAP 3.15.0, and `@gsap/react` 2.1.2. Add `lucide-react` for the requested `ChevronDown`. Use route-scoped CSS Modules with the existing Tailwind 4 setup; avoid another animation or styling framework.

**Storage**: Immutable local content and ephemeral browser animation state. No database, authentication, persistence, or backend API.

**Testing**: Add Jest, jsdom, React Testing Library, and next/jest integration; Playwright for production-browser E2E. Add Prettier and compatible ESLint configuration. Exact new dependency versions are resolved and locked during implementation, without changing the installed core stack.

**Target Platform**: Modern desktop/mobile browsers supported by the installed Next release: Chrome/Edge/Firefox 111+, Safari 16.4+. Validate current Playwright Chromium, Firefox, and WebKit, with 1280 × 720, 1920 × 1080, and 390 × 844 acceptance layouts.

**Project Type**: Single Next.js web application with a public UI route and client-side animation.

**Performance Goals**: SC-004's continuity target: at least 95% of observed motion time without a visible stall over 100 ms or discontinuous position jump. Prefer transform/opacity animation and avoid per-frame React rerenders. A latest-target playhead tween initially settles in 0.25 seconds after scrolling stops; tune only with acceptance evidence.

**Constraints**: Exact Japanese copy and static date; one shared illustration pair; persistent cue through slides 1–3; reversible navigation; all six cards reachable on narrow screens; reduced-motion support; required TDD, lint/format/type checks, public documentation, and per-file ≥80% executable-line coverage. Read installed Next guides before code changes, as required by AGENTS.md.

**Scale/Scope**: One public presentation, exactly four slides, two illustrative examples, six tips, no external data integrations. The initial working tree was clean. Preserve the existing Git branch; the setup script's `BRANCH` output is a feature identifier here, not the actual branch name.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Pre-research assessment                                                | Post-design assessment and required evidence                                                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Test-driven development           | PASS: behavior requirements and acceptance scenarios exist before code | PASS by design: tooling first; intended failing behavior tests precede each implementation slice; record red/green commands and outcomes                                           |
| II. Enforced quality gates           | PASS: missing tools are identified and planned, with no exemption      | PASS by design: ESLint, Prettier, typecheck, all Jest/E2E tests, production build, and ≥80% lines in every changed application file; retain coverage scope/reports                 |
| III. Explicit types and Google style | PASS: prescribed TypeScript retained                                   | PASS by design: explicit variables, bindings, parameters, returns, and members; no `any`; tested ESLint enforcement plus style review; normalize existing scaffold where necessary |
| IV. Public API documentation         | PASS: documentation required for authored public contracts             | PASS by design: document exported components, functions, interfaces/classes, parameters, return values, side effects, and constraints; enforce presence and review completeness    |
| V. Prescribed architecture           | PASS: Next App Router, GSAP, ScrollTrigger retained                    | PASS: route boundary, scoped GSAP ownership, lifecycle cleanup, and responsive media conditions are specified                                                                      |

No constitutional violation or amendment is proposed. These are planning gates, not claims that application quality gates have already run. Implementation acceptance is blocked until the required tools, tests, coverage, and review evidence are complete.

## Project Structure

### Documentation (this feature)

```text
specs/001-animated-presentation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
├── contracts/
│   ├── presentation-ui.md
│   └── animation-controller.md
└── tasks.md                    # Future speckit-tasks output; not created here
```

### Source Code (repository root)

Proposed implementation paths; these files are not created by this planning command:

```text
app/
├── layout.tsx                  # Existing; annotate/document if global gates require
├── page.tsx                    # Existing; annotate/document if global gates require
└── how-to-create-attractive-presentation-materials/
    ├── page.tsx                # Synchronous server shell and metadata
    ├── presentation.module.css
    ├── _components/
    │   ├── presentation.tsx    # Client boundary, refs, and useGSAP lifecycle
    │   ├── slide-scenes.tsx    # Four semantic scenes, including shared group
    │   ├── example-designs.tsx # One local HTML/CSS example pair
    │   ├── scroll-cue.tsx      # Vertical label and Lucide icon
    │   └── tip-card.tsx
    └── _lib/
        ├── types.ts
        ├── content.ts          # Exact immutable presentation content
        ├── scroll-model.ts     # Pure mapping and visibility rules
        └── animation-controller.ts
eslint/rules/                   # Tested annotation/documentation enforcement
scripts/check-changed-coverage.mjs
jest.config.mjs
jest.setup.ts
playwright.config.ts
.prettierrc.json
.prettierignore
tests/
├── unit/
│   ├── type-contracts.test.ts # Compiler-backed valid/invalid consumer fixtures
│   ├── content.test.ts
│   ├── scroll-model.test.ts
│   ├── presentation.test.tsx
│   ├── animation-controller.test.ts
│   ├── app-shell.test.tsx
│   └── lint-rules.test.mjs
└── e2e/presentation.spec.ts
```

**Structure Decision**: Extend the existing root `app/` layout rather than creating a second application or `src/` tree. Underscore-prefixed feature directories keep implementation modules outside routing. The route has UI contracts rather than HTTP data endpoints. Tool/config additions are part of implementation setup.

## Phase 0 — Research Completed

[research.md](research.md) resolves route conventions, timeline ownership, reverse behavior, shared illustrations, responsive overflow, reduced motion, lifecycle cleanup, artwork/icon selection, testing, coverage, and annotation/documentation enforcement. Local Next documentation was inspected before selecting the route design. Research agents provided animation and validation findings; their conclusions were consolidated with repository evidence. No unresolved technical question remains.

## Phase 1 — Design

### Content and Route

Use readonly presentation data and stable scene/card/example identifiers from [data-model.md](data-model.md). The server route exports typed metadata and renders the interactive shell without fetching data. The root presentation landmark has `lang="ja"`; headings, explanatory paragraphs, and card lists remain semantic. A system Japanese font stack and scoped presentation colors avoid dependence on a remote font download or the starter page's dark-mode assumptions.

### Animation and Scroll Mapping

The controller creates one finite paused master with labeled opening, scene holds, transitions, and final settled state. Startup drives to `openingEnd`; ScrollTrigger takes ownership on real scrolling and maps measured scroll position into the remaining timeline. Each target replaces the old playhead driver from its current time. No queue, forced snapping, or wheel/touch interception is used.

Forward entrances travel from below to their resting position; forward exits travel upward. Backward timeline traversal yields downward exits and restoration. Give final cards an outer scene-travel wrapper and separate child fade/scale entrances. Place example entrances after slide 2 text; no arrangement tween exists between the slide-2 and slide-3 holds. Decorative child motion and visibility wrappers never share transform ownership.

The cue's parent opacity is controlled by the finite timeline. Its separate child loop contains two subtle vertical bobs and a pause. Stop hidden loops and restore them on backward navigation. The examples use a small bounded child shake, pausing outside the shared scene range. Suggested ordinary ease is `power1.inOut`; card settling uses a restrained `elastic.out` ease. Absolute transform values prevent accumulation. Exact tuning remains subject to SC-004/SC-005 validation.

### Responsive and Reduced Motion

Enable desktop pinning initially at width ≥1024 and height ≥640 only when measured content fits. At both required desktop baselines, cards remain 3 × 2. For narrow/short/enlarged-text layouts, use normal document flow with a sticky shared example band inside the combined slide-2/3 group. Reserve its space and background; both text scenes must be readable without painting over the examples. Final cards reflow in reading order and remain in native scroll flow.

Flow-mode scroll mapping uses measured scene boundaries rather than assuming four equal viewport heights. Long reading spans hold the appropriate scene at its fully revealed time. Media changes rebuild geometry and preserve the current scene/local reading position; refresh after stable layout and resize. Avoid resize-refresh feedback loops by scheduling/coalescing observer work.

Reduced-motion mode uses unpinned document flow and immediately visible content, with no travel, rotation, zoom/elastic effects, bobs, or shakes. ScrollTrigger still tracks final-scene entry for cue visibility. Without successful enhancement, static content remains readable and scrollable.

### Interfaces and State Ownership

[presentation-ui.md](contracts/presentation-ui.md) defines route, semantic content, scene layouts, motion, and acceptance behavior. [animation-controller.md](contracts/animation-controller.md) defines typed inputs, progress mapping, target replacement, shared visibility, media rebuild, and disposal. React owns stable content and refs; the controller owns animation state and scoped DOM motion, avoiding per-frame React updates. Data does not cross an external API boundary.

## Implementation and Validation Strategy

1. Set up the absent test/style/icon tooling and planned scripts. Add tests for enforcement and coverage checks; normalize scaffold typing/documentation needed for global quality gates without adding unrelated behavior. Before creating foundational entity/runtime types, write and observe a failing compiler-backed contract assertion using test-only in-memory fixtures; then require valid/invalid consumer fixtures to pass against the actual production module before mapping tests or user-story work. Missing imports/toolchain errors are not acceptable red evidence.
2. Write failing content/route/component tests before the route and immutable content. Confirm failures are missing required behavior, then implement the smallest passing slice.
3. Write failing scroll-model/controller tests for early-scroll handoff, reverse paths, cue state, shared example lifetime, latest target, and disposal. Implement timeline/controller only after observing red evidence.
4. Write browser tests before visual integration for ordered entrances, live shared DOM identity, forward/backward movement, mobile reachability, reduced motion, and repeated navigation. Use real GSAP/ScrollTrigger in E2E.
5. Verify production layout, all six adjacent transitions, twenty round trips, fast reversal, refresh/media rebuild, and route unmount/remount. Record real motion samples rather than inferring pixels from unit mocks.
6. Run all required quality commands and per-file coverage checks, then collect the viewer-study and animation-review evidence in [quickstart.md](quickstart.md). Passing automation does not replace SC-002 or SC-005.

| Requirements/outcomes                                      | Primary validation                                                                                                          |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| FR-001–FR-003, FR-008, FR-011–FR-013; SC-001               | Content/component tests and route/browser rendered-copy checks                                                              |
| FR-004–FR-007, FR-009–FR-010, FR-014–FR-016; SC-003–SC-004 | Controller/model tests plus real browser frame/state samples, shared-node identity, six transitions, and twenty round trips |
| FR-017; SC-006                                             | Bounds/reachability checks at the three specified viewports, with short-screen and resize cases                             |
| FR-018; SC-007                                             | Reduced-motion preference and runtime preference-change tests                                                               |
| FR-019                                                     | Self-contained mini-slide content tested without optional styling/assets                                                    |
| SC-002, SC-005                                             | Ten-viewer task study and five-viewer readability/comfort review                                                            |

Coverage includes every executable feature application file, not only pure helpers, plus any changed shared application files. Record the commit preceding implementation as the comparison base. The coverage validator must fail for a missing file, missing base, or any file below 80% lines; no broad controller/component exclusion is allowed.

Phase 1 is complete and the post-design constitution check passes. Generate dependency-ordered implementation tasks next with `$speckit-tasks`.
