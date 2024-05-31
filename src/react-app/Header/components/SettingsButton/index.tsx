import { IconSettings } from '../../../icons/IconSettings';
import { NavButton } from '../NavButton';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { SettingsDrawerContent } from './SettingsDrawerContent';
import { useSpellListContext } from '../../../SpellListContext';
import styles from '../../index.module.css';

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
          <button className="secondary" onClick={handleYes}>
            Yes
          </button>
          <button onClick={closeClearDialog}>No</button>
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
  }, [open]);

  return <NavButton label="Settings" icon={<IconSettings />} onClick={handleClick} />;
};
