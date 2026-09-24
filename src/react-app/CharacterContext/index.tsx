import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getStateValue, type StateFunction } from '../util';
import { getStoredCharacters } from './storage';
import type { Character, StoredCharactersItem } from './types';

interface CharacterContextValue extends StoredCharactersItem {
  currentCharacter: Character | undefined;
  updateCurrentCharacter: StateFunction<Character>;
  setCurrentCharacterId: (id: string) => void;
}

const DEFAULT_CHARACTERS: StoredCharactersItem = {
  characters: {},
  currentCharacterId: '',
};

const CharacterContext = createContext<CharacterContextValue>({
  ...DEFAULT_CHARACTERS,
  currentCharacter: undefined,
  updateCurrentCharacter: () => {},
  setCurrentCharacterId: () => {},
});

// TODO: load from local storage and add fallbacks for legacy data
export const CharacterContextProvider = ({ children }: PropsWithChildren) => {
  const storedCharacters = getStoredCharacters();
  const [characters, setCharacters] = useState(storedCharacters.characters);
  const [currentCharacterId, setCurrentCharacterId] = useState(storedCharacters.currentCharacterId);

  useEffect(() => {
    const charactersToStore: StoredCharactersItem = {
      characters,
      currentCharacterId,
    };
    localStorage.setItem('characters', JSON.stringify(charactersToStore));
  }, [characters, currentCharacterId]);

  const updateCurrentCharacter = useCallback<StateFunction<Character>>(
    (characterOrFn) =>
      setCharacters((prev) => ({
        ...prev,
        [currentCharacterId]: getStateValue(characterOrFn, prev[currentCharacterId]),
      })),
    [currentCharacterId],
  );

  const value = useMemo(
    () => ({
      characters,
      currentCharacterId,
      currentCharacter: characters[currentCharacterId],
      updateCurrentCharacter,
      setCurrentCharacterId,
    }),
    [characters, currentCharacterId, updateCurrentCharacter],
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacterContext = () => useContext(CharacterContext);
