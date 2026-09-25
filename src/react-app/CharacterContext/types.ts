import type { CharacterStatus } from '../AbilityContext/types';
import type { SpellSummaryData } from '../SpellListContext/types';

export interface Character {
  spellLists: SpellSummaryData[][];
  status: CharacterStatus;
  name: string | undefined;
  id: string;
}

export interface StoredCharactersItem {
  characters: Record<string, Character | undefined>;
  currentCharacterId: string;
}
