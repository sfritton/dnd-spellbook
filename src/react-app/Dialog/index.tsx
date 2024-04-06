import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './index.module.css';

interface DialogProps {
  title: string;
}

const dialogObserver = new MutationObserver((mutations, observer) => {
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

// TODO: manage inert state via MutationObserver
export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogObserver.observe(dialogRef.current, { attributes: true });
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const Dialog = ({ title, children }: PropsWithChildren<DialogProps>) => (
    <dialog
      className={styles.backdrop}
      // @ts-expect-error -- TS doesn't recognize the inert prop
      inert="true"
      ref={dialogRef}
    >
      <div className={styles.dialog}>
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
