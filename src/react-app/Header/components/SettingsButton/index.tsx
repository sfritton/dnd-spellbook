import { useCallback } from 'react';

import { useSingleDialog } from '../../../Dialog';
import { IconSettings } from '../../../icons/IconSettings';
import { useSpellListContext } from '../../../SpellListContext';
import styles from '../../index.module.css';
import { NavButton } from '../NavButton';
import { SettingsDrawerContent } from './SettingsDrawerContent';

export const SettingsButton = () => {
  const { clearSpells } = useSpellListContext();
  const { open: openSettingsDrawer } = useSingleDialog();
  const { open: openClearDialog, close: closeClearDialog } = useSingleDialog();

  const handleClickClearSpells = useCallback(() => {
    const handleYes = () => {
      clearSpells();
      closeClearDialog();
    };
    openClearDialog({
      title: 'Remove all spells?',
      className: styles.clearDialog,
      children: (
        <>
          <div>Are you sure you want to remove all spells from your spellbook? </div>
          <b>This cannot be undone.</b>
          <button type="button" className="secondary" onClick={handleYes}>
            Yes
          </button>
          <button type="button" onClick={closeClearDialog}>
            No
          </button>
        </>
      ),
    });
  }, [openClearDialog, closeClearDialog, clearSpells]);

  const handleClick = useCallback(() => {
    openSettingsDrawer({
      title: 'Settings',
      isDrawer: true,
      children: <SettingsDrawerContent onClickClearSpells={handleClickClearSpells} />,
    });
  }, [openSettingsDrawer, handleClickClearSpells]);

  return <NavButton label="Settings" icon={<IconSettings />} onClick={handleClick} />;
};
