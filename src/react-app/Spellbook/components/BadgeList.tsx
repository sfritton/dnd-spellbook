import { useFilterContext } from '../../FilterContext';
import { IconStar } from '../../icons/IconStar';
import { useSpellListContext } from '../../SpellListContext';
import styles from '../index.module.css';
import { PreparedSpellsBadge } from './PreparedSpellsBadge';

export const BadgeList = () => {
  const { alwaysPreparedSpells } = useSpellListContext();
  const { getShouldShowSpell } = useFilterContext();

  const alwaysPreparedSpellCount = alwaysPreparedSpells.reduce(
    (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
    0,
  );
  const hasAlwaysPreparedSpells = alwaysPreparedSpellCount > 0;

  return (
    <div className={styles.badgeList}>
      <PreparedSpellsBadge />
      {hasAlwaysPreparedSpells ? (
        <div className={styles.spellCount}>
          <IconStar /> {alwaysPreparedSpellCount} always prepared
        </div>
      ) : null}
    </div>
  );
};
