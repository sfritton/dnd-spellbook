import { useCallback, useEffect, useState } from 'react';
import { ClassSpellsInput } from '../ClassSpellsInput';
import { Typeahead } from '../Typeahead';
import { Spell } from '../types';
import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { useDialog } from '../Dialog';

export const App = () => {
  // TODO: convert to spells by level
  const [mySpells, setMySpells] = useState<Spell.Summary[]>([]);
  const appendSpells = useCallback((spells: Spell.Summary[]) => {
    setMySpells((prevMySpells) =>
      [
        ...prevMySpells,
        ...spells.filter(({ id }) => prevMySpells.every((prevSpell) => prevSpell.id !== id)),
      ].sort((spellA, spellB) => spellA.level - spellB.level),
    );
  }, []);

  const [TypeaheadDialog, { open: openTypeahead }] = useDialog();
  const [ClassSpellsDialog, { open: openClassSpells }] = useDialog();

  return (
    <section>
      <h2>My Spells</h2>
      <SpellList spells={mySpells} />
      <div className={styles.stickyFooter}>
        <button className="secondary" onClick={openTypeahead}>
          Add spells by name
        </button>
        <TypeaheadDialog title="Add spells by name">
          <Typeahead appendSpells={appendSpells} />
        </TypeaheadDialog>
        <button className="secondary" onClick={openClassSpells}>
          Add class spells
        </button>
        <ClassSpellsDialog title="Add class spells">
          <ClassSpellsInput appendSpells={appendSpells} />
        </ClassSpellsDialog>
        <button>Print Spells</button>
      </div>
    </section>
  );
};
