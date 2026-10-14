import fs from 'node:fs';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
const Route: () => ReactElement = fs.existsSync(
  'app/how-to-create-attractive-presentation-materials/page.tsx',
)
  ? jest.requireActual<{ default: () => ReactElement }>(
      '@/app/how-to-create-attractive-presentation-materials/page',
    ).default
  : (): ReactElement => <main />;
jest.mock('@gsap/react', (): object => ({ useGSAP: jest.fn() }));
test('semantic Japanese opening and decorative cue', (): void => {
  render(<Route />);
  expect(screen.getByRole('main')).toHaveAttribute('lang', 'ja');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    '惹きつけるプレゼン資料の作り方',
  );
  expect(screen.getByText('Takeshi Masumoto')).toBeInTheDocument();
  expect(screen.getByText('2026-10-03')).toBeInTheDocument();
  expect(
    screen.getByText('Scroll').parentElement?.querySelector('svg'),
  ).toHaveAttribute('aria-hidden', 'true');
});
test('US2 exact teaching copy, three phrases and one shared readable pair', (): void => {
  render(<Route />);
  expect(
    screen.getByRole('heading', { name: 'きれいなスライドはセンス？' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText('きれいなスライドはセンスで作ると思っていませんか？'),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'そんなことはありません。3つのことを抑えるだけで，誰でも分かりやすく魅力的なスライドを作ることができます。',
    ),
  ).toBeInTheDocument();
  const principles: Element | null = document.querySelector(
    '[data-motion="principles"]',
  );
  expect(principles?.textContent).toBe('シンプルにキャッチーに起承転結');
  expect(document.querySelectorAll('[data-example]')).toHaveLength(2);
  expect(
    Array.from(document.querySelectorAll('[data-example]')).map(
      (example: Element): string | null => example.getAttribute('data-example'),
    ),
  ).toEqual(['example-1', 'example-2']);
  expect(screen.getAllByRole('img')).toHaveLength(2);
});
test('US3 six exact tip pairs in unchanged reading order', (): void => {
  render(<Route />);
  expect(
    screen.getByRole('heading', { name: 'その他のTips' }),
  ).toBeInTheDocument();
  const cards: NodeListOf<Element> = document.querySelectorAll('[data-card]');
  expect(cards).toHaveLength(6);
  expect(
    Array.from(cards).map((card: Element): string | null =>
      card.getAttribute('data-card'),
    ),
  ).toEqual(['tip-1', 'tip-2', 'tip-3', 'tip-4', 'tip-5', 'tip-6']);
  expect(
    Array.from(cards).map(
      (card: Element): string | null =>
        card.querySelector('h3')?.textContent ?? null,
    ),
  ).toEqual([
    '自分の目を肥やす',
    '流行を掴む',
    '与えたい印象から配色を決める',
    '重要なことだけを書く',
    'ポイントは3つが丁度良い',
    '示したポイント間で内容を被らせない',
  ]);
  const expected: readonly string[] = [
    'Webサイトやアプリ，ゲーム等，様々なデザインに触れる',
    'デザインのベストプラクティスは固定的ではなく，トレンドに応じて変化する',
    'スライドで与えたい印象に合わせて配色を選ぶ',
    'スライドには本当に伝えたいことだけを記載し，あとは口頭で補足する',
    '人は情報が4つ以上になると記憶しづらくなるため，重要なポイントは3つに絞る',
    '内容が重複すると，オーバーに表現しようとしていると見えることがある',
  ];
  expect(
    Array.from(cards).map(
      (card: Element): string | null =>
        card.querySelector('p')?.textContent ?? null,
    ),
  ).toEqual(expected);
});
