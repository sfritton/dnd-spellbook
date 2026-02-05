import { useFilterContext } from '../FilterContext';
import { SpellSummaryData } from '../SpellListContext';
import { SpellSummary } from '../SpellSummary';
import styles from './index.module.css';

export const SpellList = ({
  spells,
  showLevel = false,
}: {
  spells: SpellSummaryData[];
  showLevel?: boolean;
}) => {
  const { getShouldShowSpell } = useFilterContext();

  if (spells.length < 1) return null;

  return (
    <ul className={styles.spellList}>
      {spells
        .filter((spell) => getShouldShowSpell(spell))
        .map((spell) => (
          <SpellSummary key={spell.id} showLevel={showLevel} {...spell} />
        ))}
    </ul>
  );
};
