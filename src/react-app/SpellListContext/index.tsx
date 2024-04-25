import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Spell } from '../types';

type MakeToggleSpell = ({
  id,
  level,
}: Pick<Spell.Summary, 'id' | 'level'>) => (isPrepared: boolean) => void;

export interface SpellSummaryData extends Spell.Summary {
  isPrepared: boolean;
}

interface SpellListContextValue {
  spellLists: SpellSummaryData[][];
  appendSpells: (spells: Spell.Summary[]) => void;
  makeToggleSpell: MakeToggleSpell;
  preparedSpells: SpellSummaryData[];
}

const SpellListContext = createContext<SpellListContextValue>({
  spellLists: new Array(10).fill([]),
  preparedSpells: [],
  appendSpells: () => {},
  makeToggleSpell: () => () => {},
});

export const SpellListContextProvider = ({ children }: PropsWithChildren) => {
  const [spellLists, setSpellLists] = useState<SpellSummaryData[][]>(new Array(10).fill([]));
  const appendSpells = useCallback((spells: Spell.Summary[]) => {
    setSpellLists((prevSpells) =>
      prevSpells.map((leveledSpells, currentLevel) =>
        [
          ...leveledSpells,
          ...spells
            .filter(
              ({ id, level }) =>
                level === currentLevel && leveledSpells.every((prevSpell) => prevSpell.id !== id),
            )
            .map((spell) => ({ ...spell, isPrepared: false })),
        ].sort((spellA, spellB) => spellA.level - spellB.level),
      ),
    );
  }, []);

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
    [],
  );

  const preparedSpells = useMemo(
    () => spellLists.flatMap((spells) => spells.filter(({ isPrepared }) => isPrepared)),
    [spellLists],
  );

  const value = useMemo(
    () => ({ spellLists, appendSpells, makeToggleSpell, preparedSpells }),
    [spellLists, appendSpells, makeToggleSpell, preparedSpells],
  );

  return <SpellListContext.Provider value={value}>{children}</SpellListContext.Provider>;
};

export const useSpellListContext = () => useContext(SpellListContext);
