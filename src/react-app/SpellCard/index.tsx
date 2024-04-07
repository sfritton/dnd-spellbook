import { Spell } from '../types';
import styles from './index.module.css';
import { spellDetails } from '../../constants/spell-details';

export const SpellCard = ({ id, className }: { id: string; className?: string }) => {
  const spell: Spell.Details = spellDetails[id];

  if (!spell) return null;

  const { title, source, levelAndSchool, castingTime, range, components, duration, description } =
    spell;

  return (
    <div className={`${styles.spellCard} ${className}`}>
      <h3>{title}</h3>
      <div className={styles.levelAndSchool}>{levelAndSchool}</div>
      <div className={styles.detail}>
        <div>Casting time</div>
        {castingTime}
      </div>
      <div className={styles.detail}>
        <div>Range</div>
        {range}
      </div>
      <div className={styles.detail}>
        <div>Components</div>
        {components}
      </div>
      <div className={styles.detail}>
        <div>Duration</div>
        {duration}
      </div>
      <div className={styles.description}>
        {description.map((line) => (
          <div key={line}>
            {line.match(/^at higher levels\./i) ? (
              <>
                <b>At Higher Levels.</b> {line.replace(/^at higher levels\./i, '')}
              </>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
      <div className={styles.source}>Source: {source}</div>
    </div>
  );
};
