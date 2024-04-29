import { PropsWithChildren, ReactElement } from 'react';
import styles from './index.module.css';
import { NavButton } from '../NavButton';

export const NavDropdown = ({
  children,
  title,
  icon,
}: PropsWithChildren<{ title?: string; icon?: ReactElement }>) => {
  return (
    <div className={styles.dropdownWrapper}>
      <NavButton className={styles.dropdownTrigger} icon={icon} label={title} />
      <div className={styles.dropdown}>{children}</div>
    </div>
  );
};
