import type { Ability, CharacterStatus } from '../AbilityContext/types';
import type { SpellSummaryData } from '../SpellListContext/types';
import { formatSpellLevel } from '../util';
import type { Character, StoredCharactersItem } from './types';

const DEFAULT_CHARACTER_ID = crypto.randomUUID();

const getDefaultAbilities = (): CharacterStatus => ({
  hp: { name: 'HP', current: 0, maximum: 0 },
  tempHp: { name: 'temp HP', current: 0, maximum: 0 },
  spellSlots: [...new Array(9)].map((_, index) => ({
    name: formatSpellLevel(index + 1),
    current: 0,
    maximum: 0,
  })),
  abilities: [],
  characterClassMap: {},
});

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

const getStoredAbilities = (): CharacterStatus => {
  const storedString = localStorage.getItem('character-status');

  if (!storedString) return getDefaultAbilities();

  const parsedValue = JSON.parse(storedString);

  if (parsedValue.maximums) return convertLegacyStructure(parsedValue);

  return parsedValue;
};

const getDefaultSpellLists = (): SpellSummaryData[][] => new Array(10).fill([]);

const getStoredSpellLists = (): SpellSummaryData[][] => {
  const storedString = localStorage.getItem('spell-lists');

  if (!storedString) return getDefaultSpellLists();

  return JSON.parse(storedString);
};

const getDefaultCharacters = (): StoredCharactersItem => ({
  characters: {
    [DEFAULT_CHARACTER_ID]: {
      name: undefined,
      id: DEFAULT_CHARACTER_ID,
      spellLists: getStoredSpellLists(),
      status: getStoredAbilities(),
    },
  },
  currentCharacterId: DEFAULT_CHARACTER_ID,
});

export const getStoredCharacters = (): StoredCharactersItem => {
  const storedString = localStorage.getItem('characters');

  if (!storedString) return getDefaultCharacters();

  const parsedValue = JSON.parse(storedString);

  return parsedValue;
};

export const getNewCharacter = (): Character => ({
  name: undefined,
  id: crypto.randomUUID(),
  spellLists: getDefaultSpellLists(),
  status: getDefaultAbilities(),
});
