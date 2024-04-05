import { Fragment, useState, useEffect, useCallback, FormEvent } from 'react';
import { formatSpellLevel } from '../util';
import { CLASSES } from '../../constants/classes';
import * as spellLists from '../spells';
import { Spell } from '../types';

const LEVEL_OPTIONS = [...new Array(10)].map((_, i) => ({
  value: i,
  label: formatSpellLevel(i, true),
}));

export const ClassSpellsInput = ({ appendSpells }: { appendSpells: (spells: Spell[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const [select, fieldset] = e.target as HTMLFormElement;

      const className = (select as HTMLSelectElement).value;
      const levels = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        Number.parseInt(input.getAttribute('value'), 10),
      );

      appendSpells(
        levels.flatMap((level) => spellLists[className as keyof typeof spellLists][level]),
      );

      setIsOpen(false);
    },
    [appendSpells],
  );

  if (!isOpen) return <button onClick={() => setIsOpen(true)}>Add class spells</button>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="class-select">Choose a class</label>
      <select id="class-select">
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
