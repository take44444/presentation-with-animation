import type { Presentation, TipCard } from './types';
const cards: Presentation['slides'][3]['cards'] = [
  {
    id: 'tip-1',
    order: 1,
    title: '自分の目を肥やす',
    content: 'Webサイトやアプリ，ゲーム等，様々なデザインに触れる',
  },
  {
    id: 'tip-2',
    order: 2,
    title: '流行を掴む',
    content:
      'デザインのベストプラクティスは固定的ではなく，トレンドに応じて変化する',
  },
  {
    id: 'tip-3',
    order: 3,
    title: '与えたい印象から配色を決める',
    content: 'スライドで与えたい印象に合わせて配色を選ぶ',
  },
  {
    id: 'tip-4',
    order: 4,
    title: '重要なことだけを書く',
    content: 'スライドには本当に伝えたいことだけを記載し，あとは口頭で補足する',
  },
  {
    id: 'tip-5',
    order: 5,
    title: 'ポイントは3つが丁度良い',
    content:
      '人は情報が4つ以上になると記憶しづらくなるため，重要なポイントは3つに絞る',
  },
  {
    id: 'tip-6',
    order: 6,
    title: '示したポイント間で内容を被らせない',
    content:
      '内容が重複すると，オーバーに表現しようとしていると見えることがある',
  },
];
cards.forEach((card: TipCard): void => {
  Object.freeze(card);
});
Object.freeze(cards);
/** Fixed Japanese presentation; all nested content is immutable and date is literal. */
export const deck: Presentation = Object.freeze({
  id: 'attractive-presentation',
  route: '/how-to-create-attractive-presentation-materials',
  title: '惹きつけるプレゼン資料の作り方',
  presenter: 'Takeshi Masumoto',
  presentedOn: '2026-10-03',
  language: 'ja',
  slides: Object.freeze([
    Object.freeze({ id: 'title', kind: 'title', order: 1 }),
    Object.freeze({
      id: 'explanation',
      kind: 'explanation',
      order: 2,
      heading: 'きれいなスライドはセンス？',
      paragraphs: Object.freeze([
        'きれいなスライドはセンスで作ると思っていませんか？',
        'そんなことはありません。3つのことを抑えるだけで，誰でも分かりやすく魅力的なスライドを作ることができます。',
      ]),
    }),
    Object.freeze({
      id: 'principles',
      kind: 'principles',
      order: 3,
      phrases: Object.freeze(['シンプルに', 'キャッチーに', '起承転結']),
    }),
    Object.freeze({
      id: 'tips',
      kind: 'tips',
      order: 4,
      heading: 'その他のTips',
      cards,
    }),
  ]) as Presentation['slides'],
  examples: Object.freeze([
    Object.freeze({
      id: 'example-1',
      accessibleLabel: '大きな見出しと余白を活かしたシンプルなスライド',
      composition: 'statement',
      restingRotation: -5,
      layerOrder: 1,
    }),
    Object.freeze({
      id: 'example-2',
      accessibleLabel: '3つのポイントを整理した読みやすいスライド',
      composition: 'three-points',
      restingRotation: 6,
      layerOrder: 2,
    }),
  ]) as Presentation['examples'],
});
