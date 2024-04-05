import { PropsWithChildren, useCallback, useMemo, useRef } from 'react';

interface DialogProps {
  title: string;
}

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  const Dialog = ({ title, children }: PropsWithChildren<DialogProps>) => (
    <dialog ref={dialogRef}>
      <div className="dialogHeader">
        <h3>{title}</h3>
        <button onClick={close}>Close</button>
      </div>
      {children}
    </dialog>
  );

  return useMemo(() => [Dialog, { open, close }] as const, [Dialog, open, close]);
};
