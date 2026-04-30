import { spellDetails } from '../../constants/spell-details';
import { SpellCard } from '../SpellCard';
import { type SpellSummaryData, useSpellListContext } from '../SpellListContext';
import { formatSpellLevel } from '../util';

const sortByLength = (spellSummaryA: SpellSummaryData, spellSummaryB: SpellSummaryData) => {
  const spellA = JSON.stringify(spellDetails[spellSummaryA.id]);
  const spellB = JSON.stringify(spellDetails[spellSummaryB.id]);

  return spellA.length - spellB.length;
};

export const PrintSection = () => {
  const { preparedSpells } = useSpellListContext();
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  if (!hasPreparedSpells) return null;

  return preparedSpells.map((spells, spellLevel) =>
    spells.length > 0 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: The index here represents the spell level, so the array order will not change
      <section className="printableSpells" key={spellLevel}>
        <h2>{formatSpellLevel(spellLevel, true)}</h2>
        <ul>
          {spells.sort(sortByLength).map((spell) => (
            <SpellCard {...spell} key={spell.id} showTitle />
          ))}
        </ul>
      </section>
    ) : null,
  );
};
