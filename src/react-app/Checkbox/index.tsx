import { ChangeEventHandler, useCallback } from 'react';
import style from './index.module.css';

interface CheckboxProps {
  className?: string;
  label: string;
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  hideLabel?: boolean;
}

export const Checkbox = ({
  className = '',
  label,
  id,
  checked,
  onChange,
  hideLabel = false,
}: CheckboxProps) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.checked);
    },
    [onChange],
  );
  return (
    <label htmlFor={id} className={`${style.checkboxWrapper} ${className}`}>
      <input id={id} type="checkbox" onChange={handleChange} checked={checked} />
      <div className={style.checkbox}></div>{' '}
      <span className={hideLabel ? 'hidden' : ''}>{label}</span>
    </label>
  );
};
