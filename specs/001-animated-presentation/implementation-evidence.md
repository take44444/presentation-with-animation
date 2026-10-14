# Implementation evidence

Comparison base: `a55afa5dc00fda3d8736971b445f9dad03131c3b` (retain for every coverage comparison).
Branch: `how-to-create-attractive-presentation-materials`; no branch change.
Runtime: Node 24.17.0, npm 11.13.0, TypeScript 5.9.3.
Core: Next 16.4.0, React/React DOM 19.3.0, GSAP 3.15.0, @gsap/react 2.1.2.

## T001

Read AGENTS.md and installed Next guides: layouts/pages, server/client components,
CSS Modules, metadata, Jest, Playwright, and CLI (typegen, standalone ESLint).
Read spec, plan, research, data model, both contracts, quickstart, tasks and constitution.
Requirements checklist: 16 checked / 0 unchecked. YAML parsed with Python safe_load;
optional pre-commit skipped on a clean tree; mandatory post-commit registered.

## Setup progress and blocking condition

T002 remains unchecked. npm dependencies and Chromium/Firefox/WebKit binaries installed.
Core package versions retained. New resolved packages: Lucide 1.56.0; Jest/jsdom
30.5.2; Playwright 1.64.0; Prettier 3.9.10; TypeScript ESLint 8.71.2.

Prepared (not phase-accepted) T003–T006 configuration: next/jest + jsdom/V8 coverage
for all application source, production Playwright server with preceding build,
nine browser/viewport projects, formatting and validation scripts, artifact ignores.
Package is private; npm publishing ignores are not applicable. No Docker, Terraform,
Helm or legacy ESLint configuration detected. ESLint global ignores cover generated,
dependency, report and minified files.

Blocking verification:

- `npx playwright install chromium firefox webkit`: binaries downloaded; host library
  warning includes GTK4, GStreamer, libavif and others.
- Escalated `npx playwright install-deps chromium firefox webkit`: exit 1,
  `sudo: a terminal is required to read the password` / `sudo: a password is required`.
- Minimal browser DOM smoke: Chromium passes. Firefox fails inside the sandbox
  with a profile-directory error; the required escalated retry passes. WebKit fails
  even outside the sandbox because host libraries are missing.
- User action required in their terminal:
  `sudo npx playwright install-deps chromium firefox webkit`.

Implementation skill requires stopping after a non-parallel task failure. Dependent
feature work is halted at T002; no presentation route has been created. Tooling drafts
prepared while dependency installation was in progress are retained for resumption,
but no later task is marked complete before its prerequisite checkpoint passes.

## Prepared foundational test evidence (not phase completion)

- `npm test -- --runInBand tests/unit/setup.test.ts`: 1 passing DOM/tooling assertion.
- `npx playwright test --list`: discovers 9 baseline smoke cases; execution of the
  complete browser matrix remains blocked by WebKit host libraries.
- T007/T008 red command:
  `npm test -- --runInBand tests/unit/lint-rules.test.mjs tests/unit/coverage-gate.test.mjs tests/unit/app-shell.test.tsx`.
  Before rule/gate implementation, 16 expected assertion failures: 12 missing
  annotation/docs rejections and 4 missing coverage failures. Six assertions passed.
  These tests used a permissive loadable test-only seam when the target was absent.
- Same command after implementing local rules and per-file validator: 22/22 passing.
  Existing home/layout assertions passed before and after annotation/format normalization.
- T013 compiler-backed consumer tests prepared; initial module-resolution setup
  failure is explicitly **not** red evidence. Corrected to an in-memory module
  containing the unconstrained test baseline plus consumer fixture. Corrected run:
  10 intended expected-rejection failures, 2 passes, including valid consumers.
  The production type module does not exist; these tests intentionally remain red
  until the prerequisites allow T014. No invalid import failure is counted.
- `npm run lint`: passes with zero warnings after tooling cleanup.
- `npm run typecheck`: Next route type generation and TypeScript pass. Installed
  LayoutProps requires `params`, which the baseline layout fixture now supplies.

No user-story, production browser, motion-review or human-acceptance gate is claimed.

## Final partial-run validation

