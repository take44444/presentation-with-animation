# Feature Specification: Animated Presentation on Attractive Slide Design

**Feature Branch**: `how-to-create-attractive-presentation-materials`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Create spec from the requirements in .input/requirement/how-to-create-attractive-presentation-materials.md. You don't need create a new branch. It is already created."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter the Presentation (Priority: P1)

As a viewer, I open the presentation and see its topic, presenter, and date appear in sequence, followed by a clear invitation to scroll.

**Why this priority**: The opening identifies the presentation and makes its primary interaction discoverable without instructions.

**Independent Test**: Open the presentation route at its initial position and observe the opening sequence without visiting any later slide.

**Acceptance Scenarios**:

1. **Given** a viewer starts at `/how-to-create-attractive-presentation-materials`, **When** the presentation opens at the top, **Then** the title slide displays `惹きつけるプレゼン資料の作り方`, `Takeshi Masumoto`, and `2026-10-03`.
2. **Given** the opening sequence begins, **When** its elements appear, **Then** the title fades in while moving upward first, followed by the presenter and date with the same entrance behavior.
3. **Given** all three opening elements have appeared, **When** the scroll cue appears, **Then** vertically written `Scroll` and a downward chevron fade in and repeat a gentle two-bob cycle.
4. **Given** the title slide is visible, **When** the viewer scrolls toward slide 2, **Then** the opening content fades out while moving upward and the scroll cue remains visible.

---

### User Story 2 - Understand the Three Core Principles (Priority: P1)

As a viewer, I scroll through the explanation that attractive slides can be learned, then see the three core principles while the example designs remain visible as a continuous visual reference.

**Why this priority**: These slides deliver the central message and use visual continuity to connect the explanation to its takeaway.

**Independent Test**: Start with slide 2 as the active scene, observe its entrance, and advance to slide 3. Verify the prescribed text and illustration behavior without needing the title or final tips scene.

**Acceptance Scenarios**:

1. **Given** slide 2 is being entered from above, **When** its content appears, **Then** the left section fades in while moving upward and displays the exact title and explanatory copy in the Slide Content section.
2. **Given** slide 2's left section has appeared, **When** its right section enters, **Then** two simplified examples of good slide design appear one after the other with fading and slight rotation, in an overlapping, slightly rotated arrangement; after entrance they make a subtle shaking motion.
3. **Given** slide 2 is visible, **When** the viewer advances to slide 3, **Then** slide 2's left section fades out while moving upward, slide 3's left section fades in while moving upward, and the same right-side examples remain visible without replacement, disappearance, or replaying their entrance.
4. **Given** slide 3 has settled, **When** the viewer reads its left section, **Then** it contains only `シンプルに`, `キャッチーに`, and `起承転結`, in that order on three separate lines, with readable type size and spacing.
5. **Given** the viewer is on slide 2 or 3, **When** the viewer pauses or moves between them, **Then** the scroll cue remains visible.
6. **Given** slide 3 is visible, **When** the viewer advances to slide 4, **Then** its text and shared examples fade out while moving upward.

---

### User Story 3 - Read the Final Six Tips (Priority: P2)

As a viewer, I reach the concluding slide and read six practical tips in clearly separated cards, with an entrance sequence that guides my attention through the content.

**Why this priority**: The final slide turns the core message into practical advice and provides a clear end to the presentation.

**Independent Test**: Start immediately before slide 4, enter it, and inspect its heading, six cards, layout, entrance order, and hidden scroll cue.

**Acceptance Scenarios**:

1. **Given** the viewer enters slide 4, **When** its content is displayed, **Then** `その他のTips` and all six title/content pairs from the Slide Content section are present in the specified order.
2. **Given** the presentation is viewed at a desktop viewport of at least 1280 × 720, **When** the final slide is settled, **Then** the cards form three columns and two rows, each with a distinct title and content section, rounded corners, and a subtle shadow.
3. **Given** the final cards are entering, **When** their entrance plays, **Then** each fades in and grows from a smaller scale with a gentle elastic settling motion, staggered from top-left to top-right and then bottom-left to bottom-right.
4. **Given** the scroll cue is visible on slide 3, **When** the viewer transitions into slide 4, **Then** the cue smoothly fades out and remains hidden at the end.

