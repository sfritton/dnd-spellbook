import { CLASS_NAME_MAP } from '../../../../constants/classes';
import type { ClassId } from '../../../../types';
import { IconDelete } from '../../../icons/IconDelete';
import { formatSpellLevel } from '../../../util';
import type { ClassMaximums } from '../../types';
import { getAbilityNumber, validateAbilityInput } from '../../util';
import styles from './index.module.css';

interface ClassMaximumFormProps extends ClassMaximums {
  onChangeMaxSpellLevel: (value: number | '') => void;
  onChangeMaxSpellsPrepared: (value: number | '') => void;
  onRemoveClass: (classId: ClassId) => void;
  isEditing: boolean;
  classId: ClassId;
}

export const ClassMaximumForm = ({
  maxSpellLevel: maxSpellLevelProp,
  maxSpellsPrepared,
  onChangeMaxSpellLevel,
  onChangeMaxSpellsPrepared,
  onRemoveClass,
  isEditing,
  classId,
}: ClassMaximumFormProps) => {
  const className = CLASS_NAME_MAP[classId];

  if (!isEditing) {
    const pluralizedSpell = maxSpellsPrepared === 1 ? 'spell' : 'spells';
    const maxSpellLevel = getAbilityNumber(maxSpellLevelProp);
    const spellLevelText = maxSpellLevel > 0 ? `(${formatSpellLevel(maxSpellLevel)} or lower)` : '';

    return (
      <li className={`${styles.classMaximumForm} ${styles.display}`}>
        {maxSpellsPrepared} {className} {pluralizedSpell}{' '}
        <span className={styles.spellLevelText}>{spellLevelText}</span>
      </li>
    );
  }

  return (
    <li className={styles.classMaximumForm}>
      <h4>{className}</h4>
      <div className={styles.form}>
        <label htmlFor={`${classId}-max-spells-prepared`}>Max Spells Prepared</label>
        <input
          id={`${classId}-max-spells-prepared`}
          type="number"
          value={maxSpellsPrepared}
          onChange={(e) => onChangeMaxSpellsPrepared(validateAbilityInput(e.target.value))}
        />
        <label htmlFor={`${classId}-max-spell-level`}>Max Spell Level</label>
        <input
          id={`${classId}-max-spell-level`}
          type="number"
          value={maxSpellLevelProp}
          onChange={(e) => onChangeMaxSpellLevel(validateAbilityInput(e.target.value))}
        />
        <button
          type="button"
          className="secondary"
          onClick={() => onRemoveClass(classId)}
          aria-label="Remove class"
          title="Remove class"
        >
          <IconDelete />
        </button>
      </div>
    </li>
  );
};
