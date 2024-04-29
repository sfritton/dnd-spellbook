import { ReactElement } from 'react';
import styles from './index.module.css';

export const NavButton = ({
  icon,
  label,
  className = '',
}: {
  icon: ReactElement;
  label: string;
  className?: string;
}) => {
  return (
    <button className={`${styles.navButton} ${className}`}>
      {icon}
      <span className={styles.buttonLabel}> {label}</span>
    </button>
  );
};
