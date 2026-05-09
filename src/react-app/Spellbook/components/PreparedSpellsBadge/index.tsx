import { useMemo, useState } from 'react';

import { useAbilities } from '../../../AbilityContext';
import { getAbilityNumber } from '../../../AbilityContext/util';
import { useFilterContext } from '../../../FilterContext';
import { IconCheckmark } from '../../../icons/IconCheckmark';
import { IconChevronRight } from '../../../icons/IconChevronRight';
import { useSpellListContext } from '../../../SpellListContext';
import { NO_VALID_CLASSES_KEY } from '../../../SpellListContext/make-get-spell-count-by-class';
import { classNames } from '../../../util';
import { BadgeSegment } from './BadgeSegment';
import styles from './index.module.css';

export const PreparedSpellsBadge = () => {
  const { preparedSpells, alwaysPreparedSpells, getSpellCountByClass } = useSpellListContext();
  const { getShouldShowSpell } = useFilterContext();
  const { characterClassMap } = useAbilities();
  const preparedSpellsByClass = getSpellCountByClass(characterClassMap);
  const [isOpen, setIsOpen] = useState(false);

  const alwaysPreparedSpellCount = useMemo(
    () =>
      alwaysPreparedSpells.reduce(
        (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
        0,
      ),
    [alwaysPreparedSpells, getShouldShowSpell],
  );

  const preparedSpellCount = useMemo(
    () =>
      preparedSpells.reduce(
        (sum, list) => sum + list.filter((spell) => getShouldShowSpell(spell)).length,
        0,
      ) - alwaysPreparedSpellCount,
    [preparedSpells, getShouldShowSpell, alwaysPreparedSpellCount],
  );

  const hasAlwaysPreparedSpells = alwaysPreparedSpellCount > 0;

  const maximumPreparedSpells = useMemo(
    () =>
      Object.values(characterClassMap).reduce(
        (acc, classMaximums) => acc + getAbilityNumber(classMaximums?.maxSpellsPrepared),
        0,
      ),
    [characterClassMap],
  );

  const characterClasses = useMemo(
    () =>
      Object.entries(characterClassMap).flatMap(([classId, classMaximums]) =>
        classMaximums ? [{ classId, classMaximums }] : [],
      ),
    [characterClassMap],
  );

  const hasCharacterClasses = characterClasses.length > 0;

  const hasTooManyClassSpellsPrepared = useMemo(
    () =>
      hasCharacterClasses &&
      (preparedSpellsByClass[NO_VALID_CLASSES_KEY] > 0 ||
        characterClasses.some(
          ({ classId, classMaximums }) =>
            getAbilityNumber(classMaximums?.maxSpellsPrepared) < preparedSpellsByClass[classId],
        )),
    [hasCharacterClasses, preparedSpellsByClass, characterClasses],
  );

  const hasTooManyPrepared = hasCharacterClasses && preparedSpellCount > maximumPreparedSpells;

  return (
    <button
      type="button"
      className={classNames(styles.preparedSpellsBadge, {
        [styles.open]: hasCharacterClasses && isOpen,
        [styles.warning]: hasTooManyPrepared || hasTooManyClassSpellsPrepared,
      })}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <div className={styles.badgeSegment}>
        {hasAlwaysPreparedSpells ? <IconCheckmark className={styles.checkmark} /> : null}{' '}
        {preparedSpellCount}
        {hasTooManyPrepared ? `/${maximumPreparedSpells}` : null}
        {hasAlwaysPreparedSpells ? ' prepared' : null}
      </div>
      {hasCharacterClasses && preparedSpellCount > 0 ? (
        <>
          {Object.entries(preparedSpellsByClass).map(([classId, count]) => (
            <BadgeSegment key={classId} classId={classId} spellCount={count} />
          ))}
          <div className={styles.badgeSegment}>
            <IconChevronRight className={styles.seeMore} />
          </div>
        </>
      ) : null}
    </button>
  );
};
