import { useCallback } from 'react';

import { useSingleDialog } from '../../../Dialog';
import { IconFilter } from '../../../icons/IconFilter';
import { NavButton } from '../NavButton';
import { FilterDrawerContent } from './FilterDrawerContent';
import styles from './index.module.css';

export const FilterButton = () => {
  const { open: openFilterDrawer, close: closeFilterDrawer } = useSingleDialog();

  const handleClick = useCallback(() => {
    openFilterDrawer({
      title: 'Filter spells',
      isDrawer: true,
      children: <FilterDrawerContent closeFilterDrawer={closeFilterDrawer} />,
      className: styles.filterDrawer,
    });
  }, [openFilterDrawer, closeFilterDrawer]);

  return <NavButton icon={<IconFilter />} label="Filter spells" onClick={handleClick} />;
};
