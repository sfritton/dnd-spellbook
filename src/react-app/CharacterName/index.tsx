import type { ElementType } from 'react';

import { useCharacterContext } from '../CharacterContext';
import styles from './index.module.css';

export const CharacterName = ({
  as: Component = 'span',
  id: idProp,
}: {
  as?: ElementType;
  id?: string;
}) => {
  const { currentCharacterId, characters } = useCharacterContext();
  const id = idProp ?? currentCharacterId;
  const { name } = characters[id] ?? {};
  const className = name ? undefined : String(styles.unnamed);

  return <Component className={className}>{name ?? 'Unnamed Character'}</Component>;
};
