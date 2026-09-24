import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';

import { spellDetails } from '../../constants/spell-details';
import type { Spell } from '../../types';
import type { CharacterClassMap } from '../AbilityContext/types';
import { useCharacterContext } from '../CharacterContext';
import { getStateValue, type StateFunction } from '../util';
import { makeGetSpellCountByClass } from './make-get-spell-count-by-class';
import type { SpellSummaryData } from './types';

type MakeToggleSpell = ({
  id,
  level,
}: Pick<Spell.Summary, 'id' | 'level'>) => (isPrepared: boolean) => void;

interface SpellListContextValue {
  spellLists: SpellSummaryData[][];
  preparedSpells: SpellSummaryData[][];
  alwaysPreparedSpells: SpellSummaryData[][];
  appendSpells: (spells: Spell.Summary[]) => void;
  removeSpell: (spell: Spell.Summary) => void;
  makeToggleSpell: MakeToggleSpell;
  makeToggleSpellAlwaysPrepared: MakeToggleSpell;
  clearSpells: () => void;
  getSpellCountByClass: (characterClassMap: CharacterClassMap) => Partial<Record<string, number>>;
}

const SpellListContext = createContext<SpellListContextValue>({
  spellLists: new Array(10).fill([]),
  preparedSpells: [],
  alwaysPreparedSpells: [],
  appendSpells: () => {},
  removeSpell: () => {},
  makeToggleSpell: () => () => {},
  makeToggleSpellAlwaysPrepared: () => () => {},
  clearSpells: () => {},
  getSpellCountByClass: () => ({}),
});

export const SpellListContextProvider = ({ children }: PropsWithChildren) => {
  const {
    currentCharacter: { spellLists },
    updateCurrentCharacter,
  } = useCharacterContext();

  const setSpellLists = useCallback<StateFunction<SpellSummaryData[][]>>(
    (spellListsOrFn) =>
      updateCurrentCharacter((prev) => ({
        ...prev,
        spellLists: getStateValue(spellListsOrFn, prev.spellLists),
      })),
    [updateCurrentCharacter],
  );

  const appendSpells = useCallback(
    (spells: Spell.Summary[]) => {
      setSpellLists((prevSpells) =>
        prevSpells.map((leveledSpells, currentLevel) =>
          [
            ...leveledSpells,
            ...spells
              .filter(
                ({ id, level }) =>
                  level === currentLevel && leveledSpells.every((prevSpell) => prevSpell.id !== id),
              )
              .map((spell) => ({
                ...spell,
                isPrepared: false,
                isAlwaysPrepared: false,
              })),
          ].sort((spellA, spellB) => spellA.level - spellB.level),
        ),
      );
    },
    [setSpellLists],
  );

  const removeSpell = useCallback(
    (spell: Spell.Summary) => {
      setSpellLists((prevSpells) => {
        const newSpells = [...prevSpells];

        newSpells[spell.level] = newSpells[spell.level].filter(({ id }) => id !== spell.id);

        return newSpells;
      });
    },
    [setSpellLists],
  );

  const makeToggleSpell = useCallback<MakeToggleSpell>(
    ({ id, level }) =>
      (isPrepared) => {
        setSpellLists((prevSpellLists) => {
          const newSpellLists = prevSpellLists.map((spells) => [...spells]);

          const selectedIndex = newSpellLists[level].findIndex((spell) => spell.id === id);

          if (selectedIndex < 0) return prevSpellLists;

          const newSpell = {
            ...newSpellLists[level][selectedIndex],
            isPrepared,
          };
          newSpellLists[level][selectedIndex] = newSpell;

          return newSpellLists;
        });
      },
    [setSpellLists],
  );

  const makeToggleSpellAlwaysPrepared = useCallback<MakeToggleSpell>(
    ({ id, level }) =>
      (isAlwaysPrepared) => {
        setSpellLists((prevSpellLists) => {
          const newSpellLists = prevSpellLists.map((spells) => [...spells]);

          const selectedIndex = newSpellLists[level].findIndex((spell) => spell.id === id);

          if (selectedIndex < 0) return prevSpellLists;

          const newSpell = {
            ...newSpellLists[level][selectedIndex],
            isAlwaysPrepared,
            // A spell that gets "downgraded" from always prepared should move to prepared
            // For a spell that is being "upgraded" to always prepared, setting isPrepared won't matter
            isPrepared: true,
          };
          newSpellLists[level][selectedIndex] = newSpell;

          return newSpellLists;
        });
      },
    [setSpellLists],
  );

  const clearSpells = useCallback(() => {
    setSpellLists(new Array(10).fill([]));
  }, [setSpellLists]);

  const preparedSpells = useMemo(
    () =>
      spellLists.map((spells) =>
        spells.filter(({ isPrepared, isAlwaysPrepared }) => isPrepared || isAlwaysPrepared),
      ),
    [spellLists],
  );

  const alwaysPreparedSpells = useMemo(
    () => spellLists.map((spells) => spells.filter(({ isAlwaysPrepared }) => isAlwaysPrepared)),
    [spellLists],
  );

  const getSpellCountByClass = useCallback(
    (characterClassMap: CharacterClassMap) =>
      makeGetSpellCountByClass(
        preparedSpells.flatMap((spellList) =>
          spellList.flatMap(({ isAlwaysPrepared, id }) =>
            isAlwaysPrepared ? [] : [spellDetails[id]],
          ),
        ),
      )(characterClassMap),
    [preparedSpells],
  );

  const value = useMemo(
    () => ({
      spellLists,
      preparedSpells,
      alwaysPreparedSpells,
      appendSpells,
      removeSpell,
      makeToggleSpell,
      makeToggleSpellAlwaysPrepared,
      clearSpells,
      getSpellCountByClass,
    }),
    [
      spellLists,
      preparedSpells,
      alwaysPreparedSpells,
      appendSpells,
      removeSpell,
      makeToggleSpell,
      makeToggleSpellAlwaysPrepared,
      clearSpells,
      getSpellCountByClass,
    ],
  );

  return <SpellListContext.Provider value={value}>{children}</SpellListContext.Provider>;
};

export const useSpellListContext = () => useContext(SpellListContext);