`npm run test:coverage`: 25 passing assertions / 10 intended contract rejection
failures; 4 suites pass / 1 is deliberately red before production type implementation.
This is not a passing all-test gate. V8 reports `coverage/coverage-summary.json` and
`coverage/lcov.info` contain 100% executable lines for each changed scaffold file:
`app/layout.tsx` and `app/page.tsx`.

`npm run coverage:check -- --base a55afa5dc00fda3d8736971b445f9dad03131c3b`: passes,
both changed executable application files individually 100%.

Prettier check over prepared source/config/test files passes. Global formatting and
production build/E2E/feature acceptance remain unexecuted; they are later checkpoints.
T001 is checked; T002–T065 remain unchecked. Checklist markers were not changed.
Mandatory `after_implement` hook: dispatched through the configured auto-commit script
with event `after_implement`; commit style `fixed`, enabled. This commit saves partial
progress and does not signify feature acceptance.

## Resumption: T002–T013

User installed OS dependencies. Native Chromium, Firefox and WebKit each launch and
render the DOM smoke successfully inside the sandbox. T002 is unblocked. T003–T006
configuration and T007–T012 prepared tooling are now verified against their recorded
red/green evidence. T013 has its intended compiler rejection failures recorded;
production types follow next. Original comparison base is unchanged.

## T014–T017

T014 production readonly discriminated contracts: all 12 compiler-backed fixtures pass.
T015 mapping tests first: 5 expected assertion failures on the permissive test seam.
T016 same tests after pure mapping implementation: 5/5 pass, including unequal long
reading intervals, latest current visibility, bounds, invalid geometry and anchors.
T017 typed resource clock and measured geometry fixtures added. Typecheck passes.
Global authored formatting normalized with Prettier; checklist markers unchanged.

## T018 foundation checkpoint

40/40 foundational assertions pass, including all actual production type fixtures.
Lint, global format check, typecheck and per-file coverage gate pass. Scroll model
92.12% lines; changed layout/home each 100%. The erased readonly type module has
no executable lines and is excluded specifically from Jest runtime coverage; the
compiler fixtures continue to read it. Production smoke: all nine projects pass.

US1 red unit run: 5 intended behavior failures (exact metadata, Japanese opening,
opening/driver/restoration state). Browser red run checks missing rendered opening
on a real production server before route implementation.

## US1/US2

US1 units pass (51 applicable assertions before adding US2); actual DOM timeline
assertion found a missing initial driver and passed after scoped context ownership
was corrected. Browser CSS assertion found Tailwind's generic loader erasing CSS
Module exports; installed Turbopack guide read and loader limited to globals.css.
Actual opening/cue/title exit passes in production Chromium. Coverage at this slice:
controller 90.74%, scroll model 92.12%, all other application files 100%.
Lint/typecheck pass.

US2 red: missing teaching heading/pair semantics and missing stagger/visibility
behavior failed in units; production browser failed missing heading before code.
After implementing one local pair and teaching group, rendered copy tests pass.
Controller sample caught explanation not complete before examples: entrance timing
corrected to finish text before the staggered pair. The shared parent's arrangement
is held throughout explanation/principles and exits only outside that lifetime.
Production Chromium desktop/mobile: 4/4 US1+US2 scenarios pass.

## US3 and US4 / fallback review

US3 red: rendered six-card heading/order and real card-stagger assertions failed
before the final component/timeline existed; browser card-count assertion failed on
production. Green: all exact pairs/order pass in units; nine Chromium scenarios
pass at 1280×720, 1920×1080 and 390×844, including 3×2 bounds and every mobile card.

US4: latest-target supersession, stale completion rejection, all reverse poses and
idempotent disposal pass in authored playback/real GSAP tests. Browser all-six-path
suite completes twenty round trips; current pair/cue/semantic scene state remains
correct. Resize across modes and runtime reduced preference retain the pair and
readable content. Already-correct bounded reverse traversal needed verification,
not an artificial red run or a second directional timeline.

T058 accessibility: semantic/native fallback unit assertion and three production
browser scenarios pass: JavaScript-disabled flow, reduced motion/keyboard scrolling,
and inert inactive scenes/enlarged-text fit guard. Optional styles are absent in
Jest; the two local examples remain self-contained accessible compositions.

