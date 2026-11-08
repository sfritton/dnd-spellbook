import { useEffect, useRef, useState } from 'react';

import { useCharacterContext } from '../CharacterContext';
import { CharacterName } from '../CharacterName';
import { IconAdd } from '../icons/IconAdd';
import { IconCharacter } from '../icons/IconCharacter';
import { IconCheckmark } from '../icons/IconCheckmark';
import { IconMenu } from '../icons/IconMenu';
import { useSettingsContext } from '../SettingsContext';
import { ClassSpellsButton } from './components/ClassSpellsButton';
import { FilterButton } from './components/FilterButton';
import { NavButton } from './components/NavButton';
import { SearchBar } from './components/SearchBar';
import { SettingsButton } from './components/SettingsButton';
import styles from './index.module.css';

export const Header = () => {
  const { setIsCharacterOpen, isCharacterOpen } = useSettingsContext();
  const { currentCharacterId, characters, addCharacter, setCurrentCharacterId } =
    useCharacterContext();
  const [currentNav, setCurrentNav] = useState<'MENU' | 'CHARACTER_SELECT'>();
  const headerRef = useRef<HTMLDivElement>(null);

  // Close nav on a click outside
  useEffect(() => {
    const closeNav = (e: MouseEvent) => {
      // @ts-expect-error -- TS doesn't believe in .closest(), but it's real
      const isInHeader = Boolean(e.target.closest?.(`.${styles.visualHeader}`));
      // @ts-expect-error -- TS doesn't believe in .closest(), but it's real
      const isInSearchBar = Boolean(e.target.closest?.('#search-bar'));

      if (isInHeader && !isInSearchBar) return;

      setCurrentNav(undefined);
    };

    document.addEventListener('click', closeNav);
    // TODO: close on ESC press

    return () => document.removeEventListener('click', closeNav);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.visualHeader} ref={headerRef} style={{ viewTransitionName: 'header' }}>
        <div className={styles.leftButtons}>
          <NavButton
            className={styles.menuButton}
            icon={<IconMenu />}
            label="Menu"
            onClick={() => setCurrentNav((prev) => (prev === 'MENU' ? undefined : 'MENU'))}
            isSmall
          />
          <NavButton
            className={styles.menuButton}
            icon={<IconCharacter />}
            label={<CharacterName as="h1" />}
            onClick={() =>
              setCurrentNav((prev) =>
                prev === 'CHARACTER_SELECT' ? undefined : 'CHARACTER_SELECT',
              )
            }
          />
        </div>
        {/* Placeholder for grid spacing, probably a better way to do this */}
        <div></div>
        <nav
          className={currentNav === 'MENU' ? styles.open : styles.closed}
          aria-hidden={currentNav === 'MENU' ? undefined : 'true'}
          // @ts-expect-error -- TS doesn't believe in inert, but it's real
          inert={currentNav === 'MENU' ? undefined : 'true'}
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
                onClick={() => {
                  setIsCharacterOpen(!isCharacterOpen);
                  setCurrentNav(undefined);
                }}
              />
            </li>
            <li>
              <SettingsButton />
            </li>
          </ul>
        </nav>
        <nav
          className={currentNav === 'CHARACTER_SELECT' ? styles.open : styles.closed}
          aria-hidden={currentNav === 'CHARACTER_SELECT' ? undefined : 'true'}
          // @ts-expect-error -- TS doesn't believe in inert, but it's real
          inert={currentNav === 'CHARACTER_SELECT' ? undefined : 'true'}
        >
          <ul>
            {Object.values(characters).map((character) => (
              <li key={character?.id}>
                <NavButton
                  icon={
                    character?.id === currentCharacterId ? (
                      <IconCheckmark />
                    ) : (
                      <span style={{ width: 24 }} />
                    )
                  }
                  label={<CharacterName id={character?.id} />}
                  onClick={() => {
                    setCurrentNav(undefined);
                    setCurrentCharacterId(character?.id);
                  }}
                />
              </li>
            ))}
            <li>
              <NavButton
                icon={<IconAdd />}
                label="Add new character"
                onClick={() => {
                  setCurrentNav(undefined);
                  addCharacter();
                }}
              />
            </li>
          </ul>
        </nav>
        <SearchBar />
      </div>
    </header>
  );
};
