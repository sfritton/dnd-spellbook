import { ChangeEvent, useCallback } from 'react';
import { Checkbox } from '../../../Checkbox';
import { Ability } from '../../types';
import styles from './index.module.css';

export const AbilityTracker = ({
  name,
  current,
  maximum,
  onChange,
  isRange = false,
}: Ability & { onChange: (value: number) => void; isRange?: boolean }) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);

      if (isNaN(newValue)) return;

      onChange(newValue);
    },
    [onChange],
  );

  const makeHandleCheckboxChange = useCallback(
    (index: number) => (isChecked: boolean) => {
      onChange(isChecked ? index : index - 1);
    },
    [onChange],
  );

  if (maximum > 5 || isRange) {
    return (
      <div className={styles.abilityRange}>
        <label htmlFor={`Ability - ${name}`}>{name}</label>
        <input
          id={`Ability - ${name}`}
          type="range"
          max={maximum}
          value={current}
          onChange={handleChange}
        />
        <span>
          {current}/{maximum}
        </span>
      </div>
    );
  }

  return (
    <fieldset className={styles.abilityCheckboxes}>
      <div>
        <legend>{name}</legend>
        {[...new Array(maximum)].map((_, index) => (
          <Checkbox
            key={index}
            hideLabel
            id={`${name} - ${index + 1} of ${maximum}`}
            label={`${name} - ${index + 1} of ${maximum}`}
            checked={current >= index}
            onChange={makeHandleCheckboxChange(index)}
          />
        ))}
      </div>
    </fieldset>
  );
};
