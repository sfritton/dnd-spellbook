import { MouseEventHandler, useCallback } from 'react';
import { spellDetails } from '../../constants/spell-details';
import { useSingleDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { Spell } from '../types';
import { formatSpellLevel } from '../util';
import styles from './index.module.css';
import { HighlightKey, useSettingsContext } from '../SettingsContext';
import { SpellSummaryButtonLeading } from './components/SpellStatusButtonLeading';
import { SpellSummaryButtonTrailing } from './components/SpellStatusButtonTrailing';
import { SpellSummaryData, useSpellListContext } from '../SpellListContext';

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

interface SpellSummaryProps extends Pick<SpellSummaryData, 'id' | 'level' | 'url'> {
  showLevel?: boolean;
  disabled?: boolean;
}

export const SpellSummary = ({
  showLevel = false,
  id,
  level,
  url,
  disabled = false,
}: SpellSummaryProps) => {
  const { open } = useSingleDialog();
  const spellWithDetails: Spell.Details = spellDetails[id];
  const { highlights, isCardMode } = useSettingsContext();
  const { spellLists } = useSpellListContext();
  const foundSpell = spellLists[level].find(({ id: idFromList }) => id === idFromList);
  const isKnown = Boolean(foundSpell);
  const spellSummaryData: SpellSummaryData = isKnown
    ? foundSpell
    : { ...spellWithDetails, id, isPrepared: false, isAlwaysPrepared: false, url };

  const { title } = spellSummaryData;

  const openSpellDialog = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();

      if (disabled) return;

      open({
        title,
        className: styles.dialog,
        children: <SpellCard className={styles.spellCard} id={id} url={url} />,
      });
    },
    [open, title, id, disabled],
  );

  return (
    <li className={styles.spellWrapper}>
      <div className={styles.spellSummary}>
        <SpellSummaryButtonLeading isKnown={isKnown} disabled={disabled} {...spellSummaryData} />
        <a
          className={`${styles.summary} ${disabled ? styles.disabled : ''}`}
          tabIndex={0}
          href="#"
          onClick={openSpellDialog}
        >
          <h4>{title}</h4>
          <div className={styles.levelAndTime}>
            {[
              showLevel ? formatSpellLevel(level) : false,
              ...highlights.map((highlight) => getSpellHighlight(spellWithDetails, highlight)),
            ]
              .filter(Boolean)
              .join(' • ')}
          </div>
        </a>
        <SpellSummaryButtonTrailing isKnown={isKnown} disabled={disabled} {...spellSummaryData} />
      </div>
      {isCardMode ? <SpellCard className={styles.spellCard} id={id} url={url} /> : null}
    </li>
  );
};
