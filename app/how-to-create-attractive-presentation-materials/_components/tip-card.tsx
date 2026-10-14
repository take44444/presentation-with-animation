import type { ReactElement } from 'react';
import type { TipCard as Tip } from '../_lib/types';
import styles from '../presentation.module.css';
/** Render one advice item in its authoritative reading/stagger order. @param card Immutable exact advice pair. @returns Semantic list item with distinct title/content sections. */
export function TipCard({ card }: { readonly card: Tip }): ReactElement {
  return (
    <li data-card={card.id} className={styles.card}>
      <h3>{card.title}</h3>
      <p>{card.content}</p>
    </li>
  );
}
