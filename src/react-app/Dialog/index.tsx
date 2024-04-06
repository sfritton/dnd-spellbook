import { PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import styles from './index.module.css';

interface DialogProps {
  title: string;
}

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  const Dialog = ({ title, children }: PropsWithChildren<DialogProps>) => (
    <dialog className={styles.backdrop} ref={dialogRef}>
      <div className={styles.dialog}>
        <header className="dialogHeader">
          <h3>{title}</h3>
          <button className="secondary" autoFocus aria-label="Close" onClick={close}>
            x
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );

  return useMemo(() => [Dialog, { open, close }] as const, [Dialog, open, close]);
};
