import { useState } from 'react';
import allSpells from '../../constants/spells/all.json';
import { Spell } from '../types';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';
import { SpellSummary } from '../SpellSummary';

const allSpellsFlat = allSpells.flat();

export const Typeahead = ({
  appendSpells,
}: {
  appendSpells: (spells: Spell.Summary[]) => void;
}) => {
  const [value, setValue] = useState<string>('');
  const [spells, setSpells] = useState<Spell.Summary[]>([]);

  const makeHandleChange = (spell: Spell.Summary) => (isChecked: boolean) => {
    if (isChecked) {
      setSpells((prevSpells) => [...prevSpells, spell]);
    } else {
      setSpells((prevSpells) => prevSpells.filter(({ id }) => id !== spell.id));
    }
  };

  return (
    <form
      autoComplete="off"
      className={styles.typeaheadForm}
      onSubmit={(e) => {
        e.preventDefault();
        appendSpells(spells);
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
      <input
        type="text"
        id="spell-typeahead"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <ul>
        {value
          ? allSpellsFlat
              .filter(({ title }) => title.match(new RegExp(value, 'i')))
              .slice(0, 10)
              .map((spell) => (
                <SpellSummary
                  key={spell.id}
                  {...spell}
                  isChecked={Boolean(spells.find(({ id }) => id === spell.id))}
                  onChange={makeHandleChange(spell)}
                  showLevel
                />
              ))
          : null}
      </ul>
      {spells.length > 0 ? <button type="submit">Add selected spells</button> : null}
    </form>
  );
};
