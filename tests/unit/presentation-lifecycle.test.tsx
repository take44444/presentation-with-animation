import { render } from '@testing-library/react';
import { useEffect, type EffectCallback } from 'react';
import { Presentation } from '@/app/how-to-create-attractive-presentation-materials/_components/presentation';
import { createPresentationController } from '@/app/how-to-create-attractive-presentation-materials/_lib/animation-controller';
jest.mock('@gsap/react', (): object => ({
  useGSAP: (callback: EffectCallback): void => {
    useEffect((): ReturnType<EffectCallback> => callback(), [callback]);
  },
}));
jest.mock(
  '@/app/how-to-create-attractive-presentation-materials/_lib/animation-controller',
  (): object => ({
    createPresentationController: jest.fn((): object => ({
      dispose: jest.fn(),
      state: jest.fn(),
    })),
  }),
);
test('route mounts scoped resources and disposes each owner before remount', (): void => {
  const first: ReturnType<typeof render> = render(<Presentation />);
  first.unmount();
  expect(
    jest.mocked(createPresentationController).mock.results.at(-1)?.value
      .dispose,
  ).toHaveBeenCalledTimes(1);
  const second: ReturnType<typeof render> = render(<Presentation />);
  expect(document.querySelectorAll('[data-presentation]')).toHaveLength(1);
  second.unmount();
  expect(
    jest.mocked(createPresentationController).mock.results.at(-1)?.value
      .dispose,
  ).toHaveBeenCalledTimes(1);
});
