# Public UI Contract: Attractive Presentation

**Route**: `/how-to-create-attractive-presentation-materials`  
**Requirements**: [spec.md](../spec.md)  
**Data**: [data-model.md](../data-model.md)

## Entry and Content

- A fresh direct visit at the top renders the title scene and identifies the presentation in route metadata.
- Exactly four semantic scenes appear in the required sequence. All Japanese copy, presenter, fixed date, phrases, and six tip pairs match the specification verbatim.
- Provide one presentation `main` landmark with Japanese language context, a primary title heading, meaningful subsequent headings, paragraph semantics for the explanation, and a list of six cards with headings and content.
- The principles scene's visible left section contains only the three prescribed phrases on separate lines. Accessibility labeling must not add visible explanatory copy.
- The two illustrative mini-slides have meaningful accessible descriptions. The cue label provides its text meaning; the accompanying chevron is decorative and excluded from redundant screen-reader announcements.
- Static content remains readable and natively scrollable if animation enhancement is unavailable. Initial styles must not permanently hide the deck before successful client setup.

## Native Navigation

- Wheel, touch, trackpad, scroll bar, and normal browser scroll keys control the native document scroll position.
- No compulsory snapping, intercepted wheel/touch stream, or artificial navigation queue is introduced.
- Viewer position selects the current scene/transition. Rapid scrolling and direction changes converge to the newest position.
- Overscroll does not wrap the deck or leave a blank final destination. Browser-restored positions are reconciled to their scene instead of always restarting the title.

## Normal-Motion Behavior

| Scene/element    | Entrance/visible behavior                                                                              | Exit/continuity                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Title            | Title first, presenter/date next; fade/up                                                              | Forward fade/up; restored smoothly backward                                                              |
| Cue              | Fade after opening content; vertical Scroll + ChevronDown; repeating pair of subtle bobs               | Stable through title/explanation/principles; fade out toward tips; restored backward                     |
| Explanation text | Fade/up; exact two sentences                                                                           | Forward fade/up; backward fade/down                                                                      |
| Shared examples  | Enter after explanation; sequential fade/rotation; overlap and slight tilt; bounded subtle child shake | One pair persists unchanged through explanation/principles in both directions; leaves outside that range |
| Principles       | Only three separate phrases; fade/up                                                                   | Forward fade/up toward tips; backward fade/down toward explanation                                       |
| Tips             | Six cards fade/zoom with gentle elastic settling, row-major stagger                                    | Outer scene wrapper allows fade/down when returning to principles                                        |

Fading and ordinary travel use smooth easing; card settling uses a restrained elastic effect. Entrances, exits, and decorative children have separate property ownership. Returning to a settled scene restores its first-visit composition without duplicated content or accumulated transforms.

## Layout and Readability

- At 1280 × 720 and 1920 × 1080, explanation/principles use text on the left and the shared pair on the right. Tips use three columns and two rows with rounded cards, subtle shadows, and distinct title/content sections.
- At 390 × 844, all text and every card are reachable without horizontal scrolling. Cards reflow in DOM reading order.
- When viewport width/height or enlarged text prevents a pinned composition from fitting, use document flow. The shared example band remains sticky only inside the combined explanation/principles group, with reserved space and background to protect text readability.
- Resizing across modes preserves the current scene and reading location as closely as the new geometry allows. No text, cue, or illustration may obscure another required text block.
- The illustrations are built from local content rather than remote images. Without optional styles or embellishments, two understandable examples remain present; no broken-image state is required.

## Reduced Motion and Accessibility

- Respect `prefers-reduced-motion`, including changes while the page is open.
- Reduced mode is unpinned native flow, with content immediately visible and no travel, rotation, zoom/elastic effects, bobbing, or shaking. Cue visibility still reflects whether the viewer has reached the final scene.
- Unenhanced/flow content preserves semantic reading order. In pinned mode, inactive overlaid scenes must be removed from hit testing and the active accessibility representation so invisible duplicates are not read. Do not remove nodes needed for shared visual continuity.
- Do not announce every animation frame or steal focus when scenes change.

## Observable Validation Surface

Use accessible roles/text for content assertions. Stable internal scene/card/example identifiers may support geometry and DOM-identity checks; they are testing hooks, not visible implementation controls. Browser validation must examine computed opacity/transforms and visible bounds as well as element presence, because DOM existence alone does not establish visual visibility.

| Outcome                 | Required evidence                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Exact content and order | All four scenes and six card pairs match the specification                                                         |
| Opening/stagger order   | Sample real rendered changes and show title before attribution, text before examples, cards in row-major order     |
| Shared continuity       | Same two DOM nodes throughout both explanation/principles directions; no parent disappearance or arrangement reset |
| Reverse behavior        | All three reverse paths show downward outgoing movement and correct restoration                                    |
| Reliability             | Six adjacent paths and twenty round trips, plus fast reversals, end overshoot, and resize/preference changes       |
| Responsive usability    | Specified desktop grids; all narrow-screen content reachable; no overlap/horizontal overflow                       |
| Reduced motion          | All content/paths retained with decorative transforms and loops absent                                             |

## Out of Scope

No editing UI, accounts, saved progress, presentation exports, new decks, or data API is introduced. This contract describes the presentation's user-facing interface; controller internals are defined separately.
