import { ReactElement, useEffect } from 'react';
import styles from './index.module.css';

export const NavButton = ({
  icon,
  label,
  className = '',
  onClick,
  forceSmall = false,
}: {
  icon: ReactElement;
  label: string;
  className?: string;
  onClick?: () => void;
  forceSmall?: boolean;
}) => {
  return (
    <button
      className={`${styles.navButton} ${forceSmall ? styles.forceSmall : ''} ${className}`}
      onClick={onClick}
    >
      {icon}
      <span className={styles.buttonLabel}> {label}</span>
    </button>
  );
};
