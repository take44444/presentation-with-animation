import fs from 'node:fs';
import type { Presentation } from '@/app/how-to-create-attractive-presentation-materials/_lib/types';
const content: Presentation | undefined = fs.existsSync(
  'app/how-to-create-attractive-presentation-materials/_lib/content.ts',
)
  ? jest.requireActual<{ deck: Presentation }>(
      '@/app/how-to-create-attractive-presentation-materials/_lib/content',
    ).deck
  : undefined;
test('fixed exact opening metadata and immutable four-scene shape', (): void => {
  expect(content).toMatchObject({
    id: 'attractive-presentation',
    route: '/how-to-create-attractive-presentation-materials',
    title: '惹きつけるプレゼン資料の作り方',
    presenter: 'Takeshi Masumoto',
    presentedOn: '2026-10-03',
    language: 'ja',
  });
  expect(
    content?.slides.map(
      (scene: Presentation['slides'][number]): string => scene.id,
    ),
  ).toEqual(['title', 'explanation', 'principles', 'tips']);
  expect(content?.examples).toHaveLength(2);
  expect(Object.isFrozen(content)).toBe(true);
  expect(Object.isFrozen(content?.slides)).toBe(true);
});
