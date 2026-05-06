import { useFilterContext } from '../../FilterContext';
import { useAbilities } from '../../HealthAndSpellSlots/use-abilities';
import { IconCheckmark } from '../../icons/IconCheckmark';
import { IconStar } from '../../icons/IconStar';
import { useSpellListContext } from '../../SpellListContext';
import styles from '../index.module.css';
import { ClassSpellBadge } from './ClassSpellBadge';

export const BadgeList = () => {
  const { preparedSpells, alwaysPreparedSpells, getSpellCountByClass } = useSpellListContext();
  const { getShouldShowSpell } = useFilterContext();
  const { characterClassMap } = useAbilities();
  const preparedSpellsByClass = getSpellCountByClass(characterClassMap);

  const preparedSpellCount = preparedSpells.reduce(
    (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
    0,
  );

  const alwaysPreparedSpellCount = alwaysPreparedSpells.reduce(
    (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
    0,
  );
  const hasAlwaysPreparedSpells = alwaysPreparedSpellCount > 0;

  return (
    <div className={styles.badgeList}>
      {hasAlwaysPreparedSpells ? (
        <>
          <div className={styles.spellCount}>
            <IconCheckmark /> {preparedSpellCount - alwaysPreparedSpellCount} prepared
          </div>
          <div className={styles.spellCount}>
            <IconStar /> {alwaysPreparedSpellCount} always prepared
          </div>
        </>
      ) : (
        <div className={styles.spellCount}>{preparedSpellCount}</div>
      )}
      {Object.entries(preparedSpellsByClass).map(([classId, count]) => (
        <ClassSpellBadge key={classId} classId={classId} spellCount={count} />
      ))}
    </div>
  );
};
