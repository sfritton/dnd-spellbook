import type { Dispatch, SetStateAction } from 'react';

import { Checkbox } from '../../../../Checkbox';
import { Collapsible } from '../../../../Collapsible';
import type { Filters } from '../../../../FilterContext';
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
      <Collapsible title={<h4>{name}</h4>} defaultIsOpen={name !== 'sources'}>
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
      </Collapsible>
    </div>
  );
};