Additional setup-failure review found two genuine defects. New assertions first
failed because partial ScrollTrigger creation left an owned master alive, and invalid
flow measurements still enabled hiding. Fix: retain the scoped context before setup,
catch setup failure inside the context callback so GSAP restores its ambient context,
revert only owned resources, and reject invalid measured flow geometry before hiding
anything. Both corrected tests pass. Empty style attributes from GSAP reversion are
accepted only when they contain no authored hidden/transform properties.

Public contracts, variables, parameters and returns were audited with explicit-type,
no-any and documentation rules. Component lifecycle tests verify each owner is
removed on unmount/remount, and no global trigger-killing API is used.

## Restoration and final-review corrections

Actual browser reload at native scroll 2160 reset to scroll 0 during pinned layout
setup. `tests/e2e/restoration.spec.ts` first failed its nonzero-position assertion
against the owned production server (isolated test config in `/tmp` did not start or
reuse an unrelated server). Fix: capture native position before layout teardown,
reconcile the master against that position, then restore native scroll after the
pin spacer exists and update the owned trigger. The new Chromium reload/history
scenario passes in a fresh production build.

A new pinned-anchor test failed before the model exposed actual reading intervals.
After `pinnedGeometry` was implemented, it preserves the scene/local reading fraction
using measured pin span and finite hold/transition labels; controller media rebuilds
now use the same capture/restore model in both modes. All 16 model/DOM regression
assertions pass, and typecheck passes.

An intermediate full browser pass after failure-handling changes reported one
Firefox-mobile motion sample at 94.766% continuity (target 95%) while other diagnostics
were running; 98 cases passed. This is not accepted as a passing gate. Motion traces
are now attached before threshold assertion so failures retain their measurements.
The final browser matrix is rerun after all corrections, with no competing browser
or coverage workload and with the same 95% threshold.

The user explicitly deferred both participant studies in the current session.
T063/T064 and final human acceptance remain pending; templates have no invented data.

## Startup refresh and WebKit navigation

A real GSAP startup-seam assertion failed when ScrollTrigger creation reported tiny
residual progress: it replaced the intended opening driver with a 0.25-second target.
Fix: ignore updates during owned trigger initialization and GSAP refresh. The flag
is checked through typed `in`/boolean narrowing because the installed runtime exposes
`isRefreshing` but its bundled declarations omit that property. The opening driver
now retains its ordered sequence; actual native early-scroll takeover is exercised
in production browser tests.

WebKit reload/history scenarios exposed native restoration differences. A controlled
static HTTP page with no application JavaScript showed WebKit reload resetting
native scroll to zero. The presentation supplements the current native history
entry with its route/viewport position on `pagehide`, preserves existing router state,
and restores that viewport on reload/back-forward or persisted `pageshow`. This is
per-entry browser navigation state; there is no application account, local/session
storage, database or saved-progress feature. Unknown history data is narrowed and
validated before use. The failing history-metadata assertion is now green, including
router-field preservation, pagehide capture and persisted-pageshow rebuild. All three
WebKit viewport restoration cases pass in a fresh production build.

Final authored-source audit: ESLint zero warnings, Prettier global check and Next
route type generation/TypeScript pass. Jest: 63/63 assertions, 12/12 suites. Per-file
V8 lines: controller 96.36%, scroll model 93.58%, every other executable changed/new
application file 100%. The original-base coverage validator passes for all 11 files.

## Final engineering gate

Production build and all 117 Playwright cases pass across nine projects; no skips,
failures or retries. The final run took 405.9 seconds.
All six adjacent paths plus twenty round trips run in each desktop project; normal
flow and reduced-motion content remain reachable in each mobile/browser project.
Actual early native scrolling, initial refresh guard, runtime preference/media
changes, JavaScript-disabled flow, inert scenes and all-engine reload/history
restoration are green. See `playwright-report/index.html` and `test-results/results.json`.

SC-004 frame review: 47.849s observed / 1.650s stalled intervals;
96.55% continuity. Full measurements and artifact references
are in `acceptance/motion-review.md` and `acceptance/motion-summary.json`.

T001–T062 are complete and checked. T063/T064 participant studies and T065 final
human acceptance remain unchecked under the user's explicit deferral. Acceptance
mapping and study templates are prepared; no feature acceptance or participant
results are claimed. The configured mandatory post-implementation commit hook follows.
