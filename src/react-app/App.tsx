import { useCallback, useEffect, useState } from 'react';
import { ClassSpellsInput } from './ClassSpellsInput';
import { Typeahead } from './Typeahead';
import { Spell } from './types';
import { SpellList } from './SpellList';

export const App = () => {
  const [mySpells, setMySpells] = useState<Spell[]>([]);
  const appendSpells = useCallback((spells: Spell[]) => {
    setMySpells((prevMySpells) =>
      [
        ...prevMySpells,
        ...spells.filter(({ id }) => prevMySpells.every((prevSpell) => prevSpell.id !== id)),
      ].sort((spellA, spellB) => spellA.level - spellB.level),
    );
  }, []);

  return (
    <section>
      <h2>My Spells</h2>
      <SpellList spells={mySpells} />
      <Typeahead appendSpells={appendSpells} />
      <ClassSpellsInput appendSpells={appendSpells} />
      <button>Print Spells</button>
    </section>
  );
};
