import { Spell } from '../types';
import styles from './index.module.css';
import { spellDetails } from '../../constants/spell-details';

export const SpellCard = ({
  id,
  className,
  url,
}: {
  id: string;
  className?: string;
  url: string;
}) => {
  const spell: Spell.Details = spellDetails[id];

  if (!spell) return null;

  const {
    source,
    levelAndSchool,
    castingTime,
    range,
    components,
    duration,
    description,
    spellLists,
  } = spell;

  return (
    <div className={`${styles.spellCard} ${className}`}>
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
        <div>
          <b>Class lists:</b>{' '}
          {spellLists
            .map((spellList) => {
              const listName = spellList.split(':').at(-1).replace(/\//g, '').replace(/-/g, ' ');
              return listName.charAt(0).toUpperCase() + listName.slice(1);
            })
            .join(', ')}
        </div>
      </div>
      <div className={styles.source}>
        <div>
          <a href={url}>See spell's wiki page</a>
        </div>
        Source: {source}
      </div>
    </div>
  );
};
