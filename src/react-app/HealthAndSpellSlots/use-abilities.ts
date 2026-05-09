import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { formatSpellLevel } from '../util';
import type { Ability, CharacterClassMap } from './types';
import { getAbilityNumber } from './util';

interface CharacterStatus {
  hp: Ability;
  tempHp: Ability;
  spellSlots: Ability[];
  abilities: Ability[];
  characterClassMap: CharacterClassMap;
}

const DEFAULT_ABILITIES: CharacterStatus = {
  hp: { name: 'HP', current: 0, maximum: 0 },
  tempHp: { name: 'temp HP', current: 0, maximum: 0 },
  spellSlots: [...new Array(9)].map((_, index) => ({
    name: formatSpellLevel(index + 1),
    current: 0,
    maximum: 0,
  })),
  abilities: [],
  characterClassMap: {},
};

const convertLegacyStructure = ({
  hp,
  maximums,
  tempHp,
  spellSlots,
  abilities,
}: {
  maximums: {
    hp: number;
    spellSlots: number[];
  };
  hp: number;
  tempHp: number;
  spellSlots: number[];
  abilities: Ability[];
}): CharacterStatus => ({
  hp: { name: 'HP', current: hp, maximum: maximums.hp },
  tempHp: { name: 'temp HP', current: tempHp, maximum: maximums.hp },
  spellSlots: spellSlots.map((current, index) => ({
    name: formatSpellLevel(index + 1),
    current,
    maximum: maximums.spellSlots[index],
  })),
  abilities,
  characterClassMap: {},
});

const getDefaultAbilities = (): CharacterStatus => {
  const storedString = localStorage.getItem('character-status');

  if (!storedString) return DEFAULT_ABILITIES;

  const parsedValue = JSON.parse(storedString);

  if (parsedValue.maximums) return convertLegacyStructure(parsedValue);

  return parsedValue;
};

// TODO: move this to a context so it can be shared between health & spell slots and prepared spells badges
export const useAbilities = () => {
  const defaultAbilities = getDefaultAbilities();
  const [hp, setHp] = useState(defaultAbilities.hp);
  const [tempHp, setTempHp] = useState(defaultAbilities.tempHp);
  const [spellSlots, setSpellSlots] = useState(defaultAbilities.spellSlots);
  const [abilities, setAbilities] = useState(defaultAbilities.abilities ?? []);
  const [characterClassMap, setCharacterClassMap] = useState(
    defaultAbilities.characterClassMap ?? {},
  );

  const uneditedCharacterStatusRef = useRef<CharacterStatus>({
    hp,
    tempHp,
    spellSlots,
    abilities,
    characterClassMap,
  });

  const stashCharacterStatus = useCallback(() => {
    uneditedCharacterStatusRef.current = {
      hp,
      tempHp,
      spellSlots,
      abilities,
      characterClassMap,
    };
  }, [hp, tempHp, spellSlots, abilities, characterClassMap]);

  const restoreCharacterStatus = useCallback(() => {
    setHp(uneditedCharacterStatusRef.current.hp);
    setTempHp(uneditedCharacterStatusRef.current.tempHp);
    setSpellSlots(uneditedCharacterStatusRef.current.spellSlots);
    setAbilities(uneditedCharacterStatusRef.current.abilities);
    setCharacterClassMap(uneditedCharacterStatusRef.current.characterClassMap);
  }, []);

  useEffect(() => {
    const characterStatus: CharacterStatus = {
      hp,
      tempHp,
      spellSlots,
      abilities,
      characterClassMap,
    };
    localStorage.setItem('character-status', JSON.stringify(characterStatus));
  }, [hp, tempHp, spellSlots, abilities, characterClassMap]);

  const makeUpdateSpellSlot = useCallback(
    <T extends keyof Ability>(key: T, index: number) =>
      (value: Ability[T]) => {
        setSpellSlots((prev) => {
          const newPrev = [...prev];
          newPrev[index] = { ...newPrev[index], [key]: value };

          return newPrev;
        });
      },
    [],
  );

  const makeUpdateAbility = useCallback(
    <T extends keyof Ability>(key: T, index: number) =>
      (value: Ability[T]) => {
        setAbilities((prev) => {
          const newPrev = [...prev];
          newPrev[index] = { ...newPrev[index], [key]: value };

          return newPrev;
        });
      },
    [],
  );

  const handleLongRest = useCallback(() => {
    setHp((prev) => ({ ...prev, current: getAbilityNumber(prev.maximum) }));
    setTempHp((prev) => ({ ...prev, current: 0 }));
    setSpellSlots((prev) =>
      prev.map((spellSlot) => ({
        ...spellSlot,
        current: getAbilityNumber(spellSlot.maximum),
      })),
    );
    setAbilities((prev) =>
      prev.map((ability) => ({
        ...ability,
        current: getAbilityNumber(ability.maximum),
      })),
    );
  }, []);

  return useMemo(
    () => ({
      hp,
      setHp,
      tempHp,
      setTempHp,
      spellSlots,
      abilities,
      setAbilities,
      characterClassMap,
      setCharacterClassMap,
      makeUpdateSpellSlot,
      makeUpdateAbility,
      handleLongRest,
      handleEdit: stashCharacterStatus,
      handleCancelEdit: restoreCharacterStatus,
    }),
    [
      hp,
      tempHp,
      spellSlots,
      abilities,
      characterClassMap,
      makeUpdateSpellSlot,
      makeUpdateAbility,
      handleLongRest,
      stashCharacterStatus,
      restoreCharacterStatus,
    ],
  );
};
