import { useState } from 'react';
import { useFilterContext } from '../../../FilterContext';
import { FilterSection } from './FilterSection';

export const FilterDrawerContent = () => {
  const { filters: filtersFromContext, setFilters: setContextFilters } = useFilterContext();
  const [filters, setFilters] = useState(filtersFromContext);

  return (
    <div>
      {Object.keys(filters).map((filterId) => (
        <FilterSection key={filterId} id={filterId} filters={filters} setFilters={setFilters} />
      ))}
      {/* TODO: close drawer */}
      <button onClick={() => setContextFilters(filters)}>Apply filters</button>
    </div>
  );
};
