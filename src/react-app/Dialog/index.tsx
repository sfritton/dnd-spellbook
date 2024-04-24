import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './index.module.css';

interface DialogProps {
  title: string;
  className?: string;
}

const dialogObserver = new MutationObserver((mutations) => {
  mutations.forEach(async (mutation) => {
    if (mutation.attributeName === 'open') {
      const dialog = mutation.target as HTMLDialogElement;
      const isOpen = dialog.hasAttribute('open');

      if (isOpen) {
        dialog.removeAttribute('inert');
      } else {
        dialog.setAttribute('inert', 'true');
      }
    }
  });
});

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogObserver.observe(dialogRef.current, { attributes: true });
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
    dialogRef.current?.removeAttribute('inert');
  }, []);
  const close = useCallback(() => {
    dialogRef.current?.close();
    dialogRef.current?.setAttribute('inert', 'true');
  }, []);

  const Dialog = ({ title, children, className }: PropsWithChildren<DialogProps>) => (
    <dialog
      className={styles.backdrop}
      // @ts-expect-error -- TS doesn't recognize the inert prop
      inert="true"
      ref={dialogRef}
    >
      <div className={`${styles.dialog} ${className} parchment overlay`}>
        <header className="dialogHeader">
          <h3>{title}</h3>
          <button className="secondary" autoFocus aria-label="Close" onClick={close}>
            <span aria-hidden="true">+</span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );

  return useMemo(() => [Dialog, { open, close }] as const, [Dialog, open, close]);
};
