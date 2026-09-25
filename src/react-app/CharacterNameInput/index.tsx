import { type ChangeEventHandler, useCallback, useMemo } from 'react';

import { useCharacterContext } from '../CharacterContext';
import styles from './index.module.css';
import { getRandomName } from './util';

export const CharacterNameInput = ({ id }: { id: string }) => {
  const { currentCharacter: { name } = {}, updateCurrentCharacter } = useCharacterContext();

  const placeholder = useMemo(() => getRandomName(), []);

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
      <input
        placeholder={placeholder}
        id={id}
        type="text"
        value={name ?? ''}
        onChange={handleChangeName}
      />
    </div>
  );
};
