import { SpellSummaryData, useSpellListContext } from '../SpellListContext';
import { formatSpellLevel } from '../util';
import { spellDetails } from '../../constants/spell-details';
import styles from './index.module.css';
import { SpellCard } from '../SpellCard';

const sortByLength = (spellSummaryA: SpellSummaryData, spellSummaryB: SpellSummaryData) => {
  const spellA = JSON.stringify(spellDetails[spellSummaryA.id]);
  const spellB = JSON.stringify(spellDetails[spellSummaryB.id]);

  return spellA.length - spellB.length;
};

export const PrintSection = () => {
  const { preparedSpells } = useSpellListContext();
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  if (!hasPreparedSpells) return null;

  return preparedSpells.map((spells, index) =>
    spells.length > 0 ? (
      <section className={styles.printableSpells} key={index}>
        <h2>{formatSpellLevel(index, true)}</h2>
        <ul>
          {spells.sort(sortByLength).map((spell) => (
            <SpellCard {...spell} key={spell.id} showTitle />
          ))}
        </ul>
      </section>
    ) : null,
  );
};
