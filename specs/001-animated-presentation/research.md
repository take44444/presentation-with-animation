# Research: Animated Presentation

**Date**: 2026-10-14  
**Feature**: [spec.md](spec.md)

## Repository Findings

- Installed: Node 24.17.0, npm 11.13.0, TypeScript 5.9.3, Next.js 16.4.0, React/React DOM 19.3.0, GSAP 3.15.0, and `@gsap/react` 2.1.2.
- The repository has a root `app/` directory, a starter page/layout, Tailwind 4 global styles, strict TypeScript, and Next's ESLint flat presets. It has no presentation route or tests.
- Jest, Playwright, Prettier, and Lucide are absent. Their installation and configuration belong to implementation, before feature tests and production code.
- `setup-plan.sh --json` resolves the persisted feature directory correctly but reports `001-animated-presentation` as its branch identifier. `git branch --show-current` confirms the actual branch is `how-to-create-attractive-presentation-materials`; retain that branch.
- The constitution and specification-quality checklist were reviewed before research. The proposed design meets all five principles; missing development tools are mandatory implementation work, not waived checks.

## 1. Route, Rendering, and Styling

**Decision**: Add a synchronous Server Component at `app/how-to-create-attractive-presentation-materials/page.tsx`, with typed static metadata and a route-local Client Component for browser animation. Store fixed content in a typed module and use a CSS Module for presentation layouts.

**Rationale**: The installed guides confirm filesystem routing, the client boundary for browser APIs, serializable props, server-only metadata exports, and scoped CSS support. No data fetch or asynchronous route is needed. Render semantic content before animation setup; apply Japanese language metadata to the presentation content wrapper. Use a Japanese system font stack without adding remote font dependencies.

**Alternatives considered**: Making the whole application client-rendered enlarges the boundary unnecessarily. Disabling server rendering makes initial content depend on JavaScript. CSS-in-JS and a new styling framework add unnecessary dependencies.

**Sources inspected**: Installed `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`, `05-server-and-client-components.md`, `11-css.md`, `14-metadata-and-og-images.md`, and `01-app/03-api-reference/01-directives/use-client.md`. These local, version-specific guides take precedence over remembered framework conventions.

## 2. Timeline Ownership and Early Scrolling

**Decision**: Create one paused, finite GSAP master timeline containing the opening and all subsequent entrances/exits. On initial top-of-page load, drive it to `openingEnd` with `tweenTo`. A standalone ScrollTrigger maps native scroll progress to the timeline's remaining range. On actual scrolling, replace the previous playhead tween and retarget from the master's current time. Do not also enable ScrollTrigger's built-in scrub on this master.

