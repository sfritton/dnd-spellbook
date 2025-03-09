import { NavButton } from '../NavButton';
import { IconSearch } from '../../../icons/IconSearch';
import { useSingleDialog } from '../../../Dialog';
import { useCallback } from 'react';
import { FilterDrawerContent } from './FilterDrawerContent';

export const FilterButton = () => {
  const { open: openFilterDrawer } = useSingleDialog();

  const handleClick = useCallback(() => {
    openFilterDrawer({
      title: 'Filter spells',
      isDrawer: true,
      children: <FilterDrawerContent />,
    });
  }, [open]);

  return (
    <NavButton
      // TODO: better icon
      icon={<IconSearch />}
      label="Filter spells"
      onClick={handleClick}
    />
  );
};
