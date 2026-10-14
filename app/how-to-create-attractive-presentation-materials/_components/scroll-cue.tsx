import type { ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '../presentation.module.css';
/** Native-scroll hint with separate opacity and two-bob transform owners. @returns Decorative cue. */
export function ScrollCue(): ReactElement {
  return (
    <div data-cue className={styles.cue}>
      <div data-cue-bob>
        <span>Scroll</span>
        <ChevronDown size={32} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  );
}
