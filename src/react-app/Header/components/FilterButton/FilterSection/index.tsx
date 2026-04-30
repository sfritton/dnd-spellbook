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
        {/* @ts-expect-error -- Object.keys doesn't return the key type */}
        {Object.keys(filters[id]).map((value) => (
          <Checkbox
            key={value}
            label={value.replace(/_/g, ' ').replace(/non /, 'non-')}
            id={`${id}-${value}`}
            /* @ts-expect-error -- Object.keys doesn't return the key type */
            checked={filters[id][value]}
            onChange={() =>
              setFilters((prev) => ({
                ...prev,
                /* @ts-expect-error -- Object.keys doesn't return the key type */
                [id]: { ...prev[id], [value]: !prev[id][value] },
              }))
            }
          />
        ))}
      </Collapsible>
    </div>
  );
};
