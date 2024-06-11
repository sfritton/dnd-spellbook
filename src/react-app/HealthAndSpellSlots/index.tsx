import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';
import { IconClose } from '../icons/IconClose';
import { useSettingsContext } from '../SettingsContext';
import { Ability } from './types';
import { AbilityTracker } from './components/AbilityTracker';

const getStoredHealthAndSpellSlots = ():
  | {
      maximums: {
        hp: number;
        spellSlots: number[];
      };
      hp: number;
      tempHp: number;
      spellSlots: number[];
      abilities: Ability[];
    }
  | undefined => {
  const storedString = localStorage.getItem('character-status');

  if (!storedString) return undefined;

  return JSON.parse(storedString);
};

export const HealthAndSpellSlots = () => {
  const { isCharacterOpen, setIsCharacterOpen } = useSettingsContext();
  const defaults = getStoredHealthAndSpellSlots();
  const [maximums, setMaximums] = useState(
    defaults?.maximums ?? {
      hp: 0,
      spellSlots: new Array(9).fill(0),
    },
  );

  const [hp, setHp] = useState(defaults?.hp ?? 0);
  const [tempHp, setTempHp] = useState(defaults?.tempHp ?? 0);
  const [spellSlots, setSpellSlots] = useState(defaults?.spellSlots ?? new Array(9).fill(0));
  const [abilities, setAbilities] = useState(defaults?.abilities ?? []);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const makeUpdateSpellSlots = useCallback(
    (level: number) => (newValue: number) => {
      setSpellSlots((prev) => {
        const newSlots = [...prev];
        newSlots[level] = newValue;

        return newSlots;
      });
    },
    [],
  );

  useEffect(() => {
    localStorage.setItem(
      'character-status',
      JSON.stringify({
        maximums,
        hp,
        tempHp,
        spellSlots,
        abilities,
      }),
    );
  }, [maximums, hp, tempHp, spellSlots, abilities]);

  useEffect(() => {
    if (isCharacterOpen) headingRef.current?.focus();
  }, [isCharacterOpen]);

  // If max HP is 0, we want to default to edit mode
  const [isEditing, setIsEditing] = useState(maximums.hp === 0);

  const handleLongRest = useCallback(() => {
    setHp(maximums.hp);
    setTempHp(0);
    setSpellSlots([...maximums.spellSlots]);
    setAbilities((prev) => prev.map((ability) => ({ ...ability, current: ability.maximum })));
  }, [maximums]);

  const storedMaximums = useRef<typeof maximums>(maximums);

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
              value={maximums.hp}
              onChange={(e) => {
                const newMaxHp = Number(e.target.value);
                if (isNaN(newMaxHp)) return;

                setMaximums((prev) => ({
                  ...prev,
                  hp: Math.max(0, newMaxHp),
                }));
              }}
            />
          </>
        ) : (
          <div className={styles.health}>
            <label>
              <span className="hidden">Temp HP</span>
              <input
                type="range"
                max={maximums.hp}
                value={tempHp}
                onChange={(e) => setTempHp(Number(e.target.value))}
              />
              <span>{tempHp} temp HP</span>
            </label>
            <label>
              <span className="hidden">HP</span>
              <input
                type="range"
                max={maximums.hp}
                value={hp}
                onChange={(e) => setHp(Number(e.target.value))}
              />
              <span>
                {hp}/{maximums.hp} HP
              </span>
            </label>
          </div>
        )}
        <h3>Spell Slots</h3>
        <div className={styles.spellSlots}>
          {maximums.spellSlots.map((slots, level) =>
            isEditing ? (
              <div className={styles.slot} key={`spell-slots-${level}`}>
                <label htmlFor={`spell-slots-${level}`}>{formatSpellLevel(level + 1)}</label>
                <input
                  id={`spell-slots-${level}`}
                  type="number"
                  value={slots}
                  onChange={(e) => {
                    const newSlotCount = Number(e.target.value);
                    if (isNaN(newSlotCount)) return;

                    const newSpellSlots = [...maximums.spellSlots];
                    // Must be between 0 and 5
                    newSpellSlots[level] = Math.max(0, newSlotCount);

                    setMaximums((prev) => ({
                      ...prev,
                      spellSlots: newSpellSlots,
                    }));
                  }}
                />
              </div>
            ) : slots > 0 ? (
              <AbilityTracker
                key={level}
                name={formatSpellLevel(level + 1)}
                current={spellSlots[level]}
                maximum={slots}
                onChange={makeUpdateSpellSlots(level)}
              />
            ) : null,
          )}
        </div>
        {isEditing || abilities.length ? (
          <>
            <h3>Abilities</h3>
            {abilities.map(({ name, current, maximum }, index) =>
              isEditing ? (
                <div className={styles.editAbility} key={index}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setAbilities((prev) => {
                        const newPrev = [...prev];

                        newPrev[index] = { ...newPrev[index], name: e.target.value };

                        return newPrev;
                      })
                    }
                  />
                  <label>Maximum</label>
                  <input
                    type="number"
                    value={maximum}
                    onChange={(e) =>
                      setAbilities((prev) => {
                        const newMaximum = Number(e.target.value);
                        if (isNaN(newMaximum)) return prev;

                        const newPrev = [...prev];
                        newPrev[index] = { ...newPrev[index], maximum: newMaximum };

                        return newPrev;
                      })
                    }
                  />
                </div>
              ) : Boolean(name.length && maximum) ? (
                <AbilityTracker
                  key={index}
                  isRange
                  name={name}
                  current={current}
                  maximum={maximum}
                  onChange={(newCurrent) => {
                    setAbilities((prev) => {
                      const newPrev = [...prev];
                      newPrev[index] = { ...newPrev[index], current: newCurrent };

                      return newPrev;
                    });
                  }}
                />
              ) : null,
            )}
          </>
        ) : null}
        {isEditing ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAbilities((prev) => [...prev, { name: '', current: 0, maximum: 0 }]);
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
                setMaximums(storedMaximums.current);
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
                storedMaximums.current = maximums;
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
