import { useCallback, useEffect, useState } from 'react';
import * as spellLists from './spells';
import { ClassSpellsInput } from './ClassSpellsInput';
import { formatSpellLevel } from './util';

interface Spell {
  name: string;
  url: string;
  level: number;
}

export const App = () => {
  const [mySpells, setMySpells] = useState<Spell[]>([]);
  const appendSpells = useCallback((spells: Spell[]) => {
    setMySpells((prevMySpells) => [
      ...prevMySpells,
      ...spells.filter(({ name }) => prevMySpells.every((prevSpell) => prevSpell.name !== name)),
    ]);
  }, []);

  useEffect(() => {
    const handleSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const [select, fieldset] = e.target as HTMLFormElement;

      const className = (select as HTMLSelectElement).value;
      const levels = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        Number.parseInt(input.getAttribute('value'), 10),
      );

      appendSpells(
        spellLists[className as keyof typeof spellLists].spellList.filter((spell) =>
          levels.includes(spell.level),
        ),
      );
    };

    document.addEventListener('submit', handleSubmit);

    return () => document.removeEventListener('submit', handleSubmit);
  }, [appendSpells]);

  return (
    <>
      <section>
        <h2>My Spells</h2>
        {mySpells.length > 0 ? (
          <ul>
            {mySpells.map(({ name, level }) => (
              <li key={name}>
                <b>{name}</b> ({formatSpellLevel(level)})
              </li>
            ))}
          </ul>
        ) : null}
        <input type="text" />
        <ClassSpellsInput />
        <button>Print Spells</button>
      </section>
    </>
  );
};