**Rationale**: This is a design conclusion using GSAP's documented killable playhead tween. A single owner preserves current element state when scrolling interrupts the opening or changes direction. Ignore initialization/refresh at zero progress during the first opening; restored nonzero positions reconcile immediately. A short smoothing duration, initially 0.25 seconds, bounds settling after the last scroll update. Use scroll direction or target/current time to identify direction, because `tweenTo` does not change the timeline's reversed flag. [GSAP tweenTo reference](<https://gsap.com/docs/v3/GSAP/Timeline/tweenTo()/>)

**Alternatives considered**: Separate entrance/exit callbacks for every scene introduce conflicting property writers and stale completion callbacks. A scrubbed scene timeline plus separate startup timeline requires a more complicated handoff. A latest-target driver needs neither a transition queue nor wheel/touch interception.

## 3. Reverse Transitions and Shared Examples

**Decision**: Animate scene wrappers from positive vertical offset to zero on entrance and from zero to negative offset on forward exit. The master traverses the same values backward for downward exits. Give the final scene a vertical entrance wrapper around its individual scale/fade card entrances. Mount exactly one example pair; enter it after slide 2's text, hold its arrangement through slides 2 and 3, and exit it before the final scene.

**Rationale**: Reversing the master's finite timeline restores previous states without rebuilding the illustrations. Use absolute transform endpoints instead of relative increments. Separate example entrance/layout wrappers from their shake descendants so decorative rotation cannot overwrite the arrangement. The plan intentionally permits transient outgoing/incoming content during a transition but guarantees complete, correct settled states.

**Alternatives considered**: Rendering another pair on slide 3 breaks identity and risks replaying entrances. Independently accumulating relative rotation or displacement causes drift across repeated round trips.

**Source**: Installed GSAP timeline types and implementation; the scroll/time ownership pattern follows the [ScrollTrigger reference](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Wrapper ownership and the shared lifetime are design decisions derived from FR-007–FR-011.

## 4. Responsive Scroll Geometry

**Decision**: Use a pinned viewport stage only where all scene layouts fit: initially width at least 1024 pixels and height at least 640 pixels, additionally guarded by measured content fit. Animate stage descendants, not the pinned node. For narrow, short, or enlarged-text layouts, use native document-flow scenes with a shared sticky example band constrained to the slide-2/3 group. Reserve its footprint and an opaque background so text remains readable below it. Keep the final tips in normal flow in this mode.

**Rationale**: Desktop pinning supports a stable presentation composition. Native flow keeps all six cards reachable at 390 × 844 and avoids translating a large card grid through a clipped viewport. Both modes use ScrollTrigger with measured functional boundaries and the same finite scene ordering. Flow-mode mapping assigns each scene its own entrance, reading hold, and exit interval; a long final reading interval holds the master at its fully visible final state. Refresh after fonts/layout settle and on resize; preserve the current slide and local reading position across a mode rebuild. [ScrollTrigger reference](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

**Alternatives considered**: Always pinning can clip tall cards or enlarged text. A measured inner reading translation could make an always-pinned stage work but adds an unnecessary second scroll mapping. Scroll snapping or custom wheel handling would reduce native navigation control.

## 5. Decorative Motion, Reduced Motion, and Cleanup

**Decision**: Keep cue bobs and example shaking outside the finite master. The master owns parent visibility; child timelines own decorative movement. The cue repeats two small bobs followed by a pause. Pause loops when their parent is hidden and resume when visible. Use `gsap.matchMedia()` for layout and reduced-motion conditions, and `useGSAP` with a component scope for lifecycle ownership.

**Rationale**: A finite scroll/time range must not contain infinite repeats. Reduced-motion mode uses document flow, immediate content visibility, no travel/rotation/elastic effects, and no decorative loops. It still tracks the final scene to hide the scroll cue. Context-safe callbacks capture animations created after setup; explicitly dispose media contexts, observers, listeners, and owned triggers on unmount. Never call a global trigger-kill operation. [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>), [GSAP React integration](https://gsap.com/resources/React/)

**Alternatives considered**: CSS-only motion toggles leave JavaScript loops running. Adding repeated decorations to the master invalidates its bounded duration. Relying only on component unmount ignores preference and viewport changes.

## 6. Artwork and Icon

**Decision**: Draw the two examples as local, self-contained semantic HTML/CSS mini-slides. Use a named `ChevronDown` import from `lucide-react` for the cue, as requested by the original requirements.

**Rationale**: Simple example composition needs neither generated raster artwork nor remote image requests. Their built-in HTML content remains readable if styling or optional embellishments fail, satisfying the visual fallback requirement without an image-loading state machine. Lucide provides typed, individually imported inline SVG icons. [Lucide React guide](https://lucide.dev/guide/react)

**Alternatives considered**: External image URLs introduce avoidable failure modes. AI-generated images are unnecessary for these simplified examples. Replacing the requested icon with another library would lose an explicit source constraint.

## 7. Test Stack and Red-Green Evidence

**Decision**: Configure Jest with `next/jest`, jsdom, React Testing Library, and V8 line coverage. Configure Playwright against a production build in Chromium, Firefox, and WebKit. Write behavior tests and observe their intended assertion failures before implementing each feature slice.

**Rationale**: The installed Next guides support synchronous Server/Client Component unit tests and production-browser validation. Tests exercise the real authored controller and pure progress mapping; replace browser geometry and external animation dependencies only at typed boundaries where necessary. Assert visible state, target replacement, lifecycle disposal, ordering, and shared identity rather than copying animation call lists. Real browser tests verify transforms, stagger, continuity, pinning, and responsiveness. Missing tooling/import failures are setup issues, not valid feature red evidence.

**Alternatives considered**: Another unit runner conflicts with the constitution. Broad snapshots do not prove navigation or animation behavior. Browser-only tests make authored control logic harder to cover and diagnose.

**Sources inspected**: Installed `node_modules/next/dist/docs/01-app/02-guides/testing/jest.md` and `playwright.md`; [Playwright webServer](https://playwright.dev/docs/test-webserver).

## 8. Coverage, Explicit Types, and Public Documentation

**Decision**: Require at least 80% executable-line coverage for each changed application `.ts`/`.tsx` file. Collect all feature application files, including unimported ones, and enumerate any changed shared application files against an explicit implementation base. Fail on absent reports or any file below the threshold. Produce text, JSON summary, and LCOV reports. Use ESLint flat configuration and Prettier, with explicit-annotation and public-documentation enforcement.

**Rationale**: Per-file checking prevents aggregate coverage from hiding untested controller/component files. Jest supports coverage collection and thresholds. TypeScript strict mode alone does not require explicit annotations. Because the typedef rule is deprecated, use a small tested local ESLint rule for variable, binding, parameter, and member annotations; maintained return-type/no-explicit-any rules cover the remaining restrictions. Turn off conflicting no-inferrable-types. Review public documentation for purpose, parameters, return values, side effects, and constraints. Normalize the small existing TypeScript scaffold where necessary for global lint compliance and include changed application files in coverage. [Jest coverage configuration](https://jestjs.io/docs/configuration#coveragethreshold-object), [typedef deprecation](https://typescript-eslint.io/rules/typedef/), [explicit return types](https://typescript-eslint.io/rules/explicit-function-return-type/), [no explicit any](https://typescript-eslint.io/rules/no-explicit-any/), [ESLint custom rules](https://eslint.org/docs/latest/extend/custom-rules)

**Alternatives considered**: A global-only threshold violates the constitution. Excluding the animation controller conceals the main feature behavior. Introducing a deprecated rule creates avoidable maintenance risk. Require Google-compatible formatting and review against the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html), with the constitution's stricter annotation requirements taking precedence.

## 9. Acceptance Evidence Beyond Automated Tests

**Decision**: Keep viewer studies and motion review as explicit acceptance work: ten first-time viewers for SC-002, five representative viewers for SC-005, and frame traces/video for SC-004.

**Rationale**: Browser navigation tests establish repeatability, not human discoverability or comfort. Record the specified pass rates, ratings, elapsed times, and animation continuity evidence instead of treating test success as proof of these outcomes.

**Alternatives considered**: Substituting developer opinion or passing unit tests for the specified human outcomes would not validate the success criteria.

## Resolution

All technical unknowns are resolved. No specification clarification or constitution exception is needed. Implementation must confirm the responsive measurements and installed-version behavior through the planned tests; this research does not claim the feature has been built or tested.
