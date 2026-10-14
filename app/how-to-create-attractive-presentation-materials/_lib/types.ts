/** Stable scenes in reading order. */
export type SceneId = 'title' | 'explanation' | 'principles' | 'tips';
/** Desktop stage or native document layout. */
export type LayoutMode = 'pinned' | 'flow';
/** Viewer motion preference; reduced always selects flow. */
export type MotionPreference = 'normal' | 'reduced';
/** Direction from the newest native scroll delta. */
export type ScrollDirection = 'forward' | 'backward' | 'stationary';
/** Opening scene uses the presentation's attribution. */
export interface TitleSlide {
  readonly id: 'title';
  readonly kind: 'title';
  readonly order: 1;
}
/** Learnable-design explanation referencing the presentation's shared pair. */
export interface ExplanationSlide {
  readonly id: 'explanation';
  readonly kind: 'explanation';
  readonly order: 2;
  readonly heading: string;
  readonly paragraphs: readonly [string, string];
}
/** Three concise principles referencing the same shared pair. */
export interface PrinciplesSlide {
  readonly id: 'principles';
  readonly kind: 'principles';
  readonly order: 3;
  readonly phrases: readonly [string, string, string];
}
/** One ordered advice card. */
export interface TipCard {
  readonly id: `tip-${1 | 2 | 3 | 4 | 5 | 6}`;
  readonly order: 1 | 2 | 3 | 4 | 5 | 6;
  readonly title: string;
  readonly content: string;
}
/** Final scene has exactly six cards in DOM/entrance order. */
export interface TipsSlide {
  readonly id: 'tips';
  readonly kind: 'tips';
  readonly order: 4;
  readonly heading: 'その他のTips';
  readonly cards: readonly [
    TipCard,
    TipCard,
    TipCard,
    TipCard,
    TipCard,
    TipCard,
  ];
}
/** Discriminated content variants. */
export type Slide = TitleSlide | ExplanationSlide | PrinciplesSlide | TipsSlide;
/** Self-contained local mini-slide with separate resting and decorative transforms. */
export interface ExampleDesign {
  readonly id: 'example-1' | 'example-2';
  readonly accessibleLabel: string;
  readonly composition: 'statement' | 'three-points';
  readonly restingRotation: number;
  readonly layerOrder: number;
}
/** Immutable fixed deck, with no persistence or remote data. */
export interface Presentation {
  readonly id: 'attractive-presentation';
  readonly route: '/how-to-create-attractive-presentation-materials';
  readonly title: '惹きつけるプレゼン資料の作り方';
  readonly presenter: 'Takeshi Masumoto';
  readonly presentedOn: '2026-10-03';
  readonly language: 'ja';
  readonly slides: readonly [
    TitleSlide,
    ExplanationSlide,
    PrinciplesSlide,
    TipsSlide,
  ];
  readonly examples: readonly [ExampleDesign, ExampleDesign];
}
/** Finite ordered scroll interval. */
export type Interval = readonly [number, number];
/** Measured native section entrance, reading and exit ranges. */
export interface SceneGeometry {
  readonly id: SceneId;
  readonly start: number;
  readonly end: number;
  readonly entrance: Interval;
  readonly reading: Interval;
  readonly exit: Interval;
}
/** Finite master labels; holds align with fully revealed scenes. */
export interface TimelineLabels {
  readonly openingEnd: number;
  readonly holds: readonly [number, number, number, number];
  readonly transitions: readonly [Interval, Interval, Interval];
  readonly examplesVisible: Interval;
  readonly cueFade: Interval;
  readonly final: number;
}
/** Scene/local reading location preserved across geometry changes. */
export interface ViewportAnchor {
  readonly scene: SceneId;
  readonly fraction: number;
}
/** Ephemeral controller observation; React does not own per-frame state. */
export interface ControllerState {
  readonly lifecycle:
    'opening' | 'ready' | 'tracking' | 'disposed' | 'fallback';
  readonly currentTime: number;
  readonly targetTime: number;
  readonly targetScene: SceneId;
  readonly direction: ScrollDirection;
  readonly layoutMode: LayoutMode;
  readonly motionPreference: MotionPreference;
  readonly openingComplete: boolean;
}
