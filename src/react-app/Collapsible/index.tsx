import { PropsWithChildren, ReactNode } from 'react';

import styles from './index.module.css';
import { IconMore } from '../icons/IconMore';

export const Collapsible = ({
  children,
  title,
  defaultIsOpen = true,
}: PropsWithChildren<{ title: ReactNode; defaultIsOpen?: boolean }>) => {
  return (
    <>
      <details open={defaultIsOpen} className={styles.collapsible}>
        <summary>
          {title}
          <IconMore className={styles.icon} />
        </summary>
      </details>
      <div className={styles.content}>
        <div>{children}</div>
      </div>
    </>
  );
};
