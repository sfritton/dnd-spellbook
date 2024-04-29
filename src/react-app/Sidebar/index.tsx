import { ClassSpellsInput } from '../ClassSpellsInput';
import { Typeahead } from '../Typeahead';
import styles from './index.module.css';
import { useDialog } from '../Dialog';
import { useSpellListContext } from '../SpellListContext';
import { useState } from 'react';

export const Sidebar = () => {
  const { spellLists, appendSpells, clearSpells } = useSpellListContext();
  const [isTypeaheadOpen, setIsTypeaheadOpen] = useState(false);
  const [isClassSpellsOpen, setIsClassSpellsOpen] = useState(false);

  const hasSpells = spellLists.some((spells) => spells.length > 0);

  if (isTypeaheadOpen)
    return (
      <div className={`${styles.sidebar} parchment overlay`}>
        <h2>Add spells by name</h2>
        <Typeahead appendSpells={appendSpells} close={() => setIsTypeaheadOpen(false)} />
      </div>
    );

  if (isClassSpellsOpen)
    return (
      <div className={`${styles.sidebar} parchment overlay`}>
        <h2>Add spells from class list</h2>
        <ClassSpellsInput appendSpells={appendSpells} close={() => setIsClassSpellsOpen(false)} />
      </div>
    );

  return (
    <div className={`${styles.sidebar} parchment overlay`}>
      <h2>Add spells…</h2>
      <button className="secondary" onClick={() => setIsTypeaheadOpen(true)}>
        By name
      </button>
      <button className="secondary" onClick={() => setIsClassSpellsOpen(true)}>
        From class list
      </button>
      {/* TODO: dialog no longer auto-closes on submit */}
      {hasSpells ? (
        <button className="secondary" onClick={clearSpells}>
          Clear spells
        </button>
      ) : null}
    </div>
  );
};
