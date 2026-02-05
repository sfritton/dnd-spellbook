import styles from './index.module.css';
import { IconDotsVertical } from '../../icons/IconDotsVertical';
import { SpellSummaryButtonProps } from './types';
import { getStatus } from './utilities';
import { useSingleDialog } from '../../Dialog';
import { useSpellListContext } from '../../SpellListContext';
import { MouseEventHandler, useCallback } from 'react';
import { IconDelete } from '../../icons/IconDelete';
import { IconCircle } from '../../icons/IconCircle';
import { IconCheckmark } from '../../icons/IconCheckmark';
import { IconStar } from '../../icons/IconStar';

export const SpellSummaryButtonTrailing = (props: SpellSummaryButtonProps) => {
  const label = 'More options';
  const status = getStatus(props);
  const { open, close } = useSingleDialog();
  const { makeToggleSpell, makeToggleSpellAlwaysPrepared, removeSpell } = useSpellListContext();
  const { isKnown, ...spell } = props;

  const openOptionsDialog = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      open({
        title: `Update Spell`,
        className: styles.dialog,
        children: (
          <div className={styles.dialogBody}>
            <h4>{spell.title}</h4>
            {status === 'always_prepared' ? null : (
              <button
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
    [spell, status, close, makeToggleSpell, makeToggleSpellAlwaysPrepared, removeSpell],
  );

  if (status === 'new') return null;

  return (
    <button
      aria-label={label}
      className={`${styles.spellStatusButton} secondary`}
      onClick={openOptionsDialog}
      title={label}
    >
      <IconDotsVertical />
    </button>
  );
};
