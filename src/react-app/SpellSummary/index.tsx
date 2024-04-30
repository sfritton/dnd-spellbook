import { MouseEventHandler, useCallback } from 'react';
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
  const { castingTime, duration }: Spell.Details = spellDetails[id];

  const openSpellDialog = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      open({
        title,
        className: styles.dialog,
        children: <SpellCard className={styles.spellCard} id={id} />,
      });
    },
    [open, title, id],
  );

  return (
    <li className={styles.spellSummary}>
      {/* TODO: larger touch target for checkbox, cursor pointer, hover color */}
      <input type="checkbox" checked={isChecked} onChange={(e) => onChange(e.target.checked)} />
      <a className={styles.summary} tabIndex={0} onClick={openSpellDialog}>
        <h4>{title}</h4>
        <div className={styles.levelAndTime}>
          {showLevel ? <>{formatSpellLevel(level)} &bull; </> : null}
          {castingTime.split(',')[0]}
          {/concentration/i.test(duration) ? <> &bull; Concentration</> : null}
        </div>
      </a>
    </li>
  );
};
