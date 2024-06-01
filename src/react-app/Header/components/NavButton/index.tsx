import { ReactElement } from 'react';
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
      className={`${styles.navButton} ${isSmall ? styles.small : ''} ${className}`}
      onClick={onClick}
    >
      {icon}
      <span className={isSmall ? 'hidden' : styles.buttonLabel}> {label}</span>
    </button>
  );
};
