import { IconAdd } from '../icons/IconAdd';
import { IconDelete } from '../icons/IconDelete';
import { IconPrint } from '../icons/IconPrint';
import { NavDropdown } from './components/NavDropdown';
import styles from './index.module.css';
import { NavButton } from './components/NavButton';
import { useSpellListContext } from '../SpellListContext';
import { TypeaheadButton } from './components/TypeaheadButton';
import { ClassSpellsButton } from './components/ClassSpellsButton';
import { useSingleDialog } from '../Dialog';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SettingsButton } from './components/SettingsButton';
import { IconCharacter } from '../icons/IconCharacter';
import { useSettingsContext } from '../SettingsContext';
import { IconMenu } from '../icons/IconMenu';

export const Header = () => {
  const { clearSpells, spellLists } = useSpellListContext();
  const { setIsCharacterOpen } = useSettingsContext();
  const { open, close } = useSingleDialog();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeNav = (e: MouseEvent) => {
      // @ts-expect-error -- TS doesn't believe in .closest(), but it's real
      const isInHeader = Boolean(e.target.closest?.(`.${styles.visualHeader}`));

      // Ignore clicks inside the header
      if (isInHeader) return;

      setIsNavOpen(false);
    };

    document.addEventListener('click', closeNav);

    return () => document.removeEventListener('click', closeNav);
  }, []);

  const hasSpells = useMemo(() => spellLists.some((list) => list.length > 0), [spellLists]);

  const openClearDialog = useCallback(() => {
    const handleYes = () => {
      clearSpells();
      close();
    };
    open({
      title: 'Remove all spells?',
      className: styles.clearDialog,
      children: (
        <>
          <div>Are you sure you want to remove all spells from your spellbook? </div>
          <b>This cannot be undone.</b>
          <button className="secondary" onClick={handleYes}>
            Yes
          </button>
          <button onClick={close}>No</button>
        </>
      ),
    });
  }, [open, close, clearSpells]);

  return (
    <header className={styles.header}>
      <div className={styles.visualHeader} ref={headerRef}>
        <h1>DnD 5e Spellbook</h1>
        <NavButton
          className={styles.menuButton}
          icon={<IconMenu />}
          label="Menu"
          onClick={() => setIsNavOpen((prev) => !prev)}
          forceSmall
        />
        <nav className={isNavOpen ? styles.open : styles.closed}>
          <ul>
            <li>
              <NavButton
                icon={<IconCharacter />}
                label="Character status"
                onClick={() => setIsCharacterOpen(true)}
              />
            </li>
            {hasSpells ? (
              <>
                <li>
                  <NavButton
                    icon={<IconDelete />}
                    label="Remove spells"
                    onClick={openClearDialog}
                  />
                </li>
                <li>
                  <SettingsButton />
                </li>
              </>
            ) : null}
            {/* TODO */}
            {/* <li>
              <NavButton icon={<IconPrint />} label="Print spells" />
            </li> */}
            <li>
              <NavDropdown title="Add spells" icon={<IconAdd />}>
                <TypeaheadButton />
                <ClassSpellsButton />
              </NavDropdown>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
