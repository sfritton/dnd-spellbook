import { MouseEventHandler, useCallback } from 'react';
import { spellDetails } from '../../constants/spell-details';
import { useSingleDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { Spell } from '../types';
import { formatSpellLevel } from '../util';
import styles from './index.module.css';
import { Checkbox } from '../Checkbox';
import { HighlightKey, useSettingsContext } from '../SettingsContext';

const getSpellHighlight = (
  { castingTime, levelAndSchool, duration, range, components }: Spell.Details,
  highlight: HighlightKey,
) => {
  switch (highlight) {
    case 'isRitual':
      return /ritual/i.test(levelAndSchool) ? 'Ritual' : false;
    case 'isConcentration':
      return /concentration/i.test(duration) ? 'Concentration' : false;
    case 'castingTime':
      return castingTime.split(',')[0];
    case 'duration':
      return duration;
    case 'range':
      return range;
    case 'components':
      return components.split(' (')[0];
  }
};

interface SpellSummaryProps extends Spell.Summary {
  isChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  showLevel?: boolean;
  checkboxIdSuffix: string;
}

export const SpellSummary = ({
  id,
  title,
  level,
  isChecked,
  onChange,
  showLevel = false,
  checkboxIdSuffix,
}: SpellSummaryProps) => {
  const { open } = useSingleDialog();
  const spell: Spell.Details = spellDetails[id];
  const { highlights } = useSettingsContext();

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
      <Checkbox
        className={styles.checkbox}
        label={
          isChecked ? `Remove "${title}" from prepared spells` : `Add "${title}" to prepared spells`
        }
        id={`${id}-${checkboxIdSuffix}`}
        checked={isChecked}
        onChange={onChange}
        hideLabel
      />
      <a className={styles.summary} tabIndex={0} href="#" onClick={openSpellDialog}>
        <h4>{title}</h4>
        <div className={styles.levelAndTime}>
          {[
            showLevel ? formatSpellLevel(level) : false,
            ...highlights.map((highlight) => getSpellHighlight(spell, highlight)),
          ]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </a>
    </li>
  );
};
