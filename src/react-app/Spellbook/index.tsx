import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';
import { useSpellListContext } from '../SpellListContext';
import { useState } from 'react';

export const Spellbook = () => {
  const { spellLists, preparedSpells } = useSpellListContext();
  // TODO: add a checkbox to show/hide this
  const [areKnownSpellsVisible, setAreKnownSpellsVisible] = useState(true);

  const hasSpells = spellLists.some((spells) => spells.length > 0);
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  return (
    <div className={styles.spellbook}>
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
    </div>
  );
};
