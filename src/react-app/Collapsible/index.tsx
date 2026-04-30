import type { PropsWithChildren, ReactNode } from 'react';

import { IconMore } from '../icons/IconMore';
import styles from './index.module.css';

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
