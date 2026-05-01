import { type MouseEventHandler, useCallback } from 'react';

import { spellDetails } from '../../constants/spell-details';
import type { Spell } from '../../types';
import { useSingleDialog } from '../Dialog';
import { type HighlightKey, useSettingsContext } from '../SettingsContext';
import { SpellCard } from '../SpellCard';
import { type SpellSummaryData, useSpellListContext } from '../SpellListContext';
import { formatSpellLevel } from '../util';
import { SpellSummaryButtonLeading } from './components/SpellStatusButtonLeading';
import { SpellSummaryButtonTrailing } from './components/SpellStatusButtonTrailing';
import styles from './index.module.css';
import { CLASS_NAME_MAP } from '../../constants/classes';

const getSpellHighlight = (
  { castingTime, levelAndSchool, duration, range, components, spellLists }: Spell.Details,
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
    case 'spellLists':
      return spellLists.map((listId) => CLASS_NAME_MAP[listId]).join(', ');
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
  const spellSummaryData = foundSpell ?? {
    ...spellWithDetails,
    id,
    isPrepared: false,
    isAlwaysPrepared: false,
    url,
  };

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
    [open, title, id, disabled, url],
  );

  return (
    <li className={styles.spellWrapper}>
      <div className={styles.spellSummary}>
        <SpellSummaryButtonLeading isKnown={isKnown} disabled={disabled} {...spellSummaryData} />
        {/** biome-ignore lint/a11y/useValidAnchor: TODO: fix */}
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
