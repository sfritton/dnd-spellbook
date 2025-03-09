import { useState } from 'react';
import { useFilterContext } from '../../../FilterContext';
import { FilterSection } from './FilterSection';

export const FilterDrawerContent = ({ closeFilterDrawer }: { closeFilterDrawer: () => void }) => {
  const { filters: filtersFromContext, setFilters: setContextFilters } = useFilterContext();
  const [filters, setFilters] = useState(filtersFromContext);

  return (
    <div>
      {Object.keys(filters).map((filterId) => (
        <FilterSection key={filterId} id={filterId} filters={filters} setFilters={setFilters} />
      ))}
      <button
        onClick={() => {
          setContextFilters(filters);
          closeFilterDrawer();
        }}
      >
        Apply filters
      </button>
    </div>
  );
};
