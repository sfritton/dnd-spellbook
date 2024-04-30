import { useState } from 'react';
import allSpells from '../../../../constants/spells/all.json';
import { Spell } from '../../../types';
import styles from './index.module.css';
import { SpellSummary } from '../../../SpellSummary';
import { useDialog } from '../../../Dialog';
import { useSpellListContext } from '../../../SpellListContext';

const allSpellsFlat = allSpells.flat();

export const TypeaheadButton = () => {
  const [value, setValue] = useState<string>('');
  const [spells, setSpells] = useState<Spell.Summary[]>([]);
  const [TypeaheadDrawer, { open, close }] = useDialog();
  const { appendSpells } = useSpellListContext();

  const makeHandleChange = (spell: Spell.Summary) => (isChecked: boolean) => {
    if (isChecked) {
      setSpells((prevSpells) => [...prevSpells, spell]);
    } else {
      setSpells((prevSpells) => prevSpells.filter(({ id }) => id !== spell.id));
    }
  };

  return (
    <>
      <button onClick={open}>Add by name</button>
      <TypeaheadDrawer className={styles.typeaheadDrawer} isDrawer title="Add spells by name">
        <form autoComplete="off">
          <input
            autoComplete="false"
            aria-hidden="true"
            name="hidden"
            type="text"
            style={{ display: 'none' }}
          />
          <label htmlFor="spell-typeahead" className="hidden">
            Add a spell by name
          </label>
          <input
            type="text"
            id="spell-typeahead"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
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
        {spells.length > 0 ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              appendSpells(spells);
              close();
            }}
          >
            Add selected spells
          </button>
        ) : null}
      </TypeaheadDrawer>
    </>
  );
};
