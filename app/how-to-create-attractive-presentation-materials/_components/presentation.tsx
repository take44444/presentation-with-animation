'use client';
import { useRef, type RefObject, type ReactElement } from 'react';
import { useGSAP } from '@gsap/react';
import {
  createPresentationController,
  type PresentationController,
} from '../_lib/animation-controller';
import { SlideScenes } from './slide-scenes';
import { ScrollCue } from './scroll-cue';
import styles from '../presentation.module.css';
/** Own the scoped GSAP lifecycle; React keeps content stable across every transition. @returns Interactive Japanese landmark with static-flow fallback. */
export function Presentation(): ReactElement {
  const root: RefObject<HTMLElement | null> = useRef<HTMLElement>(null);
  useGSAP(
    (): (() => void) | undefined => {
      if (!root.current) return;
      const controller: PresentationController = createPresentationController(
        root.current,
      );
      return (): void => {
        controller.dispose();
      };
    },
    { scope: root },
  );
  return (
    <main
      ref={root}
      lang="ja"
      className={styles.presentation}
      data-presentation
    >
      <div data-stage className={styles.stage}>
        <SlideScenes />
        <ScrollCue />
      </div>
    </main>
  );
}
