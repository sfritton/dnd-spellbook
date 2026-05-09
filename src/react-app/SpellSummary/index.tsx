import { type MouseEventHandler, useCallback } from 'react';

import { CLASS_NAME_MAP } from '../../constants/classes';
import { spellDetails } from '../../constants/spell-details';
import type { ClassId, Spell } from '../../types';
import { useAbilities } from '../AbilityContext';
import type { CharacterClassMap } from '../AbilityContext/types';
import { getAbilityNumber } from '../AbilityContext/util';
import { useSingleDialog } from '../Dialog';
import { type HighlightKey, useSettingsContext } from '../SettingsContext';
import { SpellCard } from '../SpellCard';
import { type SpellSummaryData, useSpellListContext } from '../SpellListContext';
import { classNames, formatSpellLevel } from '../util';
import { SpellSummaryButtonLeading } from './components/SpellStatusButtonLeading';
import { SpellSummaryButtonTrailing } from './components/SpellStatusButtonTrailing';
import styles from './index.module.css';

const getSpellHighlight = (
  { castingTime, levelAndSchool, duration, range, components, spellLists, level }: Spell.Details,
  highlight: HighlightKey,
  characterClassMap: CharacterClassMap,
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

    case 'mySpellLists':
      return spellLists
        .filter((listId) => {
          const relevantClass = characterClassMap[listId as ClassId];
          if (!relevantClass) return false;

          return level <= getAbilityNumber(relevantClass.maxSpellLevel);
        })
        .map((listId) => CLASS_NAME_MAP[listId])
        .join(', ');
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
  const { characterClassMap } = useAbilities();
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
          className={classNames(styles.summary, { [styles.disabled]: disabled })}
          tabIndex={0}
          href="#"
          onClick={openSpellDialog}
        >
          <h4>{title}</h4>
          <div className={styles.levelAndTime}>
            {[
              showLevel ? formatSpellLevel(level) : false,
              ...highlights.map((highlight) =>
                getSpellHighlight(spellWithDetails, highlight, characterClassMap),
              ),
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
