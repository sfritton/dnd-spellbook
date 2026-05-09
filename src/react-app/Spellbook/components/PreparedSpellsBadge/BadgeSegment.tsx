import { CLASS_NAME_MAP } from '../../../../constants/classes';
import type { ClassId } from '../../../../types';
import { useAbilities } from '../../../HealthAndSpellSlots/use-abilities';
import { getAbilityNumber } from '../../../HealthAndSpellSlots/util';
import styles from './index.module.css';

interface ClassSpellBadgeProps {
  classId: string;
  spellCount: number | undefined;
}

export const BadgeSegment = ({ classId, spellCount }: ClassSpellBadgeProps) => {
  const { characterClassMap } = useAbilities();
  const classMaximums = characterClassMap[classId as ClassId];

  if (spellCount === undefined) return null;

  if (!classMaximums) return <div className={styles.badgeSegment}>{spellCount} Unknown</div>;

  const maxSpellsPrepared = getAbilityNumber(classMaximums.maxSpellsPrepared);

  return (
    <div className={styles.badgeSegment}>
      {spellCount}/{maxSpellsPrepared} {CLASS_NAME_MAP[classId]}
    </div>
  );
};
