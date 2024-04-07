import { useDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { Spell } from '../types';
import { formatSpellLevel } from '../util';
import styles from './index.module.css';

interface SpellSummaryProps extends Spell.Summary {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

export const SpellSummary = ({ id, title, level, isChecked, onChange }: SpellSummaryProps) => {
  const [SpellDialog, { open: openSpellDialog }] = useDialog();

  return (
    <li className={styles.spellSummary}>
      <input type="checkbox" checked={isChecked} onChange={(e) => onChange(e.target.checked)} />
      <div className={styles.summary}>
        <h3>{title}</h3>
        <div>{formatSpellLevel(level)}</div>
      </div>
      <button onClick={openSpellDialog}>View details</button>
      <SpellDialog className={styles.dialog} title={title}>
        <SpellCard className={styles.spellCard} id={id} />
      </SpellDialog>
    </li>
  );
};
