import { ReactElement } from 'react';
import styles from './index.module.css';

export const NavButton = ({
  icon,
  label,
  className = '',
  onClick,
}: {
  icon: ReactElement;
  label: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button className={`${styles.navButton} ${className}`} onClick={onClick}>
      {icon}
      <span className={styles.buttonLabel}> {label}</span>
    </button>
  );
};
