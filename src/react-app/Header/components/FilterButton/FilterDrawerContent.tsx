import { useEffect, useState } from 'react';

import { useFilterContext } from '../../../FilterContext';
import { FilterSection } from './FilterSection';
import styles from './index.module.css';

export const FilterDrawerContent = ({ closeFilterDrawer }: { closeFilterDrawer: () => void }) => {
  const { filters: filtersFromContext, setFilters: setContextFilters } = useFilterContext();
  const [filters, setFilters] = useState(filtersFromContext);

  // Make sure these stay in sync
  useEffect(() => {
    setFilters(filtersFromContext);
  }, [filtersFromContext]);

  return (
    <>
      <div className={styles.content}>
        {Object.keys(filters)
          .filter((filterId) => filterId !== 'sources')
          .map((filterId) => (
            <FilterSection key={filterId} id={filterId} filters={filters} setFilters={setFilters} />
          ))}
        {/* Put sources last since it's unlikely to be used */}
        <FilterSection key="sources" id="sources" filters={filters} setFilters={setFilters} />
      </div>
      <footer>
        <button
          type="button"
          onClick={() => {
            setContextFilters(filters);
            closeFilterDrawer();
          }}
        >
          Apply filters
        </button>
      </footer>
    </>
  );
};
