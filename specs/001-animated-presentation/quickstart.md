# Quickstart and Acceptance Validation

**Feature**: [spec.md](spec.md)  
**Design**: [plan.md](plan.md)  
**Contracts**: [presentation UI](contracts/presentation-ui.md), [animation controller](contracts/animation-controller.md)

This is the validation guide for the planned implementation. The presentation and new validation scripts are not implemented by `speckit-plan`; the commands below become available during implementation. Do not treat this guide as evidence that tests have run.

## Prerequisites and Setup

- Use the existing branch `how-to-create-attractive-presentation-materials` and repository root.
- The inspected environment has Node 24.17.0/npm 11.13.0 and the prescribed Next/React/GSAP stack installed. Keep core versions unchanged unless a separately justified compatibility fix is required.
- Read the relevant installed guides under `node_modules/next/dist/docs/` before writing Next.js code, especially routing, client boundaries, CSS, and testing.
- Follow the constitution's Red-Green-Refactor process. Test dependency failures do not count as intended feature failures.

Before application implementation begins, record its comparison commit and keep the SHA with the validation evidence:

```bash
export IMPLEMENTATION_BASE=$(git rev-parse HEAD)
```

Reviewers must reuse that recorded SHA, not substitute the post-implementation HEAD.

During tooling setup, add missing dependencies with compatible versions and retain the resulting lockfile:

```bash
npm install lucide-react
npm install --save-dev jest jest-environment-jsdom @types/jest @testing-library/react @testing-library/dom @testing-library/jest-dom @playwright/test prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
npx playwright install chromium firefox webkit
```

Jest uses `jest.config.mjs` with `next/jest`, so a TypeScript configuration loader is unnecessary. If browser binaries require operating-system packages, install those through the environment's normal permitted setup before browser validation.

## Planned Script Contract

Implementation must configure these scripts before using this guide:

| Command                                           | Required behavior                                                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                     | Existing Next development server for local preview                                                          |
| `npm run lint`                                    | ESLint CLI over authored code with zero warnings, explicit annotations/no-any/public-doc checks             |
| `npm run format:check`                            | Prettier check with Google-compatible project formatting; ignore generated/dependency artifacts             |
| `npm run typecheck`                               | `next typegen` followed by `tsc --noEmit`                                                                   |
| `npm test -- --runInBand`                         | All Jest unit/component and tooling-rule tests                                                              |
| `npm run test:coverage`                           | All Jest tests with V8 coverage, all feature application files included, and JSON summary/LCOV/text reports |
| `npm run coverage:check -- --base <recorded-sha>` | Check every changed executable application file against ≥80% lines; reject missing reports/base/files       |
| `npm run build`                                   | Existing production Next build                                                                              |
| `npm run start`                                   | Existing production server                                                                                  |
| `npm run test:e2e`                                | Playwright against production server, Chromium/Firefox/WebKit; browser artifacts on failure                 |

The Playwright configuration starts `npm run start -- --hostname 127.0.0.1 --port 3000` using `webServer`, waits for readiness, and uses `http://127.0.0.1:3000` as baseURL. Build first. Do not silently reuse an unrelated server during final validation.

## TDD Evidence

For each behavior slice, retain the test name/requirement, command, intended failing assertion before production changes, and passing result afterward. Set up tooling first, then cover fixed content/route, scroll mapping/controller, and browser motion/layout in that order. Assertions should demonstrate the behavior in the contracts rather than duplicate implementation call sequences.

Include negative and positive tests for explicit-type/documentation enforcement and the per-file coverage validator. Any shared scaffold changes needed for global style gates must be included in applicable rendering tests and coverage scope.

## Preview

```bash
npm run dev
```

Open `http://localhost:3000/how-to-create-attractive-presentation-materials`. At the top, expect the Japanese title, presenter, fixed date, then the vertical Scroll cue. Scroll down to the explanation, the three phrases with the same illustrations, and the six-card final tips. Scroll back to restore earlier scenes.

## Automated Quality Gate

