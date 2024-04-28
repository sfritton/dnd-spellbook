import { useCallback } from 'react';
import { spellDetails } from '../../constants/spell-details';
import { useSingleDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { Spell } from '../types';
import { formatSpellLevel } from '../util';
import styles from './index.module.css';

interface SpellSummaryProps extends Spell.Summary {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  showLevel?: boolean;
}

export const SpellSummary = ({
  id,
  title,
  level,
  isChecked,
  onChange,
  showLevel = false,
}: SpellSummaryProps) => {
  const { open } = useSingleDialog();
  const { castingTime }: Spell.Details = spellDetails[id];

  const openSpellDialog = useCallback(() => {
    open({
      title,
      className: styles.dialog,
      children: <SpellCard className={styles.spellCard} id={id} />,
    });
  }, [open, title, id]);

  return (
    <li className={styles.spellSummary}>
      <input type="checkbox" checked={isChecked} onChange={(e) => onChange(e.target.checked)} />
      <div className={styles.summary}>
        <h4>{title}</h4>
        <div className={styles.levelAndTime}>
          {showLevel ? <>{formatSpellLevel(level)} &bull; </> : null}
          {castingTime}
        </div>
      </div>
      <button onClick={openSpellDialog}>View details</button>
    </li>
  );
};
