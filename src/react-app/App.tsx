import { useCallback, useEffect, useState } from 'react';
import * as spellLists from './spells';
import { ClassSpellsInput } from './ClassSpellsInput';
import { formatSpellLevel } from './util';

interface Spell {
  title: string;
  url: string;
  level: number;
  id: string;
}

export const App = () => {
  const [mySpells, setMySpells] = useState<Spell[]>([]);
  const appendSpells = useCallback((spells: Spell[]) => {
    setMySpells((prevMySpells) => [
      ...prevMySpells,
      ...spells.filter(({ id }) => prevMySpells.every((prevSpell) => prevSpell.id !== id)),
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
        levels.flatMap((level) => spellLists[className as keyof typeof spellLists][level]),
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
            {mySpells.map(({ id, level, title }) => (
              <li key={id}>
                <b>{title}</b> ({formatSpellLevel(level)})
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
