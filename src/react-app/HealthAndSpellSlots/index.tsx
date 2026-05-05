import { useEffect, useMemo, useRef, useState } from 'react';

import { CLASS_NAME_MAP } from '../../constants/classes';
import type { ClassId } from '../../types';
import { IconClose } from '../icons/IconClose';
import { useSettingsContext } from '../SettingsContext';
import { AbilityTracker } from './components/AbilityTracker';
import { ClassMaximumForm } from './components/ClassMaximumForm';
import styles from './index.module.css';
import { useAbilities } from './use-abilities';
import { getAbilityNumber } from './util';

export const HealthAndSpellSlots = () => {
  const { isCharacterOpen, setIsCharacterOpen } = useSettingsContext();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    hp,
    setHp,
    tempHp,
    setTempHp,
    spellSlots,
    abilities,
    setAbilities,
    characterClassMap,
    setCharacterClassMap,
    makeUpdateSpellSlot,
    makeUpdateAbility,
    handleLongRest,
    handleEdit,
    handleCancelEdit,
  } = useAbilities();

  useEffect(() => {
    if (isCharacterOpen) headingRef.current?.focus();
  }, [isCharacterOpen]);

  // If max HP is 0, we want to default to edit mode
  const [isEditing, setIsEditing] = useState(getAbilityNumber(hp.maximum) === 0);

  const characterClasses = useMemo(
    () => Object.entries(characterClassMap).filter(([_, value]) => Boolean(value)),
    [characterClassMap],
  );

  if (!isCharacterOpen) return null;

  return (
    <div className={`parchment overlay ${styles.healthAndSpellSlots}`}>
      <div className={styles.header}>
        <h2 tabIndex={-1} ref={headingRef}>
          Character Status
        </h2>
        <button
          type="button"
          className="secondary"
          onClick={() => setIsCharacterOpen(false)}
          aria-label="Close"
        >
          <IconClose />
        </button>
      </div>
      <div className={styles.content}>
        <h3>Health</h3>
        {isEditing ? null : (
          <AbilityTracker
            {...tempHp}
            isEditing={isEditing}
            isNameSuffix
            isRange
            hideMaximum
            onChangeCurrent={(newCurrent) =>
              setTempHp((prev) => ({ ...prev, current: newCurrent }))
            }
          />
        )}
        <AbilityTracker
          {...hp}
          name={isEditing ? 'Maximum HP' : hp.name}
          isEditing={isEditing}
          isNameSuffix
          isRange
          onChangeCurrent={(newCurrent) =>
            setHp((prev) => ({
              ...prev,
              current: newCurrent,
            }))
          }
          onChangeMaximum={(newMaximum) => {
            setHp((prev) => ({ ...prev, maximum: newMaximum }));
            setTempHp((prev) => ({ ...prev, maximum: newMaximum }));
          }}
        />
        {isEditing || characterClasses.length > 0 ? <h3>Maximum Prepared Spells</h3> : null}
        <ul className={styles.characterClasses}>
          {characterClasses.map(([classId, { maxSpellLevel, maxSpellsPrepared } = {}]) => (
            <ClassMaximumForm
              classId={classId as ClassId}
              isEditing={isEditing}
              key={classId}
              maxSpellLevel={maxSpellLevel}
              maxSpellsPrepared={maxSpellsPrepared}
              onChangeMaxSpellLevel={(newSpellLevel: number | '') => {
                setCharacterClassMap((prev) => ({
                  ...prev,
                  [classId]: {
                    ...prev[classId],
                    maxSpellLevel: newSpellLevel,
                  },
                }));
              }}
              onChangeMaxSpellsPrepared={(newSpellsPrepared: number | '') => {
                setCharacterClassMap((prev) => ({
                  ...prev,
                  [classId]: {
                    ...prev[classId],
                    maxSpellsPrepared: newSpellsPrepared,
                  },
                }));
              }}
              onRemoveClass={() =>
                setCharacterClassMap((prev) => ({
                  ...prev,
                  [classId]: undefined,
                }))
              }
            />
          ))}
        </ul>
        {isEditing ? (
          <>
            <label className={styles.newClassSelectLabel} htmlFor="new-class-select">
              Add a class
            </label>
            <select
              id="new-class-select"
              onChange={(e) => {
                const classId = e.target.value;
                const className = CLASS_NAME_MAP[classId];

                // Do nothing if they select the null option
                if (!className) return;

                setCharacterClassMap((prev) => ({
                  ...prev,
                  [e.target.value]: {
                    maxSpellLevel: 0,
                    maxSpellsPrepared: 0,
                  },
                }));
              }}
            >
              <option value="">--</option>
              {Object.entries(CLASS_NAME_MAP)
                // Only include classes that the character does not already have
                .filter(([id]) => !characterClassMap[id])
                .map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </>
        ) : null}
        {isEditing || spellSlots.some(({ maximum }) => getAbilityNumber(maximum) > 0) ? (
          <h3>Spell Slots</h3>
        ) : null}
        {spellSlots.map(({ name, current, maximum }, index) => (
          <AbilityTracker
            // biome-ignore lint/suspicious/noArrayIndexKey: There's nothing else guaranteed to be unique
            key={index}
            name={name}
            current={current}
            maximum={maximum}
            isEditing={isEditing}
            onChangeCurrent={makeUpdateSpellSlot('current', index)}
            onChangeMaximum={makeUpdateSpellSlot('maximum', index)}
          />
        ))}
        {isEditing || abilities.filter(({ name, maximum }) => name.length && maximum).length ? (
          <h3>Abilities</h3>
        ) : null}
        {abilities.map(({ name, current, maximum }, index) => (
          <AbilityTracker
            // biome-ignore lint/suspicious/noArrayIndexKey: There's nothing else guaranteed to be unique
            key={index}
            isRange
            name={name}
            current={current}
            maximum={maximum}
            isEditing={isEditing}
            onChangeCurrent={makeUpdateAbility('current', index)}
            onChangeMaximum={makeUpdateAbility('maximum', index)}
            onChangeName={makeUpdateAbility('name', index)}
          />
        ))}
        {isEditing ? (
          // biome-ignore lint/a11y/useValidAnchor: TODO: I don't want to deal with this right now
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAbilities((prev) => [...prev, { name: '', current: 0, maximum: 0 } as const]);
            }}
          >
            Add ability
          </a>
        ) : null}
      </div>
      <div className={styles.footer}>
        {isEditing ? (
          <>
            <button type="button" onClick={() => setIsEditing(false)}>
              Save
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                handleCancelEdit();
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleLongRest}>
              Long rest
            </button>
            <button
              type="button"
              onClick={() => {
                handleEdit();
                setIsEditing(true);
              }}
              className="secondary"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};
