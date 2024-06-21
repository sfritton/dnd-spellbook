import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ability } from './types';
import { formatSpellLevel } from '../util';
import { getAbilityNumber } from './util';

interface CharacterStatus {
  hp: Ability;
  tempHp: Ability;
  spellSlots: Ability[];
  abilities: Ability[];
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
};

const getDefaultAbilities = (): CharacterStatus => {
  const storedString = localStorage.getItem('character-status');

  if (!storedString) return DEFAULT_ABILITIES;

  return JSON.parse(storedString);
};

export const useAbilities = () => {
  const defaultAbilities = getDefaultAbilities();
  const [hp, setHp] = useState(defaultAbilities.hp);
  const [tempHp, setTempHp] = useState(defaultAbilities.tempHp);
  const [spellSlots, setSpellSlots] = useState(defaultAbilities.spellSlots);
  const [abilities, setAbilities] = useState(defaultAbilities.abilities);

  useEffect(() => {
    const characterStatus: CharacterStatus = { hp, tempHp, spellSlots, abilities };
    localStorage.setItem('character-status', JSON.stringify(characterStatus));
  }, [hp, tempHp, spellSlots, abilities]);

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
      prev.map((spellSlot) => ({ ...spellSlot, current: getAbilityNumber(spellSlot.maximum) })),
    );
    setAbilities((prev) =>
      prev.map((ability) => ({ ...ability, current: getAbilityNumber(ability.maximum) })),
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
      makeUpdateSpellSlot,
      makeUpdateAbility,
      handleLongRest,
    }),
    [
      hp,
      setHp,
      tempHp,
      setTempHp,
      spellSlots,
      abilities,
      setAbilities,
      makeUpdateSpellSlot,
      makeUpdateAbility,
      handleLongRest,
    ],
  );
};
