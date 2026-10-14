# Data Model: Animated Presentation

**Feature**: [spec.md](spec.md)  
**Plan**: [plan.md](plan.md)

## Persistence and Validation Boundary

All content is immutable application data; no database, user records, session storage, or network payloads are involved. Runtime state lasts only for the mounted presentation. Use explicit TypeScript declarations, readonly collections, and literal unions. Validate the authored data through requirement-derived tests rather than adding a runtime schema library.

## Presentation

| Field       | Type/constraint                                            | Purpose                                |
| ----------- | ---------------------------------------------------------- | -------------------------------------- |
| id          | Stable literal `attractive-presentation`                   | Identifies this fixed deck             |
| route       | Literal `/how-to-create-attractive-presentation-materials` | Public location                        |
| title       | Exact string from spec, Slide Content                      | Opening and metadata title             |
| presenter   | Literal `Takeshi Masumoto`                                 | Presenter attribution                  |
| presentedOn | Literal ISO date string `2026-10-03`                       | Fixed displayed date; not current time |
| language    | Literal `ja`                                               | Language of presentation content       |
| slides      | Readonly ordered four-element tuple                        | The four scenes                        |
| examples    | Readonly two-element tuple                                 | Shared visual reference                |

Validation: exactly four scenes in the required order; exact title/presenter/date; no automatically generated date. Content values are authoritative in [spec.md](spec.md#slide-content), not redefined here.

## Slide

Use a discriminated union with `id`/`kind`: `title`, `explanation`, `principles`, `tips`. Do not force every scene into optional text fields.

| Variant          | Fields                                 | Relationships/constraints                                                                                       |
| ---------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| TitleSlide       | id, kind, order=1                      | Reads presentation title, presenter, and date                                                                   |
| ExplanationSlide | id, kind, order=2, heading, paragraphs | Exact heading and two prescribed sentences; references the shared example pair                                  |
| PrinciplesSlide  | id, kind, order=3, phrases             | Readonly three-element tuple in exact order; no additional left-side explanatory copy; references the same pair |
| TipsSlide        | id, kind, order=4, heading, cards      | `その他のTips`, exactly six ordered TipCards                                                                    |

The shared pair belongs to the presentation and is mounted once in the combined explanation/principles group. Both scene references point to the same entities; they do not create separate artwork copies.

## ExampleDesign

| Field           | Constraint                                                                    |
| --------------- | ----------------------------------------------------------------------------- |
| id              | Stable unique identifier, `example-1` or `example-2`                          |
| accessibleLabel | Meaningful Japanese description of the simplified design                      |
| composition     | Local mini-slide content/layout variant demonstrating uncluttered composition |
| restingRotation | Small bounded absolute angle selected during visual tuning                    |
| layerOrder      | Distinct stacking order within the overlapping pair                           |

Validation: exactly two examples; readable self-contained composition; overlap and slight resting rotation in normal-motion mode. Resting layout and decorative shake use different wrappers. Neither rotation nor displacement accumulates after navigation. Reduced-motion mode removes rotation while retaining the examples.

## TipCard

| Field   | Constraint                                        |
| ------- | ------------------------------------------------- |
| id      | Stable unique identifier, `tip-1` through `tip-6` |
| order   | Integers 1–6, unique and increasing               |
| title   | Exact title from the corresponding spec row       |
| content | Exact content from the corresponding spec row     |

The card order is simultaneously the DOM order, reading order, desktop row-major position, and stagger order. Desktop coordinates are derived from order, not maintained as a second source of truth.

## ScrollCue

Static fields: label `Scroll`, Lucide `ChevronDown` icon, vertical text orientation. Derived state: visible opacity, whether its repeating child motion may run, and whether the opening has reached the cue segment.

Visibility rules: fade in after the title/presenter/date sequence; remain visible throughout all title/explanation/principles holds and their transitions; fade out during the transition to tips; restore when moving back from tips. No saved dismissal state exists.

## Runtime Types

| Type             | Fields/constraints                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| LayoutMode       | `pinned` or `flow`; reduced motion always uses flow                                                                               |
| MotionPreference | `normal` or `reduced`                                                                                                             |
| SceneId          | `title`, `explanation`, `principles`, `tips`                                                                                      |
| ScrollDirection  | `forward`, `backward`, or `stationary`                                                                                            |
| SceneGeometry    | SceneId, measured start/end scroll positions, entrance/reading/exit intervals; finite ordered numbers                             |
| TimelineLabels   | Ordered finite labels for openingEnd, scene holds, transition ranges, examples-visible range, cue-fade range, final settled state |
| ControllerState  | lifecycle, currentTime, targetTime, targetScene, direction, layoutMode, motionPreference, openingComplete                         |
| ViewportAnchor   | SceneId and clamped local reading fraction, used during geometry rebuild                                                          |

Use typed DOM references and GSAP Timeline/Tween/ScrollTrigger handles as runtime resources, not serializable content fields. Unknown external values must be narrowed; neither application values nor dependency fakes may use `any`.

### Geometry Mapping

- In pinned mode, normalize native position across the measured pin range to progress 0–1. Map to `openingEnd + progress × scrollTimelineDuration`.
- In flow mode, use each section's measured entrance/reading/exit ranges. Interpolate only through animation ranges; hold the scene's settled time while its text/cards are being read. Never divide the entire document into four equal viewport slices.
- Clamp overshoot to the title hold or final settled state. Reject non-finite/invalid geometry and preserve readable static content if setup cannot complete.
- Current master time determines the visible transition state. Target time/scene describe the newest scroll request; they may differ while the driver catches up.
- Decorative-loop eligibility is derived from current parent visibility and motion preference, not merely the last entered scene callback.

### State Transitions

| Event                              | From                   | To/action                                                  | Invariant                                                       |
| ---------------------------------- | ---------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Mount at top, normal motion        | uninitialized          | opening driver targets openingEnd                          | One master and at most one playhead driver                      |
| Mount with restored nonzero scroll | uninitialized          | reconcile current target from geometry                     | Do not force a return to slide 1                                |
| Actual scroll during opening       | opening                | replace startup driver with current-position scroll target | Preserve current master time and element state                  |
| Scroll/update                      | opening/ready/tracking | replace driver, update newest target                       | Old target cannot complete later and restore stale content      |
| Scroll stops                       | tracking               | ready at newest target                                     | No incomplete destination after settling                        |
| Reverse progress                   | tracking/ready         | traverse master toward lower time                          | Current changing scene exits downward                           |
| Viewport or preference change      | any mounted state      | capture anchor, revert resources, rebuild, reconcile       | No duplicate examples/triggers/loops; content remains reachable |
| Unmount                            | any mounted state      | disposed; stop owned resources                             | No callbacks mutate unmounted content                           |

### Adjacent Scene Relationships

| Path                     | Changing content                               | Shared examples                 | Cue      |
| ------------------------ | ---------------------------------------------- | ------------------------------- | -------- |
| Title → Explanation      | Title exits up; explanation enters up          | Enter after explanation text    | Visible  |
| Explanation → Principles | Explanation exits up; principles enter up      | Same nodes and arrangement held | Visible  |
| Principles → Tips        | Principles/examples exit up; tips enter        | Leave                           | Fade out |
| Tips → Principles        | Tips exit down; principles restore             | Restore same pair               | Fade in  |
| Principles → Explanation | Principles exit down; explanation restores     | Same nodes and arrangement held | Visible  |
| Explanation → Title      | Explanation/examples exit down; title restores | Leave                           | Visible  |

Reduced motion replaces these transforms with immediate visibility and native flow while retaining content and cue state. Nonadjacent rapid requests may traverse or skip intermediate timeline poses but must converge to the latest valid destination without drift or stale content.
