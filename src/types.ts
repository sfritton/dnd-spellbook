export namespace Spell {
  export interface Summary {
    title: string;
    url: string;
    level: number;
    id: string;
  }

  export interface Details {
    title: string;
    source: string;
    levelAndSchool: string;
    level: number;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    description: string[];
    spellLists: string[];
  }
}

export type ClassId =
  | 'artificer'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'eldritch-knight'
  | 'paladin'
  | 'ranger'
  | 'arcane-trickster'
  | 'sorcerer'
  | 'warlock'
  | 'wizard';