---

### User Story 4 - Revisit Earlier Slides (Priority: P2)

As a viewer, I scroll backward to review earlier material, with coherent reverse transitions and restored content instead of missing elements or abrupt resets.

**Why this priority**: Reversible navigation lets viewers control their pace and revisit the advice without losing presentation state.

**Independent Test**: Begin at each of slides 2, 3, and 4 in turn and scroll to its predecessor. Verify outgoing motion, restoration, shared examples, and the scroll cue.

**Acceptance Scenarios**:

1. **Given** slide 2, 3, or 4 is active, **When** the viewer scrolls to the preceding slide, **Then** the outgoing scene content fades out while moving downward and the preceding scene's visible state is restored smoothly.
2. **Given** slide 3 is active, **When** the viewer returns to slide 2, **Then** the shared examples remain visible in the same arrangement while slide 2's left-side title and explanation are restored.
3. **Given** slide 4 is active with the cue hidden, **When** the viewer returns to slide 3, **Then** the three phrases and shared examples are restored, the scroll cue fades back in, and its two-bob cycle resumes.
4. **Given** slide 2 is active, **When** the viewer returns to the title slide, **Then** its title, presenter, and date are restored smoothly, the example designs leave the scene, and the scroll cue remains visible.
5. **Given** the viewer has navigated forward and backward repeatedly, **When** any slide settles, **Then** its content and cue state match a first visit, with no duplicated elements or accumulated rotation or movement.

### Edge Cases

