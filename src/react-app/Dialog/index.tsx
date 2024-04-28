import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './index.module.css';

// TODO: this whole file is a mess, let's find a better way to combine react + dialog + animations
interface DialogProps {
  title: string;
  className?: string;
  onClose?: () => void;
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

  const Dialog = useCallback(
    ({ title, children, className, onClose }: PropsWithChildren<DialogProps>) => {
      return (
        <dialog
          className={styles.backdrop}
          // @ts-expect-error -- TS doesn't recognize the inert prop
          inert="true"
          ref={dialogRef}
        >
          <div className={`${styles.dialog} ${className} parchment overlay`}>
            <header className="dialogHeader">
              <h3>{title}</h3>
              <button className="secondary" autoFocus aria-label="Close" onClick={onClose ?? close}>
                <span aria-hidden="true">+</span>
              </button>
            </header>
            {children}
          </div>
        </dialog>
      );
    },
    [close],
  );

  return useMemo(() => [Dialog, { open, close }] as const, [Dialog, open, close]);
};

type DialogPropsWithChildren = PropsWithChildren<DialogProps>;

interface DialogContextValue {
  open: (options: DialogPropsWithChildren) => void;
  close: () => void;
}

const DialogContext = createContext<DialogContextValue>({
  open: () => {},
  close: () => {},
});

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [Dialog, { open: openDialog, close: closeDialog }] = useDialog();
  const [dialogProps, setDialogProps] = useState<DialogPropsWithChildren & { isOpen: boolean }>({
    title: '',
    isOpen: false,
  });
  const open = useCallback((options: DialogPropsWithChildren) => {
    setDialogProps({ ...options, isOpen: true });
  }, []);

  const close = useCallback(() => {
    setDialogProps((prevProps) => ({ ...prevProps, isOpen: false }));
  }, []);

  useEffect(() => {
    console.log('dialogProps.isOpen', dialogProps.isOpen);
    if (dialogProps.isOpen) openDialog();
    else closeDialog();
  }, [dialogProps.isOpen]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog {...dialogProps} onClose={close} />
    </DialogContext.Provider>
  );
};

export const useSingleDialog = () => useContext(DialogContext);
