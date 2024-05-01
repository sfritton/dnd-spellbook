import { useCallback } from 'react';
import styles from './index.module.css';
import { useSingleDialog } from '../../../Dialog';
import { TypeaheadDrawerContent } from './TypeaheadDrawerContent';

export const TypeaheadButton = () => {
  const { open, close } = useSingleDialog();

  const openDialog = useCallback(() => {
    open({
      title: 'Add spells by name',
      isDrawer: true,
      className: styles.typeaheadDrawer,
      children: <TypeaheadDrawerContent close={close} />,
    });
  }, [open, close]);

  return <button onClick={openDialog}>Add by name</button>;
};
