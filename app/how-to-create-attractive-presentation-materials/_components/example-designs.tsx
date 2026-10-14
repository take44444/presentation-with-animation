import type { ReactElement, CSSProperties } from 'react';
import { deck } from '../_lib/content';
import type { ExampleDesign } from '../_lib/types';
import styles from '../presentation.module.css';
/** Mount the two local mini-slides once; layout, entrance and shake wrappers never compete. @returns Accessible self-contained examples shared by the teaching scenes. */
export function ExampleDesigns(): ReactElement {
  return (
    <div data-examples className={styles.examples}>
      {deck.examples.map((example: ExampleDesign): ReactElement => {
        const arrangement: CSSProperties = {
          '--rotation': `${example.restingRotation}deg`,
          zIndex: example.layerOrder,
        } as CSSProperties;
        return (
          <div
            key={example.id}
            data-example={example.id}
            className={styles.exampleLayout}
            style={arrangement}
          >
            <div data-example-entrance>
              <div
                data-example-shake
                className={`${styles.miniSlide} ${example.composition === 'statement' ? styles.miniDark : styles.miniLight}`}
                role="img"
                aria-label={example.accessibleLabel}
              >
                {example.composition === 'statement' ? (
                  <>
                    <span className={styles.miniLabel}>LESS IS MORE</span>
                    <strong>
                      デザインはセンスじゃない
                      <br />
                      学問だ
                    </strong>
                    <span className={styles.miniRule} />
                    <span className={styles.miniFoot}>
                      学べば，デザインは上達する。
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.miniLabel}>MAKE IT CLEAR</span>
                    <strong>たった3つで、変わる。</strong>
                    <div className={styles.miniPoints}>
                      <span>
                        01
                        <br />
                        デザイン，配色
                      </span>
                      <span>
                        02
                        <br />
                        ストーリーを意識
                      </span>
                      <span>
                        03
                        <br />
                        流行を知る
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
