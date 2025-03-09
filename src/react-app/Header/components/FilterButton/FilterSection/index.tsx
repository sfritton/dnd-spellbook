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
  const isAllChecked = Object.keys(filters[id]).every((key) => filters[id][key]);
  const name = id.replace(/_/g, ' ');

  return (
    <div className={styles.filterSection}>
      <h4>{name}</h4>
      <Checkbox
        label="All"
        id={`${id}-all`}
        checked={isAllChecked}
        onChange={() =>
          setFilters((prev) => ({
            ...prev,
            [id]: Object.fromEntries(Object.keys(prev[id]).map((key) => [key, !isAllChecked])),
          }))
        }
      />
      <div className={styles.divider}></div>
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
