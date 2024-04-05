import { useEffect, useState } from 'react';
import allSpells from '../constants/spells/all.json';
import { Spell } from './types';

const allSpellsFlat = allSpells.flat();

export const Typeahead = ({ appendSpells }: { appendSpells: (spells: Spell[]) => void }) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <>
      <label htmlFor="spell-typeahead">Add a spell by name</label>
      <input id="spell-typeahead" value={value} onChange={(e) => setValue(e.target.value)} />

      {value ? (
        <ul>
          {allSpellsFlat
            .filter(({ title }) => title.match(new RegExp(value, 'i')))
            .slice(0, 10)
            .map((spell) => (
              <li key={spell.id} value={spell.id}>
                <button onClick={() => appendSpells([spell])}>{spell.title}</button>
              </li>
            ))}
        </ul>
      ) : null}
    </>
  );
};
