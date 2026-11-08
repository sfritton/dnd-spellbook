import { useCallback } from 'react';

import { useCharacterContext } from '../../../CharacterContext';
import { CharacterName } from '../../../CharacterName';
import { useSingleDialog } from '../../../Dialog';
import { IconSettings } from '../../../icons/IconSettings';
import styles from '../../index.module.css';
import { NavButton } from '../NavButton';
import { SettingsDrawerContent } from './SettingsDrawerContent';

export const SettingsButton = () => {
  const { deleteCurrentCharacter } = useCharacterContext();
  const { open: openSettingsDrawer } = useSingleDialog();
  const { open: openClearDialog, close: closeClearDialog } = useSingleDialog();

  const handleClickDeleteCharacter = useCallback(() => {
    const handleYes = () => {
      deleteCurrentCharacter();
      closeClearDialog();
    };
    openClearDialog({
      title: 'Delete this character?',
      className: styles.clearDialog,
      children: (
        <>
          <div>
            Are you sure you want to delete <CharacterName as="b" />?
          </div>
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
  }, [openClearDialog, closeClearDialog, deleteCurrentCharacter]);

  const handleClick = useCallback(() => {
    openSettingsDrawer({
      title: 'Settings',
      isDrawer: true,
      children: <SettingsDrawerContent onClickDeleteCharacter={handleClickDeleteCharacter} />,
    });
  }, [openSettingsDrawer, handleClickDeleteCharacter]);

  return <NavButton label="Settings" icon={<IconSettings />} onClick={handleClick} />;
};
