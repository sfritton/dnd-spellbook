import { useState } from 'react';
import allSpells from '../../constants/spells/all.json';
import { Spell } from '../types';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';

const allSpellsFlat = allSpells.flat();

// TODO: allow user to add multiple spells
export const Typeahead = ({ appendSpells }: { appendSpells: (spells: Spell[]) => void }) => {
  const [value, setValue] = useState<string>('');

  return (
    <form
      autoComplete="off"
      className={styles.typeaheadForm}
      onSubmit={(e) => {
        e.preventDefault();
        console.log(e.target);
      }}
    >
      <input
        autoComplete="false"
        aria-hidden="true"
        name="hidden"
        type="text"
        style={{ display: 'none' }}
      ></input>
      <label htmlFor="spell-typeahead">Add a spell by name</label>
      <input id="spell-typeahead" value={value} onChange={(e) => setValue(e.target.value)} />

      {value ? (
        <ul>
          {allSpellsFlat
            .filter(({ title }) => title.match(new RegExp(value, 'i')))
            .slice(0, 10)
            .map((spell) => (
              <li key={spell.id} value={spell.id}>
                <button
                  onClick={() => {
                    appendSpells([spell]);
                    setValue('');
                  }}
                >
                  {spell.title}
                  <div className={styles.level}>{formatSpellLevel(spell.level)}</div>
                </button>
              </li>
            ))}
        </ul>
      ) : null}
    </form>
  );
};
