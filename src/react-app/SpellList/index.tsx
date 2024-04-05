import { Spell } from '../types';
import { formatSpellLevel } from '../util';
import styles from './index.module.css';

export const SpellList = ({ spells }: { spells: Spell[] }) => {
  if (spells.length < 1) return null;

  return (
    <ul className={styles.spellList}>
      {spells.map(({ id, level, title }) => (
        <li key={id}>
          <b>{title}</b>
          <div className={styles.level}>{formatSpellLevel(level)}</div>
        </li>
      ))}
    </ul>
  );
};
