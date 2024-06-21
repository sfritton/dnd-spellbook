import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { IconClose } from '../icons/IconClose';
import { useSettingsContext } from '../SettingsContext';
import { Ability } from './types';
import { AbilityTracker } from './components/AbilityTracker';
import { getAbilityNumber, validateAbilityInput } from './util';
import { useAbilities } from './use-abilities';

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
  } = useAbilities();

  useEffect(() => {
    if (isCharacterOpen) headingRef.current?.focus();
  }, [isCharacterOpen]);

  // If max HP is 0, we want to default to edit mode
  const [isEditing, setIsEditing] = useState(getAbilityNumber(hp.maximum) === 0);

  // const storedMaximums = useRef<typeof maximums>(maximums);

  if (!isCharacterOpen) return null;

  return (
    <div className={`parchment overlay ${styles.healthAndSpellSlots}`}>
      <div className={styles.header}>
        <h2 tabIndex={-1} ref={headingRef}>
          Character Status
        </h2>
        <button
          className="secondary"
          onClick={() => setIsCharacterOpen(false)}
          aria-label={'Close'}
        >
          <IconClose />
        </button>
      </div>
      <div className={styles.content}>
        <h3>HP</h3>
        {isEditing ? (
          <>
            <label>Maximum HP</label>
            <input
              type="number"
              value={hp.maximum}
              onChange={(e) => {
                setHp((prev) => ({ ...prev, maximum: validateAbilityInput(e.target.value) }));
              }}
            />
          </>
        ) : (
          <div className={styles.health}>
            <label>
              <span className="hidden">Temp HP</span>
              <input
                type="range"
                max={hp.maximum}
                value={tempHp.current}
                onChange={(e) =>
                  setTempHp((prev) => ({
                    ...prev,
                    current: getAbilityNumber(validateAbilityInput(e.target.value)),
                  }))
                }
              />
              <span>{tempHp.current} temp HP</span>
            </label>
            <label>
              <span className="hidden">HP</span>
              <input
                type="range"
                max={getAbilityNumber(hp.maximum)}
                value={hp.current}
                onChange={(e) =>
                  setHp((prev) => ({
                    ...prev,
                    current: getAbilityNumber(validateAbilityInput(e.target.value)),
                  }))
                }
              />
              <span>
                {hp.current}/{getAbilityNumber(hp.maximum)} HP
              </span>
            </label>
          </div>
        )}
        {isEditing || spellSlots.some(({ maximum }) => getAbilityNumber(maximum) > 0) ? (
          <h3>Spell Slots</h3>
        ) : null}
        {spellSlots.map(({ name, current, maximum }, index) => (
          <AbilityTracker
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
            <button onClick={() => setIsEditing(false)}>Save</button>
            <button
              className="secondary"
              onClick={() => {
                // TODO
                // setMaximums(storedMaximums.current);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLongRest}>Long rest</button>
            <button
              onClick={() => {
                // TODO
                // storedMaximums.current = maximums;
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
