# Internal Interface Contract: Presentation Animation Controller

**Purpose**: Coordinate the public [UI contract](presentation-ui.md) using GSAP and ScrollTrigger without conflicting motion owners. This is an internal typed interface, not a public HTTP API.

## Inputs and Resources

The client shell supplies a scoped root, typed refs for all scene wrappers, opening children, cue wrappers, example entrance/shake wrappers, and six cards in data order. Content comes from immutable [data-model.md](../data-model.md) entities. Missing required refs or invalid geometry must leave readable static content and dispose partial setup.

The controller owns:

- One paused finite master timeline.
- At most one active playhead driver Tween, either opening or scroll-targeting.
- Owned ScrollTriggers for geometry/progress and final-scene tracking as needed by layout mode.
- Separate bounded/repeating decoration timelines for cue and examples.
- Its own media context, observers/listeners, and scheduled refresh work.

Use explicit public input/output/resource types, documented parameters/returns and side effects, `unknown` plus narrowing at external boundaries, and no `any`.

## Master Timeline Contract

1. Opening sequence: title fade/up, attribution fade/up, then cue fade-in; mark `openingEnd` after these elements appear.
2. Title hold and exit lead into explanation text entrance, followed by the staggered example entrance.
3. Hold the shared pair's outer layout and visibility through explanation exit and principles entrance/hold. No intervening arrangement tween exists.
4. Principles and examples exit before tips settle; cue fades out during the final transition.
5. Tips enter with an outer vertical/fade wrapper and individually staggered scale/fade cards. Final hold is fully visible.
6. Backward traversal restores these same bounded states; it is not implemented as a second set of directional element tweens.

Avoid relative transform values and future `from` tweens that immediately overwrite previously visible state. Define initialization deliberately and keep decorative descendants separate from entrance/exit wrappers.

## Scroll/Startup Ownership

- At initial scroll zero, create an opening driver with `master.tweenTo(openingEnd)`.
- Do not let ScrollTrigger initialization or zero-progress refresh prematurely finish that opening.
- On the first real scroll change, kill only the old playhead driver. Retarget the master from its current time toward the latest mapped scroll time; do not reset scene elements.
- At restored nonzero positions, initialize to the corresponding scene and avoid an unrelated visible opening playback.
- Pinned mapping: `targetTime = openingEnd + clamp(progress, 0, 1) × scrollTimelineDuration`.
- Flow mapping: derive scene entrance/hold/exit time from measured section positions. Reading spans hold fully visible content. Long final content stays fully visible until its natural document end.
- Do not configure a second automatic scrub owner for the same master. Initially use a 0.25-second retarget duration, with smooth convergence from actual current time.
- Each new request replaces the previous target. No queued transitions or stale driver completion callbacks may write content state.
- Infer direction from scroll delta or target/current time; `tweenTo` does not change `timeline.reversed()`.

## Derived Visibility and Decoration

Current master time/visibility drives the presented state; newest target time may be ahead while motion settles. Synchronize derived visibility from current rendered progress instead of only firing scene-entry callbacks, which can be missed on jumps.

- Cue loop runs only in normal motion while the cue is visibly active. It has exactly two small up/down movements per repeat cycle, followed by a pause. Hidden final-state cue has no running loop.
- Example child shake is bounded around a neutral child transform, never modifies parent resting rotation, and pauses outside the shared visible range.
- Returning from tips restores the same example nodes and cue; returning between principles/explanation does not restart the pair's entrance.
- Neither infinite loop is nested into the finite master.

## Layout/Preference Rebuild

Select pinned mode only for the desktop media range and verified content fit. Otherwise use flow mode with the shared sticky example group and native final-card flow. Reduced motion always uses flow and suppresses every decorative transform/loop.

Before rebuilding, capture the current scene and local reading fraction. Revert previous GSAP/media-owned styles and resources, rebuild layout measurements, restore the anchor against new geometry, and reconcile the current scene. Coalesce observer refresh requests; do not rebuild on every animation tick. An unrelated resize at scroll zero must not repeatedly replay the opening.

## Disposal and Lifecycle

Create the controller within `useGSAP`'s root scope. Callbacks that create tweens after setup must be context-safe. Disposal kills the current driver, reverts the controller's media context, stops decorations, removes owned triggers/listeners/observers, and cancels pending refresh work. It is idempotent, preserves other routes' resources, and prevents late callbacks from mutating removed nodes. Do not use global `ScrollTrigger.killAll()`.

React development setup/cleanup/setup and route unmount/remount must leave exactly one live resource set and exactly one shared example pair. Successful setup activates enhanced visibility styles; failed setup/disposal restores a readable native-flow fallback.

## Validation Boundaries

Jest executes the real authored mapping and controller with typed dependency/geometry seams where needed, testing current/target state, superseded requests, reduced-motion behavior, and disposal. These tests must not merely assert a list of GSAP method calls.

Playwright executes real GSAP/ScrollTrigger to validate rendered ordering, reverse displacement, shared identity, smooth early-scroll handoff, fast reversal, twenty round trips, responsive geometry, and preference/lifecycle rebuilds. No production global controller handle or visible debugging panel is required.
