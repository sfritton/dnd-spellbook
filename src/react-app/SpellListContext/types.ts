import type { Spell } from '../../types';

export interface SpellSummaryData extends Spell.Summary {
  isPrepared: boolean;
  isAlwaysPrepared: boolean;
}
