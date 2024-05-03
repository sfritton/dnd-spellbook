import { IconAdd } from '../icons/IconAdd';
import { IconDelete } from '../icons/IconDelete';
import { IconPrint } from '../icons/IconPrint';
import { IconSettings } from '../icons/IconSettings';
import { NavDropdown } from './components/NavDropdown';
import styles from './index.module.css';
import { NavButton } from './components/NavButton';
import { useSpellListContext } from '../SpellListContext';
import { TypeaheadButton } from './components/TypeaheadButton';
import { ClassSpellsButton } from './components/ClassSpellsButton';
import { useSingleDialog } from '../Dialog';
import { useCallback, useMemo } from 'react';
import { SettingsButton } from './components/SettingsButton';

export const Header = () => {
  const { clearSpells, spellLists } = useSpellListContext();
  const { open, close } = useSingleDialog();

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
      <div className={styles.visualHeader}>
        <h1>DnD 5e Spellbook</h1>
        <nav>
          <ul>
            {hasSpells ? (
              <>
                <li>
                  <NavButton
                    icon={<IconDelete />}
                    label="Remove spells"
                    onClick={openClearDialog}
                  />
                </li>
                {/* TODO */}
                {/* <li>
                  <SettingsButton />
                </li> */}
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
