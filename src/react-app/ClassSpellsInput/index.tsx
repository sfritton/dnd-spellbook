import { Fragment, useState } from 'react';
import { formatSpellLevel } from '../util';

const CLASS_OPTIONS = [
  {
    value: 'artificer',
    label: 'artificer',
  },
  {
    value: 'bard',
    label: 'bard',
  },
  {
    value: 'cleric',
    label: 'cleric',
  },
  {
    value: 'druid',
    label: 'druid',
  },
  {
    value: 'eldritchKnight',
    label: 'Fighter: eldritch knight',
  },
  {
    value: 'paladin',
    label: 'paladin',
  },
  {
    value: 'ranger',
    label: 'ranger',
  },
  {
    value: 'arcaneTrickster',
    label: 'Rogue: arcane trickster',
  },
  {
    value: 'sorcerer',
    label: 'sorcerer',
  },
  {
    value: 'warlock',
    label: 'warlock',
  },
  {
    value: 'wizard',
    label: 'wizard',
  },
] as const;

const LEVEL_OPTIONS = [...new Array(10)].map((_, i) => ({
  value: i,
  label: formatSpellLevel(i, true),
}));

export const ClassSpellsInput = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return <button onClick={() => setIsOpen(true)}>Add class spells</button>;

  return (
    <form onSubmit={() => setIsOpen(false)}>
      <select>
        {CLASS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <fieldset>
        <legend>Spell levels</legend>
        {LEVEL_OPTIONS.map(({ value, label }) => (
          <Fragment key={value}>
            <input type="checkbox" value={value} id={`level-${value}`} />
            <label htmlFor={`level-${value}`}>{label}</label>
          </Fragment>
        ))}
      </fieldset>
      <button type="submit">Load spells</button>
    </form>
  );
};
