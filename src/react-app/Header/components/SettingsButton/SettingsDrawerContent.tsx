import { useMemo } from 'react';

import allSpells from '../../../../constants/spells/all.json';
import type { Spell } from '../../../../types';
import { Checkbox } from '../../../Checkbox';
import { IconDelete } from '../../../icons/IconDelete';
import { type HighlightKey, useSettingsContext } from '../../../SettingsContext';
import { SpellSummary } from '../../../SpellSummary';
import style from './index.module.css';
import { useAbilities } from '../../../HealthAndSpellSlots/use-abilities';

const SAMPLE_SPELL = allSpells[1].find(({ id }) => id === 'detect-magic') as Spell.Summary;
const HIGHLIGHT_LABEL_MAP: Record<HighlightKey, string> = {
  castingTime: 'Casting Time',
  isRitual: 'Ritual',
  isConcentration: 'Concentration',
  range: 'Range',
  components: 'Components',
  duration: 'Duration',
  spellLists: 'Spell Lists',
  mySpellLists: 'My Spell Lists',
};

const OPTIONS = Object.entries(HIGHLIGHT_LABEL_MAP)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const SettingsDrawerContent = ({
  onClickClearSpells,
}: {
  onClickClearSpells: () => void;
}) => {
  const { isCardMode, setIsCardMode, highlights, makeUpdateHighlight } = useSettingsContext();

  const { characterClassMap } = useAbilities();

  const characterClasses = useMemo(
    () => Object.entries(characterClassMap).filter(([_, value]) => Boolean(value)),
    [characterClassMap],
  );

  const highlightOptions = useMemo(
    () =>
      characterClasses.length > 0
        ? OPTIONS
        : // Only include this option if they have spell lists selected
          OPTIONS.filter(({ value }) => value !== 'mySpellLists'),
    [characterClasses],
  );

  return (
    <div className={style.settings}>
      <button
        type="button"
        className={`secondary ${style.removeSpellsButton}`}
        onClick={onClickClearSpells}
      >
        <IconDelete /> Remove all spells
      </button>
      <h4>Spell display options</h4>
      <Checkbox checked={isCardMode} onChange={setIsCardMode} label="Card mode" id="card-mode" />
      <label className={style.selectLabel} htmlFor="higlight-1">
        Primary highlight
      </label>
      <select
        id="highlight-1"
        value={highlights[0]}
        onChange={(e) => makeUpdateHighlight(0)(e.target.value as HighlightKey)}
      >
        {highlightOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <label className={style.selectLabel} htmlFor="higlight-2">
        Secondary highlight
      </label>
      <select
        id="highlight-2"
        value={highlights[1]}
        onChange={(e) => makeUpdateHighlight(1)(e.target.value as HighlightKey)}
      >
        {highlightOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <label className={style.selectLabel} htmlFor="higlight-3">
        Tertiary highlight
      </label>
      <select
        id="highlight-3"
        value={highlights[2]}
        onChange={(e) => makeUpdateHighlight(2)(e.target.value as HighlightKey)}
      >
        {highlightOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <h5>Preview</h5>
      <ul>
        <SpellSummary {...SAMPLE_SPELL} disabled />
      </ul>
    </div>
  );
};
