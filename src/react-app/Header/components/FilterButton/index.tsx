import { NavButton } from '../NavButton';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { FilterDrawerContent } from './FilterDrawerContent';
import { IconFilter } from '../../../icons/IconFilter';

export const FilterButton = () => {
  const { open: openFilterDrawer, close: closeFilterDrawer } = useSingleDialog();

  const handleClick = useCallback(() => {
    openFilterDrawer({
      title: 'Filter spells',
      isDrawer: true,
      children: <FilterDrawerContent closeFilterDrawer={closeFilterDrawer} />,
    });
  }, [openFilterDrawer, closeFilterDrawer]);

  return <NavButton icon={<IconFilter />} label="Filter spells" onClick={handleClick} />;
};
