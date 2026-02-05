import { SpellSummaryButtonProps } from './types';

export const getStatus = ({
  isKnown = false,
  isPrepared = false,
  isAlwaysPrepared = false,
}: SpellSummaryButtonProps) => {
  if (isAlwaysPrepared) return 'always_prepared';
  if (isPrepared) return 'prepared';
  if (isKnown) return 'known';
  return 'new';
};
