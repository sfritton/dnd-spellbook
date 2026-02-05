import { IconCircle } from '../../icons/IconCircle';
import { IconStar } from '../../icons/IconStar';
import { IconCheckmark } from '../../icons/IconCheckmark';
import { IconAdd } from '../../icons/IconAdd';
import styles from './index.module.css';
import { useSpellListContext } from '../../SpellListContext';
import { useCallback } from 'react';
import { getStatus } from './utilities';
import { SpellSummaryButtonProps } from './types';

const getLabel = ({
  title,
  isKnown = false,
  isPrepared = false,
  isAlwaysPrepared = false,
}: SpellSummaryButtonProps) => {
  if (isAlwaysPrepared) return `Mark "${title}" as Prepared`;
  if (isPrepared) return `Unprepare "${title}"`;
  if (isKnown) return `Prepare "${title}"`;
  return `Learn "${title}"`;
};

export const SpellSummaryButtonLeading = (props: SpellSummaryButtonProps) => {
  const { makeToggleSpell, appendSpells } = useSpellListContext();
  const status = getStatus(props);
  const label = getLabel(props);
  const { isKnown, disabled, ...spell } = props;

  const handleClick = useCallback(() => {
    switch (status) {
      case 'prepared':
        return makeToggleSpell(spell)(false);
      case 'known':
        return makeToggleSpell(spell)(true);
      case 'new':
        return appendSpells([spell]);
    }
  }, [status, spell]);

  return (
    <button
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
