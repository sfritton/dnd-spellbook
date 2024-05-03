import { IconSettings } from '../../../icons/IconSettings';
import style from './index.module.css';
import { NavButton } from '../NavButton';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { Checkbox } from '../../../Checkbox';

export const SettingsButton = () => {
  const { open, close } = useSingleDialog();

  const openSettingsDrawer = useCallback(() => {
    open({
      title: 'Settings',
      isDrawer: true,
      children: (
        <>
          {/* TODO: still need to implement these */}
          {/* <Checkbox label="Card mode" id="card-mode" />
          <Checkbox label="Hide known spells" id="hide-known-spells" /> */}
        </>
      ),
    });
  }, [open]);

  return <NavButton label="Settings" icon={<IconSettings />} onClick={openSettingsDrawer} />;
};
