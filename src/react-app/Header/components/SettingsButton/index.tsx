import { IconSettings } from '../../../icons/IconSettings';
import { NavButton } from '../NavButton';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { SettingsDrawerContent } from './SettingsDrawerContent';

export const SettingsButton = () => {
  const { open } = useSingleDialog();

  const openSettingsDrawer = useCallback(() => {
    open({
      title: 'Settings',
      isDrawer: true,
      children: <SettingsDrawerContent />,
    });
  }, [open]);

  return <NavButton label="Settings" icon={<IconSettings />} onClick={openSettingsDrawer} />;
};
