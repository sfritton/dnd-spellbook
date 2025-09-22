import { DEFAULT_FILTERS, useFilterContext } from '../FilterContext';
import { IconClose } from '../icons/IconClose';
import styles from './index.module.css';

export const FilterSummary = () => {
  const { filters, setFilters } = useFilterContext();

  const areAllFiltersFalsey = Object.values(filters).every((filter) =>
    Object.values(filter).every((value) => !value),
  );

  if (areAllFiltersFalsey) return null;

  const filterButtons = Object.entries(filters)
    // Sources aren't likely to be modified often, and take up a lot of space
    .filter(([key]) => key !== 'sources')
    .flatMap(([filterName, values]) =>
      Object.entries(values).map(([id, value]) =>
        value ? (
          <button
            onClick={() =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                [filterName]: {
                  ...prevFilters[filterName],
                  [id]: false,
                },
              }))
            }
            className="secondary"
            key={id}
          >
            {id.replace(/_/g, ' ').replace(/non /g, 'non-')}
            <IconClose />
          </button>
        ) : null,
      ),
    );

  return (
    <div className={styles.filterSummary}>
      <h2 className="hidden">Active Filters:</h2>
      {filterButtons}
      {filterButtons.filter((button) => Boolean(button)).length > 1 ? (
        <button onClick={() => setFilters(DEFAULT_FILTERS)} className="secondary">
          Clear all
        </button>
      ) : null}
    </div>
  );
};
