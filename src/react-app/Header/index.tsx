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

export const Header = () => {
  const { clearSpells } = useSpellListContext();
  return (
    <header className={styles.header}>
      <div className={styles.visualHeader}>
        <h1>DnD 5e Spellbook</h1>
        <nav>
          <ul>
            <li>
              <NavButton icon={<IconDelete />} label="Clear spells" onClick={clearSpells} />
            </li>
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
            {/* TODO */}
            {/* <li>
              <NavButton icon={<IconSettings />} label="Settings" />
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};
