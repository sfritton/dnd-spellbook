import type { SpellSummaryData } from '../../SpellListContext/types';

export interface SpellSummaryButtonProps extends SpellSummaryData {
  isKnown?: boolean;
  disabled?: boolean;
}
