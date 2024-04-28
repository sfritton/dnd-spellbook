import { ClassSpellsInput } from '../ClassSpellsInput';
import { Typeahead } from '../Typeahead';
import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { useDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { formatSpellLevel, getDescriptionLength } from '../util';
import { useSpellListContext } from '../SpellListContext';
import { useState } from 'react';

export const App = () => {
  const { spellLists, preparedSpells, appendSpells, clearSpells } = useSpellListContext();
  const [TypeaheadDialog, { open: openTypeahead }] = useDialog();
  const [ClassSpellsDialog, { open: openClassSpells }] = useDialog();
  // TODO: add a checkbox to show/hide this
  const [areKnownSpellsVisible, setAreKnownSpellsVisible] = useState(true);

  const hasSpells = spellLists.some((spells) => spells.length > 0);
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  return (
    <>
      <section>
        <h2>Prepared Spells</h2>
        {hasPreparedSpells ? (
          preparedSpells.map((spells, index) =>
            spells.length > 0 ? (
              <section key={index}>
                <h3>{formatSpellLevel(index, true)}</h3>
                <SpellList spells={spells} />
              </section>
            ) : null,
          )
        ) : (
          <div className={styles.spellListPlaceholder}>
            {hasSpells
              ? 'Check the box next to a spell to add it to your prepared spells.'
              : 'As you fill out your spellbook, you can prepare spells to see them here.'}
          </div>
        )}
      </section>
      <h2>Known Spells</h2>
      {areKnownSpellsVisible ? (
        <>
          {!hasSpells ? (
            <section>
              <div className={styles.spellListPlaceholder}>
                Your spellbook is empty! Use the buttons below to start filling it out.
              </div>
            </section>
          ) : null}
          {spellLists.map((spells, index) =>
            spells.length > 0 ? (
              <section key={index}>
                <h3>{formatSpellLevel(index, true)}</h3>
                <SpellList spells={spells} />
              </section>
            ) : null,
          )}
        </>
      ) : null}
      <div className={`${styles.stickyFooter} parchment overlay`}>
        <button className="secondary" onClick={openTypeahead}>
          Add spells by name
        </button>
        {/* TODO: dialog no longer auto-closes on submit */}
        <TypeaheadDialog title="Add spells by name">
          <Typeahead appendSpells={appendSpells} />
        </TypeaheadDialog>
        <button className="secondary" onClick={openClassSpells}>
          Add class spells
        </button>
        {/* TODO: dialog no longer auto-closes on submit */}
        <ClassSpellsDialog title="Add class spells">
          <ClassSpellsInput appendSpells={appendSpells} />
        </ClassSpellsDialog>
        {hasSpells ? (
          <button className="secondary" onClick={clearSpells}>
            Clear spells
          </button>
        ) : null}
        {/* {mySpells.length > 0 ? <button onClick={() => window.print()}>Print Spells</button> : null} */}
      </div>
      {/* <div className={styles.printableSpells}>
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
      </div> */}
    </>
  );
};
