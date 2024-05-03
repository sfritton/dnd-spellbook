import { SpellSummaryData, useSpellListContext } from '../SpellListContext';
import { SpellSummary } from '../SpellSummary';
import styles from './index.module.css';

export const SpellList = ({
  spells,
  showLevel = false,
  isInPreparedSection,
}: {
  spells: SpellSummaryData[];
  showLevel?: boolean;
  isInPreparedSection?: boolean;
}) => {
  const { makeToggleSpell } = useSpellListContext();

  if (spells.length < 1) return null;

  return (
    <ul className={styles.spellList}>
      {spells.map((spell) => (
        <SpellSummary
          isChecked={spell.isPrepared}
          onChange={makeToggleSpell({ id: spell.id, level: spell.level })}
          key={spell.id}
          showLevel={showLevel}
          isInPreparedSection={isInPreparedSection}
          {...spell}
        />
      ))}
    </ul>
  );
};
