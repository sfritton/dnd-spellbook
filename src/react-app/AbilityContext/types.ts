import type { Dispatch, SetStateAction } from 'react';

import type { ClassId } from '../../types';

export interface Ability {
  name: string;
  maximum: '' | number;
  current: number;
}

export interface ClassMaximums {
  maxSpellLevel: '' | number;
  maxSpellsPrepared: '' | number;
}

export type CharacterClassMap = { [Key in ClassId]?: ClassMaximums };
export type SetCharacterClassAttributes = Dispatch<SetStateAction<CharacterClassMap>>;

export interface CharacterStatus {
  hp: Ability;
  tempHp: Ability;
  spellSlots: Ability[];
  abilities: Ability[];
  characterClassMap: CharacterClassMap;
}
