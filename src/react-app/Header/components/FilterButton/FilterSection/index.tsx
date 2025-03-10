import { Dispatch, SetStateAction } from 'react';
import { Checkbox } from '../../../../Checkbox';
import { Filters } from '../../../../FilterContext';
import styles from './index.module.css';

export const FilterSection = ({
  id,
  filters,
  setFilters,
}: {
  id: string;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) => {
  const name = id.replace(/_/g, ' ');

  return (
    <div className={styles.filterSection}>
      <h4>{name}</h4>
      {Object.keys(filters[id]).map((value) => (
        <Checkbox
          key={value}
          label={value.replace(/_/g, ' ').replace(/non /, 'non-')}
          id={`${id}-${value}`}
          checked={filters[id][value]}
          onChange={() =>
            setFilters((prev) => ({
              ...prev,
              [id]: { ...prev[id], [value]: !prev[id][value] },
            }))
          }
        />
      ))}
    </div>
  );
};
