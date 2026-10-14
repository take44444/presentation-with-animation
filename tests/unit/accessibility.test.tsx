import { render, screen } from '@testing-library/react';
import { Presentation } from '@/app/how-to-create-attractive-presentation-materials/_components/presentation';
jest.mock('@gsap/react', (): object => ({ useGSAP: jest.fn() }));
test('unenhanced Japanese deck retains semantic order and self-contained examples', (): void => {
  render(<Presentation />);
  expect(screen.getByRole('main')).toHaveAttribute('lang', 'ja');
  expect(
    Array.from(document.querySelectorAll('[data-scene]')).map(
      (scene: Element): string | null => scene.getAttribute('data-scene'),
    ),
  ).toEqual(['title', 'explanation', 'principles', 'tips']);
  expect(screen.getAllByRole('img')).toHaveLength(2);
  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  expect(
    screen.getByRole('heading', { name: 'その他のTips' }),
  ).toBeInTheDocument();
  expect(document.querySelector('[data-cue] svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
});
