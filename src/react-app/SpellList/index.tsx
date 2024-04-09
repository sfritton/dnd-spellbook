import { SpellSummary } from '../SpellSummary';
import { Spell } from '../types';
import styles from './index.module.css';

export const SpellList = ({
  spells,
  spellsToSkip,
  makeToggleSpell,
}: {
  spells: Spell.Summary[];
  spellsToSkip: string[];
  makeToggleSpell: (id: string) => (isChecked: boolean) => void;
}) => {
  if (spells.length < 1) return null;

  return (
    <ul className={styles.spellList}>
      {spells.map((spell) => (
        <SpellSummary
          isChecked={!spellsToSkip.includes(spell.id)}
          onChange={makeToggleSpell(spell.id)}
          key={spell.id}
          {...spell}
        />
      ))}
    </ul>
  );
};
