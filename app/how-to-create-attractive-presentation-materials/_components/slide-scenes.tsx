import type { ReactElement } from 'react';
import { deck } from '../_lib/content';
import { TipCard } from './tip-card';
import type { TipCard as Tip } from '../_lib/types';
import { ExampleDesigns } from './example-designs';
import styles from '../presentation.module.css';
/** Render stable semantic scenes; entrance and scene-exit wrappers have distinct owners. @returns Readable server-rendered scene collection. */
export function SlideScenes(): ReactElement {
  return (
    <>
      <section
        data-scene="title"
        className={`${styles.scene} ${styles.titleScene}`}
        aria-labelledby="presentation-title"
      >
        <div data-motion="title" className={styles.titleTravel}>
          <p className={styles.eyebrow} aria-hidden="true">
            DESIGN / COMMUNICATION
          </p>
          <h1 id="presentation-title" data-opening="title">
            {deck.title}
          </h1>
          <div data-opening="attribution" className={styles.attribution}>
            <span>{deck.presenter}</span>
            <time dateTime={deck.presentedOn}>{deck.presentedOn}</time>
          </div>
        </div>
      </section>
      <div data-shared-group className={styles.teachingGroup}>
        <section
          data-scene="explanation"
          className={styles.scene}
          aria-label="スライドデザイン"
        >
          <div data-motion="explanation" className={styles.teachingText}>
            <p className={styles.eyebrow} aria-hidden="true">
              01 / LEARNABLE DESIGN
            </p>
            <h2>{deck.slides[1].heading}</h2>
            {deck.slides[1].paragraphs.map(
              (paragraph: string): ReactElement => (
                <p key={paragraph} className={styles.explanation}>
                  {paragraph}
                </p>
              ),
            )}
          </div>
        </section>
        <ExampleDesigns />
        <section
          data-scene="principles"
          className={styles.scene}
          aria-label="3つの原則"
        >
          <div data-motion="principles" className={styles.principles}>
            {deck.slides[2].phrases.map((phrase: string): ReactElement => (
              <p key={phrase}>{phrase}</p>
            ))}
          </div>
        </section>
      </div>
      <section
        data-scene="tips"
        className={styles.scene}
        aria-label="その他のTips"
      >
        <div data-motion="tips" className={styles.tipsTravel}>
          <h2>{deck.slides[3].heading}</h2>
          <ol className={styles.cardGrid}>
            {deck.slides[3].cards.map((card: Tip): ReactElement => (
              <TipCard key={card.id} card={card} />
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
