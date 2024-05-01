import { useCallback, useState } from 'react';
import allSpells from '../../../../constants/spells/all.json';
import { Spell } from '../../../types';
import { SpellSummary } from '../../../SpellSummary';
import { useSpellListContext } from '../../../SpellListContext';

const allSpellsFlat = allSpells.flat();

export const TypeaheadDrawerContent = ({ close }: { close: () => void }) => {
  const [value, setValue] = useState<string>('');
  const [spells, setSpells] = useState<Spell.Summary[]>([]);
  const { appendSpells } = useSpellListContext();

  const makeHandleChange = useCallback(
    (spell: Spell.Summary) => (isChecked: boolean) => {
      if (isChecked) {
        setSpells((prevSpells) => [...prevSpells, spell]);
      } else {
        setSpells((prevSpells) => prevSpells.filter(({ id }) => id !== spell.id));
      }
    },
    [setSpells],
  );

  return (
    <>
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
    </>
  );
};
