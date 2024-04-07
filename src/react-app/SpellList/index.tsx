import { SpellSummary } from '../SpellSummary';
import { Spell } from '../types';
import styles from './index.module.css';

export const SpellList = ({ spells }: { spells: Spell.Summary[] }) => {
  if (spells.length < 1) return null;

  return (
    <ul className={styles.spellList}>
      {spells.map((spell) => (
        // TODO: handle checkbox
        <SpellSummary isChecked onChange={console.log} key={spell.id} {...spell} />
      ))}
    </ul>
  );
};