- **Rapid scrolling or direction reversal during an entrance**: The visible scene MUST settle to the latest scroll position, with no stale scene covering its text, duplicate elements, or stranded partial entrances.
- **Stopping between slides**: Transitional content MUST remain consistent with the scroll position; continuing in either direction MUST restore a complete destination scene.
- **Scrolling past the beginning or end**: The first or final scene MUST remain available without wrapping, blanking, or revealing another slide; the cue MUST remain hidden at the end.
- **Viewport resizing or a narrow screen**: Text and cards MUST remain readable without overlap or horizontal scrolling. The final cards MAY reflow into fewer columns while keeping their reading and entrance order.
- **Reduced-motion preference**: Every slide and navigation path MUST remain available; repeating bobs and shaking, travel, rotation, and elastic effects MUST be suppressed in favor of immediate changes or simple fades.
- **Unavailable example artwork**: Two readable simplified visual examples MUST still be shown rather than broken-image symbols or empty illustration space.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The presentation MUST be available at `/how-to-create-attractive-presentation-materials` and contain exactly four slides in this order: title, `きれいなスライドはセンス？`, three core principles, and `その他のTips`.
- **FR-002**: Opening the presentation at its initial scroll position MUST show the title slide with the exact title, presenter, and date defined below.
- **FR-003**: The opening title MUST appear before the presenter and date; all three MUST fade in and move upward. The scroll cue MUST begin its entrance only after those elements have appeared.
- **FR-004**: The scroll cue MUST combine vertically written `Scroll` with a downward chevron and a smooth fade-in. While visible, it MUST repeat cycles of two subtle vertical up-and-down motions with smooth acceleration and deceleration.
- **FR-005**: Once revealed, the cue MUST stay visible through slides 1–3 and their transitions, fade out when entering slide 4, remain hidden there, and fade back in when returning to slide 3. It MUST remain legible and avoid covering presentation text.
- **FR-006**: Scrolling forward MUST navigate through all four slides in order; scrolling backward MUST allow viewers to revisit each preceding slide.
- **FR-007**: On forward transitions, outgoing scene content MUST fade out while moving upward. On backward transitions, outgoing scene content MUST fade out while moving downward and the preceding scene MUST be restored smoothly. The shared examples are exempt from exiting during either direction of transition between slides 2 and 3.
- **FR-008**: Slide 2 MUST have a left text section and a right example section at presentation-sized desktop viewports. Its left section MUST show the exact prescribed title and explanation and fade in while moving upward.
- **FR-009**: Only after slide 2's left section has appeared, two simplified examples of good slide design MUST enter the right section with staggered fading and slight rotation. They MUST overlap, remain slightly rotated after entrance, and make a subtle shaking motion after entrance without obscuring the left text.
- **FR-010**: The same two examples MUST persist on slide 3, preserving their artwork and arrangement without re-entering during slide 2-to-3 or slide 3-to-2 transitions. They MUST leave when navigating to slide 1 or 4 and be restored on re-entry to slide 2 or 3.
- **FR-011**: Slide 3's left section MUST fade in while moving upward and show only the three prescribed phrases on separate lines, in order. Typeface, size, and spacing MUST keep the phrases readable without overlapping the examples or cue.
- **FR-012**: Slide 4 MUST show the heading `その他のTips` and exactly six cards with the verbatim title/content pairs below, ordered left-to-right across the first row, then left-to-right across the second row on desktop.
- **FR-013**: At viewports of at least 1280 × 720, the six cards MUST use three columns and two rows. Each card MUST have rounded corners, a subtle shadow, and visually distinct title and content sections.
- **FR-014**: The cards MUST fade in and zoom in from a smaller scale with a gentle elastic settling motion. Their entrance starts MUST be staggered in reading order rather than simultaneous.
- **FR-015**: All entrances, exits, cue motions, and illustration motions MUST progress continuously without abrupt jumps; ordinary movement and fading MUST use smooth acceleration/deceleration, while card entrances MUST have a gentle elastic finish. These motion requirements are subject to FR-018.
- **FR-016**: Repeated navigation, rapid scrolling, and direction changes MUST resolve to the scene corresponding to the latest scroll position without duplicated content, leftover outgoing text, or accumulated movement of the examples.
- **FR-017**: Resizing and narrow viewports MUST preserve all content, readable order, and navigation without text overlap or horizontal scrolling. Cards MAY reflow into fewer columns, and paired sections MAY stack when necessary.
- **FR-018**: Viewers requesting reduced motion MUST receive all content and navigation with decorative repeating motion and movement/rotation/elastic effects suppressed; immediate state changes or simple fades MAY replace them.
- **FR-019**: If example artwork cannot be displayed, the presentation MUST provide two readable simplified visual examples so that slides 2 and 3 still communicate their intended message.

### Slide Content

**Slide 1 — Title**

- Title: `惹きつけるプレゼン資料の作り方`
- Presenter: `Takeshi Masumoto`
- Date: `2026-10-03`

**Slide 2 — Learnable slide design**

Title: `きれいなスライドはセンス？`

Explanatory text:

```text
きれいなスライドはセンスで作ると思っていませんか？
そんなことはありません。3つのことを抑えるだけで，誰でも分かりやすく魅力的なスライドを作ることができます。
```

**Slide 3 — Three core principles**

Left-section content, with no additional explanatory text:

```text
シンプルに
キャッチーに
起承転結
```

**Slide 4 — その他のTips**

| Order | Title | Content |
| --- | --- | --- |
| 1 | 自分の目を肥やす | Webサイトやアプリ，ゲーム等，様々なデザインに触れる |
| 2 | 流行を掴む | デザインのベストプラクティスは固定的ではなく，トレンドに応じて変化する |
| 3 | 与えたい印象から配色を決める | スライドで与えたい印象に合わせて配色を選ぶ |
| 4 | 重要なことだけを書く | スライドには本当に伝えたいことだけを記載し，あとは口頭で補足する |
| 5 | ポイントは3つが丁度良い | 人は情報が4つ以上になると記憶しづらくなるため，重要なポイントは3つに絞る |
| 6 | 示したポイント間で内容を被らせない | 内容が重複すると，オーバーに表現しようとしていると見えることがある |

