import { useCallback, useEffect, useState } from 'react';
import { ClassSpellsInput } from '../ClassSpellsInput';
import { Typeahead } from '../Typeahead';
import { Spell } from '../types';
import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { useDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { getDescriptionLength } from '../util';

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

  const [spellsToSkip, setSpellsToSkip] = useState<string[]>([]);
  const makeToggleSpell = useCallback(
    (id: string) => (isChecked: boolean) => {
      setSpellsToSkip((prevSpellsToSkip) => {
        const spellIndex = prevSpellsToSkip.findIndex((spellId) => spellId === id);

        if (!isChecked) return [...prevSpellsToSkip, id];

        if (spellIndex === -1) return prevSpellsToSkip;

        return [
          ...prevSpellsToSkip.slice(0, spellIndex),
          ...prevSpellsToSkip.slice(spellIndex + 1),
        ];
      });
    },
    [],
  );

  return (
    <section>
      <h2>My Spells</h2>
      <SpellList spells={mySpells} spellsToSkip={spellsToSkip} makeToggleSpell={makeToggleSpell} />
      <div className={`${styles.stickyFooter} parchment overlay`}>
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
        {mySpells.length > 0 ? <button onClick={() => window.print()}>Print Spells</button> : null}
      </div>
      <div className={styles.printableSpells}>
        {mySpells
          .filter(({ id }) => !spellsToSkip.includes(id))
          .sort((spellA, spellB) => {
            if (spellA.level !== spellB.level) return spellA.level - spellB.level;

            const spellALength = getDescriptionLength(spellA.id);
            const spellBLength = getDescriptionLength(spellB.id);

            return spellALength - spellBLength;
          })
          .map(({ id }) => (
            <SpellCard id={id} key={id} />
          ))}
      </div>
    </section>
  );
};
