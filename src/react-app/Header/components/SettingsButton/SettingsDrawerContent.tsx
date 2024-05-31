import style from './index.module.css';
import { Checkbox } from '../../../Checkbox';
import { HighlightKey, useSettingsContext } from '../../../SettingsContext';
import { SpellSummary } from '../../../SpellSummary';
import allSpells from '../../../../constants/spells/all.json';
import { IconDelete } from '../../../icons/IconDelete';

const SAMPLE_SPELL = allSpells[1].find(({ id }) => id === 'detect-magic');
const HIGHLIGHT_LABEL_MAP: Record<HighlightKey, string> = {
  castingTime: 'Casting Time',
  isRitual: 'Ritual',
  isConcentration: 'Concentration',
  range: 'Range',
  components: 'Components',
  duration: 'Duration',
};

const OPTIONS = Object.entries(HIGHLIGHT_LABEL_MAP)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const SettingsDrawerContent = ({
  onClickClearSpells,
}: {
  onClickClearSpells: () => void;
}) => {
  const {
    isCardMode,
    setIsCardMode,
    hideKnownSpells,
    setHideKnownSpells,
    highlights,
    makeUpdateHighlight,
  } = useSettingsContext();

  return (
    <div className={style.settings}>
      <button className={`secondary ${style.removeSpellsButton}`} onClick={onClickClearSpells}>
        <IconDelete /> Remove all spells
      </button>
      <h4>Spell display options</h4>
      <Checkbox checked={isCardMode} onChange={setIsCardMode} label="Card mode" id="card-mode" />
      <Checkbox
        checked={hideKnownSpells}
        onChange={setHideKnownSpells}
        label="Hide known spells"
        id="hide-known-spells"
      />
      <label className={style.selectLabel} htmlFor="higlight-1">
        Primary highlight
      </label>
      <select
        id="highlight-1"
        value={highlights[0]}
        onChange={(e) => makeUpdateHighlight(0)(e.target.value as HighlightKey)}
      >
        {OPTIONS.map(({ label, value }) => (
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
        {OPTIONS.map(({ label, value }) => (
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
        {OPTIONS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ul>
        <SpellSummary {...SAMPLE_SPELL} checkboxIdSuffix="sample" />
      </ul>
    </div>
  );
};
