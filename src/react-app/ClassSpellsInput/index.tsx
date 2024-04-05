import { Fragment, useState } from 'react';
import { formatSpellLevel } from '../util';
import { CLASSES } from '../../constants/classes';

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
        {CLASSES.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
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
