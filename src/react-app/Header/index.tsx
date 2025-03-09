import styles from './index.module.css';
import { NavButton } from './components/NavButton';
import { ClassSpellsButton } from './components/ClassSpellsButton';
import { useEffect, useRef, useState } from 'react';
import { SettingsButton } from './components/SettingsButton';
import { IconCharacter } from '../icons/IconCharacter';
import { useSettingsContext } from '../SettingsContext';
import { IconMenu } from '../icons/IconMenu';
import { SearchBar } from './components/SearchBar';
import { FilterButton } from './components/FilterButton';

export const Header = () => {
  const { setIsCharacterOpen, isCharacterOpen } = useSettingsContext();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Close nav on a click outside
  useEffect(() => {
    const closeNav = (e: MouseEvent) => {
      // @ts-expect-error -- TS doesn't believe in .closest(), but it's real
      const isInHeader = Boolean(e.target.closest?.(`.${styles.visualHeader}`));
      // @ts-expect-error -- TS doesn't believe in .closest(), but it's real
      const isInSearchBar = Boolean(e.target.closest?.('#search-bar'));

      if (isInHeader && !isInSearchBar) return;

      setIsNavOpen(false);
    };

    document.addEventListener('click', closeNav);
    // TODO: close on ESC press

    return () => document.removeEventListener('click', closeNav);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.visualHeader} ref={headerRef}>
        <NavButton
          className={styles.menuButton}
          icon={<IconMenu />}
          label="Menu"
          onClick={() => setIsNavOpen((prev) => !prev)}
          isSmall
        />
        <h1>DnD 5e Spellbook</h1>
        <nav
          className={isNavOpen ? styles.open : styles.closed}
          aria-hidden={isNavOpen ? undefined : 'true'}
          // @ts-expect-error -- TS doesn't believe in inert, but it's real
          inert={isNavOpen ? undefined : 'true'}
        >
          <ul>
            <li>
              <ClassSpellsButton isNav />
            </li>
            <li>
              <FilterButton />
            </li>
            <li>
              <NavButton
                icon={<IconCharacter />}
                label="Character status"
                onClick={() => setIsCharacterOpen(!isCharacterOpen)}
              />
            </li>
            <li>
              <SettingsButton />
            </li>
          </ul>
        </nav>
        <SearchBar />
      </div>
    </header>
  );
};
