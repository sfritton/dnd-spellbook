import { ClassSpellsInput } from '../ClassSpellsInput';
import { Typeahead } from '../Typeahead';
import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { useDialog } from '../Dialog';
import { SpellCard } from '../SpellCard';
import { formatSpellLevel, getDescriptionLength } from '../util';
import { useSpellListContext } from '../SpellListContext';

export const App = () => {
  const { spellLists, preparedSpells, appendSpells, clearSpells } = useSpellListContext();
  const [TypeaheadDialog, { open: openTypeahead }] = useDialog();
  const [ClassSpellsDialog, { open: openClassSpells }] = useDialog();

  const hasSpells = spellLists.some((spells) => spells.length > 0);
  const hasPreparedSpells = preparedSpells.length > 0;

  return (
    <>
      {hasSpells ? (
        <section>
          <h2>Prepared Spells</h2>
          {hasPreparedSpells ? (
            <SpellList spells={preparedSpells} showLevel />
          ) : (
            <div className={styles.spellListPlaceholder}>
              Check the box next to a spell to add it to your prepared spells.
            </div>
          )}
        </section>
      ) : null}
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
            <h2>{formatSpellLevel(index, true)}</h2>
            <SpellList spells={spells} />
          </section>
        ) : null,
      )}
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
