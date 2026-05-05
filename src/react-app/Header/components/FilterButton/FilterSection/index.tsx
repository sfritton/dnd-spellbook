import type { Dispatch, SetStateAction } from 'react';

import { CLASS_NAME_MAP } from '../../../../../constants/classes';
import { Checkbox } from '../../../../Checkbox';
import { Collapsible } from '../../../../Collapsible';
import type { Filters } from '../../../../FilterContext';
import styles from './index.module.css';

const getCheckboxLabel = (value: string) => {
  const className = CLASS_NAME_MAP[value];

  if (className) return className;

  return value.replace(/_/g, ' ').replace(/non /, 'non-');
};

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
            label={getCheckboxLabel(value)}
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
