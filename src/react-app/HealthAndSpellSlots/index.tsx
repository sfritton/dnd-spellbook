import { useEffect, useRef, useState } from 'react';

import { IconClose } from '../icons/IconClose';
import { useSettingsContext } from '../SettingsContext';
import { AbilityTracker } from './components/AbilityTracker';
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
          aria-label={'Close'}
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
      <div className={styles.buttons}>
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
