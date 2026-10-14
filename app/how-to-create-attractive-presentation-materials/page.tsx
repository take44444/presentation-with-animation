import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { deck } from './_lib/content';
import { Presentation } from './_components/presentation';
export const metadata: Metadata = {
  title: deck.title,
  description:
    'シンプルに、キャッチーに、起承転結。伝わるスライドデザインのためのプレゼンテーション。',
};
/** Render the fixed public presentation without fetching data. @returns Japanese presentation shell. */
export default function PresentationPage(): ReactElement {
  return <Presentation />;
}
