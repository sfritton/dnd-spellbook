import { CLASS_NAME_MAP } from '../../constants/classes';
import type { ClassId, Spell } from '../../types';
import type { CharacterClassMap } from '../HealthAndSpellSlots/types';
import { getAbilityNumber } from '../HealthAndSpellSlots/util';

const CLASS_DELIMITER = '__';
const NO_VALID_CLASSES_KEY = 'no-valid-classes';

export const makeGetSpellCountByClass =
  (preparedSpells: Spell.Details[]) => (characterClassMap: CharacterClassMap) => {
    const classHistogram: Partial<Record<string, number>> = {};

    // 1. Mark down each prepared spell under its class(es)
    preparedSpells.forEach(({ spellLists, level }) => {
      const matchingSpellLists = spellLists.filter(
        (listId: ClassId) =>
          characterClassMap[listId] !== undefined &&
          getAbilityNumber(characterClassMap[listId].maxSpellLevel) >= level,
      );

      const key =
        matchingSpellLists.length < 1
          ? NO_VALID_CLASSES_KEY
          : matchingSpellLists.join(CLASS_DELIMITER);

      classHistogram[key] = (classHistogram[key] ?? 0) + 1;
    });

    // 2. For spells that have multiple classes, try to pack them into existing classes if there's space
    Object.keys(classHistogram).forEach((key) => {
      const classIds = key.split(CLASS_DELIMITER);

      if (classIds.length === 1) return;

      classIds.forEach((classId) => {
        const classMaximums = characterClassMap[classId as ClassId];
        if (classHistogram[key] <= 0 || !classMaximums) return;

        const availableCount =
          getAbilityNumber(classMaximums.maxSpellsPrepared) - (classHistogram[classId] ?? 0);

        if (availableCount <= 0) return;

        const amountToTransfer = Math.min(availableCount, classHistogram[key]);

        classHistogram[key] -= amountToTransfer;
        classHistogram[classId] = (classHistogram[classId] ?? 0) + amountToTransfer;
      });
    });

    // 3. Any remaining multi-class spells need to be forced into one of their buckets even if they don't fit
    Object.keys(classHistogram).forEach((key) => {
      const classIds = key.split(CLASS_DELIMITER);

      if (classIds.length === 1) return;

      classIds.forEach((classId) => {
        if (classHistogram[key] <= 0) return;

        classHistogram[classId] = (classHistogram[classId] ?? 0) + classHistogram[key];
        classHistogram[key] = 0;
      });
    });

    // 4. Combine all spells that haven't been matched to a class into a single "non-matching" bucket
    const singleClassHistogram = Object.fromEntries(
      Object.entries(classHistogram).filter(([key, value = 0]) => CLASS_NAME_MAP[key] && value > 0),
    );
    const otherKeys = Object.keys(classHistogram).filter((key) => !CLASS_NAME_MAP[key]);

    const nonMatchingSpellCount = otherKeys.reduce(
      (acc, key) => acc + (classHistogram[key] ?? 0),
      0,
    );

    if (nonMatchingSpellCount === 0) return singleClassHistogram;

    return {
      ...singleClassHistogram,
      [NO_VALID_CLASSES_KEY]: nonMatchingSpellCount,
    };
  };
