import { Collapsible } from '../Collapsible';
import { useFilterContext } from '../FilterContext';
import { FilterSummary } from '../FilterSummary';
import { SpellList } from '../SpellList';
import { useSpellListContext } from '../SpellListContext';
import { formatSpellLevel } from '../util';
import { WelcomePage } from '../WelcomePage';
import { BadgeList } from './components/BadgeList';
import styles from './index.module.css';

export const Spellbook = () => {
  const { spellLists, preparedSpells } = useSpellListContext();
  const { getShouldShowSpell } = useFilterContext();

  const knownSpellCount = spellLists.reduce(
    (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
    0,
  );
  const hasSpells = knownSpellCount > 0;

  const preparedSpellCount = preparedSpells.reduce(
    (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
    0,
  );
  const hasPreparedSpells = preparedSpellCount > 0;

  if (!hasSpells) return <WelcomePage />;

  return (
    <>
      <FilterSummary />
      <h2 className={styles.spellListsHeader}>
        Prepared Spells
        <BadgeList />
      </h2>
      {hasPreparedSpells ? (
        preparedSpells.map((spells, index) =>
          spells.length > 0 ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: Index is the best we have here
            <section key={index}>
              <h3>{formatSpellLevel(index, true)}</h3>
              <SpellList spells={spells} />
            </section>
          ) : null,
        )
      ) : (
        <div className={styles.spellListPlaceholder}>
          Check the box next to a spell to add it to your prepared spells.
        </div>
      )}
      <h2 className={styles.spellListsHeader}>
        Known Spells
        <div className={styles.spellCount}>{knownSpellCount}</div>
      </h2>
      {spellLists.map((spells, index) =>
        spells.length > 0 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: Index is the best we have here
          <section key={index}>
            <Collapsible
              title={<h3 className={styles.spellListHeader}>{formatSpellLevel(index, true)}</h3>}
            >
              <SpellList spells={spells} />
            </Collapsible>
          </section>
        ) : null,
      )}
    </>
  );
};
