import { useCallback } from 'react';

import { IconAdd } from '../../icons/IconAdd';
import { IconCheckmark } from '../../icons/IconCheckmark';
import { IconCircle } from '../../icons/IconCircle';
import { IconStar } from '../../icons/IconStar';
import { useSpellListContext } from '../../SpellListContext';
import styles from './index.module.css';
import type { SpellSummaryButtonProps } from './types';
import { getStatus } from './utilities';

const getLabel = ({
  title,
  isKnown = false,
  isPrepared = false,
  isAlwaysPrepared = false,
}: SpellSummaryButtonProps) => {
  if (isAlwaysPrepared) return `"${title}" is Always Prepared`;
  if (isPrepared) return `Unprepare "${title}"`;
  if (isKnown) return `Prepare "${title}"`;
  return `Learn "${title}"`;
};

export const SpellSummaryButtonLeading = (props: SpellSummaryButtonProps) => {
  const { makeToggleSpell, appendSpells } = useSpellListContext();
  const status = getStatus(props);
  const label = getLabel(props);
  const { disabled } = props;

  const handleClick = useCallback(() => {
    const { isKnown, disabled, ...spell } = props;
    switch (status) {
      case 'prepared':
        return makeToggleSpell(spell)(false);
      case 'known':
        return makeToggleSpell(spell)(true);
      case 'new':
        return appendSpells([spell]);
    }
  }, [status, props, appendSpells, makeToggleSpell]);

  return (
    <button
      type="button"
      aria-label={label}
      className={`${styles.spellStatusButton} ${styles.leading} ${styles[status]} secondary`}
      disabled={disabled || status === 'always_prepared'}
      onClick={handleClick}
      title={label}
    >
      <IconStar className={styles.iconAlwaysPrepared} />
      <IconCheckmark className={styles.iconPrepared} />
      <IconCircle className={styles.iconKnown} />
      <IconAdd className={styles.iconNew} />
    </button>
  );
};
