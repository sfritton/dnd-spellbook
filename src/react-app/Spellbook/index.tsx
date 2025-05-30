import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';
import { useSpellListContext } from '../SpellListContext';
import { WelcomePage } from '../WelcomePage';
import { Collapsible } from '../Collapsible';
import { FilterSummary } from '../FilterSummary';
import { PrintSection } from '../PrintSection';

export const Spellbook = () => {
  const { spellLists, preparedSpells } = useSpellListContext();

  const hasSpells = spellLists.some((spells) => spells.length > 0);
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  if (!hasSpells) return <WelcomePage />;

  return (
    <>
      <FilterSummary />
      <h2>Prepared Spells</h2>
      {hasPreparedSpells ? (
        preparedSpells.map((spells, index) =>
          spells.length > 0 ? (
            <section key={index}>
              <h3>{formatSpellLevel(index, true)}</h3>
              <SpellList spells={spells} checkboxIdSuffix="prepared" />
            </section>
          ) : null,
        )
      ) : (
        <div className={styles.spellListPlaceholder}>
          Check the box next to a spell to add it to your prepared spells.
        </div>
      )}
      <PrintSection />
      <h2>Known Spells</h2>
      {spellLists.map((spells, index) =>
        spells.length > 0 ? (
          <section key={index}>
            <Collapsible
              title={<h3 className={styles.spellListHeader}>{formatSpellLevel(index, true)}</h3>}
            >
              <SpellList spells={spells} checkboxIdSuffix="known" />
            </Collapsible>
          </section>
        ) : null,
      )}
    </>
  );
};
