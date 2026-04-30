import { type MouseEventHandler, useCallback } from 'react';

import { useSingleDialog } from '../../Dialog';
import { IconCheckmark } from '../../icons/IconCheckmark';
import { IconCircle } from '../../icons/IconCircle';
import { IconDelete } from '../../icons/IconDelete';
import { IconDotsVertical } from '../../icons/IconDotsVertical';
import { IconStar } from '../../icons/IconStar';
import { useSpellListContext } from '../../SpellListContext';
import styles from './index.module.css';
import type { SpellSummaryButtonProps } from './types';
import { getStatus } from './utilities';

export const SpellSummaryButtonTrailing = (props: SpellSummaryButtonProps) => {
  const label = 'More options';
  const status = getStatus(props);
  const { open, close } = useSingleDialog();
  const { makeToggleSpell, makeToggleSpellAlwaysPrepared, removeSpell } = useSpellListContext();
  const { disabled } = props;

  const openOptionsDialog = useCallback<MouseEventHandler>(
    (e) => {
      const { isKnown, disabled, ...spell } = props;
      e.preventDefault();
      open({
        title: `Update Spell`,
        className: styles.dialog,
        children: (
          <div className={styles.dialogBody}>
            <h4>{spell.title}</h4>
            {status === 'always_prepared' ? null : (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  makeToggleSpellAlwaysPrepared(spell)(true);
                  close();
                }}
              >
                <IconStar />{' '}
                <span>
                  Mark as <b>Always Prepared</b>
                </span>
              </button>
            )}
            {status === 'prepared' ? null : (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  makeToggleSpell(spell)(true);
                  makeToggleSpellAlwaysPrepared(spell)(false);
                  close();
                }}
              >
                <IconCheckmark />
                <span>
                  Mark as <b>Prepared</b>
                </span>
              </button>
            )}
            {status === 'known' ? null : (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  makeToggleSpellAlwaysPrepared(spell)(false);
                  makeToggleSpell(spell)(false);
                  close();
                }}
              >
                <IconCircle /> Unprepare
              </button>
            )}
            <button
              type="button"
              className="secondary"
              onClick={() => {
                removeSpell(spell);
                close();
              }}
            >
              <IconDelete /> Forget
            </button>
          </div>
        ),
      });
    },
    [props, status, open, close, makeToggleSpell, makeToggleSpellAlwaysPrepared, removeSpell],
  );

  if (status === 'new') return null;

  return (
    <button
      type="button"
      aria-label={label}
      className={`${styles.spellStatusButton} secondary`}
      disabled={disabled}
      onClick={openOptionsDialog}
      title={label}
    >
      <IconDotsVertical />
    </button>
  );
};
