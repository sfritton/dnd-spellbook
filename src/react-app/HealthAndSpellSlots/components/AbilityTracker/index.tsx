import { type ChangeEvent, useCallback } from 'react';

import { Checkbox } from '../../../Checkbox';
import type { Ability } from '../../types';
import { getAbilityNumber, validateAbilityInput } from '../../util';
import styles from './index.module.css';

interface AbilityTrackerProps extends Ability {
  onChangeCurrent: (value: number) => void;
  onChangeMaximum?: (value: number | '') => void;
  onChangeName?: (value: string) => void;
  isRange?: boolean;
  isEditing: boolean;
  isNameSuffix?: boolean;
  hideMaximum?: boolean;
}

export const AbilityTracker = ({
  name,
  current,
  maximum,
  onChangeCurrent,
  onChangeMaximum,
  onChangeName,
  isRange = false,
  isNameSuffix = false,
  hideMaximum = false,
  isEditing,
}: AbilityTrackerProps) => {
  const handleChangeCurrent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = validateAbilityInput(e.target.value);

      onChangeCurrent(getAbilityNumber(newValue));
    },
    [onChangeCurrent],
  );

  const makeHandleCheckboxChange = useCallback(
    (index: number) => (isChecked: boolean) => {
      onChangeCurrent(isChecked ? index : index - 1);
    },
    [onChangeCurrent],
  );

  const isNameEditable = Boolean(onChangeName);

  if (isEditing && !isNameEditable)
    return (
      <div className={styles.lockedName}>
        <label htmlFor={name}>{name}</label>
        <input
          id={name}
          type="number"
          value={maximum}
          onChange={(e) => onChangeMaximum?.(validateAbilityInput(e.target.value))}
        />
      </div>
    );

  if (isEditing)
    return (
      <div className={styles.editAbility}>
        {/** biome-ignore lint/a11y/noLabelWithoutControl: TODO: fix */}
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => onChangeName?.(e.target.value)} />
        {/** biome-ignore lint/a11y/noLabelWithoutControl: TODO: fix */}
        <label>Maximum</label>
        <input
          type="number"
          value={maximum}
          onChange={(e) => onChangeMaximum?.(validateAbilityInput(e.target.value))}
        />
      </div>
    );

  if (!name.length || getAbilityNumber(maximum) < 1) return;

  if (getAbilityNumber(maximum) > 5 || isRange) {
    return (
      <div className={styles.abilityRange}>
        <label className={isNameSuffix ? 'hidden' : undefined} htmlFor={`Ability - ${name}`}>
          {name}
        </label>
        <input
          id={`Ability - ${name}`}
          type="range"
          max={getAbilityNumber(maximum)}
          value={current}
          onChange={handleChangeCurrent}
        />
        <span>
          {current}
          {hideMaximum ? '' : `/${getAbilityNumber(maximum)}`}
          {isNameSuffix ? ` ${name}` : ''}
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
            // biome-ignore lint/suspicious/noArrayIndexKey: Index is the best we have here
            key={index}
            hideLabel
            id={`${name} - ${index + 1} of ${maximum}`}
            label={`${name} - ${index + 1} of ${maximum}`}
            checked={current > index}
            onChange={makeHandleCheckboxChange(index + 1)}
          />
        ))}
      </div>
    </fieldset>
  );
};
