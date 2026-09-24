import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { useCharacterContext } from '../CharacterContext';
import { formatSpellLevel, getStateValue, type StateFunctionParameter } from '../util';
import type { Ability, CharacterClassMap, CharacterStatus } from './types';
import { getAbilityNumber } from './util';

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

interface AbilityContextValue {
  hp: Ability;
  setHp: React.Dispatch<React.SetStateAction<Ability>>;
  tempHp: Ability;
  setTempHp: React.Dispatch<React.SetStateAction<Ability>>;
  spellSlots: Ability[];
  abilities: Ability[];
  setAbilities: React.Dispatch<React.SetStateAction<Ability[]>>;
  characterClassMap: CharacterClassMap;
  setCharacterClassMap: React.Dispatch<React.SetStateAction<CharacterClassMap>>;
  makeUpdateSpellSlot: <T extends keyof Ability>(
    key: T,
    index: number,
  ) => (value: Ability[T]) => void;
  makeUpdateAbility: <T extends keyof Ability>(
    key: T,
    index: number,
  ) => (value: Ability[T]) => void;
  handleLongRest: () => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
}

const AbilityContext = createContext<AbilityContextValue>({
  ...DEFAULT_ABILITIES,
  setHp: () => {},
  setTempHp: () => {},
  setAbilities: () => {},
  setCharacterClassMap: () => {},
  makeUpdateSpellSlot: () => () => {},
  makeUpdateAbility: () => () => {},
  handleLongRest: () => {},
  handleEdit: () => {},
  handleCancelEdit: () => {},
});

export const AbilityContextProvider = ({ children }: PropsWithChildren) => {
  const {
    currentCharacter: {
      status: { hp, tempHp, spellSlots, abilities, characterClassMap },
    },
    updateCurrentCharacter,
  } = useCharacterContext();

  const makeUpdateCharacterStatus = useCallback(
    <K extends keyof CharacterStatus>(key: K) =>
      (valueOrFn: StateFunctionParameter<CharacterStatus[K]>) =>
        updateCurrentCharacter((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            [key]: getStateValue(valueOrFn, prev.status[key]),
          },
        })),
    [updateCurrentCharacter],
  );

  const setSpellSlots = makeUpdateCharacterStatus('spellSlots');
  const setAbilities = makeUpdateCharacterStatus('abilities');
  const setHp = makeUpdateCharacterStatus('hp');
  const setTempHp = makeUpdateCharacterStatus('tempHp');
  const setCharacterClassMap = makeUpdateCharacterStatus('characterClassMap');

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
    updateCurrentCharacter((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        hp: uneditedCharacterStatusRef.current.hp,
        tempHp: uneditedCharacterStatusRef.current.tempHp,
        spellSlots: uneditedCharacterStatusRef.current.spellSlots,
        abilities: uneditedCharacterStatusRef.current.abilities,
        characterClassMap: uneditedCharacterStatusRef.current.characterClassMap,
      },
    }));
  }, [updateCurrentCharacter]);

  const makeUpdateSpellSlot = useCallback(
    <T extends keyof Ability>(key: T, index: number) =>
      (value: Ability[T]) => {
        setSpellSlots((prev) => {
          const newPrev = [...prev];
          newPrev[index] = { ...newPrev[index], [key]: value };

          return newPrev;
        });
      },
    [setSpellSlots],
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
    [setAbilities],
  );

  const handleLongRest = useCallback(() => {
    updateCurrentCharacter((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        hp: { ...prev.status.hp, current: getAbilityNumber(prev.status.hp.maximum) },
        tempHp: { ...prev.status.tempHp, current: 0 },
        spellSlots: prev.status.spellSlots.map((spellSlot) => ({
          ...spellSlot,
          current: getAbilityNumber(spellSlot.maximum),
        })),
        abilities: prev.status.abilities.map((ability) => ({
          ...ability,
          current: getAbilityNumber(ability.maximum),
        })),
      },
    }));
  }, [updateCurrentCharacter]);

  const value = useMemo(
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
      stashCharacterStatus,
      restoreCharacterStatus,
    ],
  );

  return <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>;
};

export const useAbilities = () => useContext(AbilityContext);
