import { type ChangeEventHandler, useCallback } from 'react';

import { useCharacterContext } from '../CharacterContext';
import styles from './index.module.css';

export const CharacterNameInput = ({ id }: { id: string }) => {
  const { currentCharacter: { name } = {}, updateCurrentCharacter } = useCharacterContext();

  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      updateCurrentCharacter((prev) => ({
        ...prev,
        name: e.target.value,
      }));
    },
    [updateCurrentCharacter],
  );

  return (
    <div className={styles.nameInput}>
      <label className="hidden" htmlFor={id}>
        Character Name
      </label>
      {/* TODO: a placeholder of generated names could be cool */}
      <input id={id} type="text" value={name ?? ''} onChange={handleChangeName} />
    </div>
  );
};
