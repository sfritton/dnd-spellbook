import { useState } from 'react';
import styles from './index.module.css';
import { SpellSummary } from '../../../SpellSummary';
import { useSpellListContext } from '../../../SpellListContext';
import allSpells from '../../../../constants/spells/all.json';
import { IconSearch } from '../../../icons/IconSearch';

const allSpellsFlat = allSpells.flat();

export const SearchBar = () => {
  const [value, setValue] = useState<string>('');
  const { appendSpells, removeSpell, spellLists } = useSpellListContext();

  const matchingSpells = value
    ? allSpellsFlat.filter(({ title }) => title.match(new RegExp(value, 'i'))).slice(0, 3)
    : [];

  const showDropdown = matchingSpells.length > 0;

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrapper}>
        <label htmlFor="search-bar" className="hidden">
          Find spells by name
        </label>
        <input
          type="text"
          id="search-bar"
          placeholder="Find spells by name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <IconSearch />
      </div>
      <ul className={`${styles.dropdown} parchment overlay ${showDropdown ? styles.open : ''}`}>
        {showDropdown
          ? matchingSpells.map((spell) => <SpellSummary key={spell.id} {...spell} showLevel />)
          : null}
      </ul>
    </div>
  );
};
