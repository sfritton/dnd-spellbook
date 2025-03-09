import { FilterSection } from './FilterSection';
import { FILTERS } from './constants';

export const FilterDrawerContent = () => {
  return (
    <div>
      {FILTERS.map((filter) => (
        <FilterSection key={filter.name} {...filter} />
      ))}
      <button>Apply filters</button>
    </div>
  );
};
