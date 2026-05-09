import { CLASS_NAME_MAP } from '../../constants/classes';
import { spellDetails } from '../../constants/spell-details';
import type { Spell } from '../../types';
import { classNames } from '../util';
import styles from './index.module.css';

export const SpellCard = ({
  id,
  className,
  url,
  showTitle = false,
}: {
  showTitle?: boolean;
  id: string;
  className?: string;
  url: string;
}) => {
  const spell: Spell.Details = spellDetails[id];

  if (!spell) return null;

  const {
    title,
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
    <div className={classNames(styles.spellCard, className)}>
      {showTitle ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.levelAndSchool}>{levelAndSchool}</div>
      <div className={styles.details}>
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
      </div>
      <div className={styles.description}>
        {description.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Index is the best we have here
          <div key={`${index}-${line}`}>
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
          {spellLists.map((spellListId) => CLASS_NAME_MAP[spellListId] ?? spellListId).join(', ')}
        </div>
      </div>
      <div className={styles.source}>
        <div>
          <a href={url} target="_blank" rel="noopener noreferrer">
            See spell's wiki page
          </a>
        </div>
        Source: {source}
      </div>
    </div>
  );
};