### Key Entities *(include if feature involves data)*

- **Presentation**: The fixed educational experience, identified by its route, title, presenter, date, and ordered set of four slides.
- **Slide**: One scene's content, display order, layout, entrance/exit behavior, and relationship to any shared visual material.
- **Example Design Pair**: Two simplified slide illustrations shared by slides 2 and 3, including their arrangement and visibility across navigation.
- **Tip Card**: One of six ordered advice items, each with a title and explanatory content.
- **Scroll Cue**: The presentation-wide prompt, with label, chevron, repeating motion, and visibility determined by the current slide.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance review, 100% of the prescribed title, presenter, date, explanatory sentences, three phrases, and six tip pairs appear verbatim and in their required order across exactly four slides.
- **SC-002**: At least 9 of 10 first-time viewers can move from the opening to the final tips and return to an earlier slide within two minutes, without navigation instructions beyond the visible scroll cue.
- **SC-003**: Across all six adjacent forward/backward transitions and 20 repeated round trips, the correct destination content and cue state are restored every time, with zero unintended disappearance or replacement of the examples between slides 2 and 3.
- **SC-004**: In normal-motion acceptance recordings, all required entrance and exit sequences occur in the specified order, and at least 95% of observed animation time has no visible stall longer than 100 milliseconds or discontinuous position jump.
- **SC-005**: At least 4 of 5 representative viewers rate both readability and animation comfort at 4 or higher on a five-point scale after viewing the full presentation.
- **SC-006**: At 1280 × 720 and 1920 × 1080, the final slide presents all six cards in three columns and two rows without clipping. At 390 × 844, all presentation text and six tips remain readable and reachable without horizontal scrolling or overlap.
- **SC-007**: With reduced motion enabled, 100% of the prescribed content and all six adjacent navigation paths remain available, with no repeating bob/shake, movement, rotation, or elastic effects.

## Assumptions

- The feature is one fixed, publicly viewable educational presentation. Editing tools, accounts, saved viewer progress, presentation exports, and additional decks are outside this scope.
- A fresh visit at the initial scroll position starts on slide 1. The displayed presentation date remains `2026-10-03`, independent of the specification date or viewing date.
- The desktop presentation layout is the baseline. Smaller viewports retain the content and sequence but may stack sections or reflow cards; the viewport sizes in SC-006 are acceptance baselines.
- "2 subtle up-and-down motions" means a repeating pair of small vertical bobs. No exact duration, travel distance, rotation angle, or color palette is prescribed; visual choices must satisfy the sequence, readability, and comfort criteria.
- The title enters first, then the presenter and date may enter together or sequentially. The examples' post-entrance shake may be a brief accent or an ongoing subtle motion; either must preserve continuity and respect reduced motion.
- The shared examples remain visible only across slides 2 and 3. The general slide 3 exit applies to both text and examples when moving to slide 4, and the general reverse exit applies only to changing content when moving back to slide 2.
- Reverse navigation smoothly restores the destination scene; it need not replay every forward entrance in reverse chronological order. Returning from slide 4 restores both the examples and scroll cue on slide 3.
- Exact artwork is not supplied. Delivery depends on two suitable simplified examples that demonstrate readable, uncluttered slide composition; their illustrative content must not add explanatory text to slide 3's left section.
- Reduced-motion support and narrow-screen reflow are baseline usability defaults. They alter motion or arrangement while preserving the supplied content and slide sequence.
- The project constitution governs subsequent planning, implementation, and acceptance. Its prescribed implementation choices and development quality gates remain binding and are documented there rather than repeated as user requirements here.