After implementation, run from the repository root:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test:coverage
npm run coverage:check -- --base "$IMPLEMENTATION_BASE"
npm run build
npm run test:e2e
```

The coverage run includes all Jest tests; a separate duplicate unit run is unnecessary. Reports must identify the executable application files and line metric. Exclude declarations, tests, configs, generated code, and CSS from executable-line measurement; CSS remains subject to browser layout validation. Do not exclude the controller, route, content, or rendered components to meet the threshold.

## Browser Validation Scenarios

Use the UI and controller contracts for detailed expected states. Browser assertions must check rendered opacity/transforms/bounds, not only DOM presence. Prefer condition polling and frame sampling over fixed sleeps. Keep real motion enabled in tests that validate animations.

| Scenario               | Action                                                                       | Expected evidence                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Opening                | Visit at scroll zero and sample entrances                                    | Exact content; title first, attribution next, cue last; no unexpected simultaneous start                |
| Early interruption     | Scroll before opening finishes                                               | Smooth takeover from current pose; settles at latest destination without stale title content            |
| Central explanation    | Enter slide 2 and continue to slide 3                                        | Text before staggered examples; exact copy; one pair remains mounted/visible with unchanged arrangement |
| Principles             | Stop in slide 3                                                              | Only three prescribed left-side phrases; shared examples and cue still visible                          |
| Final tips             | Enter slide 4                                                                | Exact six cards; row-major fade/zoom/elastic entrance; cue fades out                                    |
| Reverse paths          | Exercise 4→3, 3→2, and 2→1                                                   | Outgoing content fades/down; correct content restores; shared pair unchanged on 3→2; cue returns on 4→3 |
| Reliability            | All six adjacent paths, then twenty complete down/up round trips             | Correct settled states every time; no duplicate nodes or accumulated transforms                         |
| Rapid input/boundaries | Fast overshoot, immediate reversal, stop mid-transition, continue either way | Latest position wins; no obsolete completions, blank end, or wraparound                                 |
| Desktop grids          | Repeat at 1280 × 720 and 1920 × 1080                                         | Two-section middle scenes; final cards 3 × 2; no clipping, overlap, or obscured text                    |
| Narrow content         | Repeat at 390 × 844; reach every sentence/card                               | Native flow; shared band stays within scenes 2/3; all content reachable; scrollWidth ≤ clientWidth      |
| Resize/short viewport  | Resize across layout modes and shorten viewport while mid-deck               | Current reading location retained; fit guard selects flow when needed; no duplicate triggers/loops      |
| Reduced motion         | Emulate reduce before visit, then toggle at runtime                          | Content retained; no travel/rotation/zoom/elastic/bobs/shakes; cue reflects final-scene position        |
| Fallback               | Disable JavaScript; verify mini-slide text without optional styling          | Readable static deck, two understandable examples, no missing remote artwork                            |
| Lifecycle/restoration  | Leave/revisit route, including browser-restored nonzero position             | Correct scene reconciles; no extra live motion resources or forced restart                              |

For shared continuity, capture the two example node identities before the 2→3 transition and confirm the same nodes after 3→2. Sample parent visibility and arrangement during the transition rather than checking only its endpoints. Decorative child shaking must not be mistaken for parent layout drift.

## Human Acceptance and Motion Review

| Criterion | Procedure and threshold                                                                                                                                                                                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SC-002    | Ten first-time viewers start at the title without extra navigation coaching. At least nine reach the tips and return to an earlier slide within two minutes. Record completion/time per participant.                                                                                                                                             |
| SC-004    | Record normal-motion opening, forward/backward transitions, and decoration under representative browser/viewport conditions. Review frame traces/video for sequence and discontinuities; at least 95% of observed motion time has no visible stall over 100 ms or position jump. Record duration, stalled intervals, device/browser, and result. |
| SC-005    | Five representative viewers rate readability and animation comfort separately on a five-point scale after the full deck. At least four rate both at least 4.                                                                                                                                                                                     |

Automated tests do not stand in for these studies. Record outstanding acceptance evidence explicitly rather than reporting a completed feature before the specified outcomes are verified.

## Evidence to Retain

Record the implementation comparison SHA, dependency/runtime versions, red/green results, lint/format/type/build results, all-test outcomes, per-file coverage scope/percentages, browser viewport/project results, motion recordings, and anonymized viewer-study results. Review all five constitutional principles before acceptance; failed or omitted required checks block acceptance.

## Implemented application and retained evidence

The route and validation commands above are now implemented. Run `npm run dev` to
preview the Japanese deck at `/how-to-create-attractive-presentation-materials`.
The framework/React/GSAP core versions are unchanged.

Use the original comparison SHA for every coverage gate:
`a55afa5dc00fda3d8736971b445f9dad03131c3b`. Do not replace it with a later commit.

- Red/green and quality results: [implementation-evidence.md](implementation-evidence.md).
- Acceptance map: [acceptance.md](acceptance.md).
- Motion/frame/video report: [acceptance/motion-review.md](acceptance/motion-review.md).
- Participant studies: [navigation](acceptance/navigation-study.md) and
  [readability/comfort](acceptance/comfort-study.md).
- Generated full browser report: `playwright-report/index.html` and
  `test-results/results.json`. Successful motion videos, traces and screenshots are
  in `test-results/motion-*/`; frame JSON is attached to the report.
- V8 per-file line reports: `coverage/coverage-summary.json` and `coverage/lcov.info`.

The user deferred participant studies. Their tasks and final human acceptance remain
unchecked; automated evidence does not supply participant results.
