import { NavButton } from '../NavButton';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { FilterDrawerContent } from './FilterDrawerContent';
import { IconFilter } from '../../../icons/IconFilter';

export const FilterButton = () => {
  const { open: openFilterDrawer } = useSingleDialog();

  const handleClick = useCallback(() => {
    openFilterDrawer({
      title: 'Filter spells',
      isDrawer: true,
      children: <FilterDrawerContent />,
    });
  }, [open]);

  return <NavButton icon={<IconFilter />} label="Filter spells" onClick={handleClick} />;
};
