import type { ReactElement } from 'react';

import { classNames } from '../../../util';
import styles from './index.module.css';

export const NavButton = ({
  icon,
  label,
  className = '',
  onClick,
  isSmall = false,
}: {
  icon: ReactElement;
  label: string;
  className?: string;
  onClick?: () => void;
  isSmall?: boolean;
}) => {
  return (
    <button
      type="button"
      className={classNames(styles.navButton, className, { [styles.small]: isSmall })}
      onClick={onClick}
    >
      {icon}
      <span className={isSmall ? 'hidden' : styles.buttonLabel}> {label}</span>
    </button>
  );
};
