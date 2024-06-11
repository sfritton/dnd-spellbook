import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  preparedSpells: SpellSummaryData[][];
  appendSpells: (spells: Spell.Summary[]) => void;
  removeSpell: (spell: Spell.Summary) => void;
  makeToggleSpell: MakeToggleSpell;
  clearSpells: () => void;
}

const SpellListContext = createContext<SpellListContextValue>({
  spellLists: new Array(10).fill([]),
  preparedSpells: [],
  appendSpells: () => {},
  removeSpell: () => {},
  makeToggleSpell: () => () => {},
  clearSpells: () => {},
});

const getStoredSpellLists = (): SpellSummaryData[][] | undefined => {
  const storedString = localStorage.getItem('spell-lists');

  if (!storedString) return undefined;

  return JSON.parse(storedString);
};

export const SpellListContextProvider = ({ children }: PropsWithChildren) => {
  const storedSpellLists = getStoredSpellLists();
  const [spellLists, setSpellLists] = useState<SpellSummaryData[][]>(
    storedSpellLists ?? new Array(10).fill([]),
  );
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

  const removeSpell = useCallback((spell: Spell.Summary) => {
    setSpellLists((prevSpells) => {
      const newSpells = [...prevSpells];

      newSpells[spell.level] = newSpells[spell.level].filter(({ id }) => id !== spell.id);

      return newSpells;
    });
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

  const clearSpells = useCallback(() => {
    setSpellLists(new Array(10).fill([]));
  }, []);

  const preparedSpells = useMemo(
    () => spellLists.map((spells) => spells.filter(({ isPrepared }) => isPrepared)),
    [spellLists],
  );

  const value = useMemo(
    () => ({ spellLists, appendSpells, removeSpell, makeToggleSpell, preparedSpells, clearSpells }),
    [spellLists, appendSpells, removeSpell, makeToggleSpell, preparedSpells, clearSpells],
  );

  useEffect(() => {
    localStorage.setItem('spell-lists', JSON.stringify(spellLists));
  }, [spellLists]);

  return <SpellListContext.Provider value={value}>{children}</SpellListContext.Provider>;
};

export const useSpellListContext = () => useContext(SpellListContext);
