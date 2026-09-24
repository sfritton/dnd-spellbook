import type { Ability, CharacterStatus } from '../AbilityContext/types';
import type { SpellSummaryData } from '../SpellListContext/types';
import { formatSpellLevel } from '../util';
import type { StoredCharactersItem } from './types';

const DEFAULT_CHARACTER_ID = 'FIRST_CHARACTER';

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

const getStoredSpellLists = (): SpellSummaryData[][] | undefined => {
  const storedString = localStorage.getItem('spell-lists');

  if (!storedString) return new Array(10).fill([]);

  return JSON.parse(storedString);
};

const getDefaultCharacters = (): StoredCharactersItem => ({
  characters: {
    [DEFAULT_CHARACTER_ID]: {
      name: undefined,
      id: DEFAULT_CHARACTER_ID,
      spellLists: getStoredSpellLists(),
      status: getDefaultAbilities(),
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
