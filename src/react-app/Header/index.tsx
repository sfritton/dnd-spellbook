import { useState } from 'react';
import { IconAdd } from '../icons/IconAdd';
import { IconDelete } from '../icons/IconDelete';
import { NavDropdown } from './components/NavDropdown';
import styles from './index.module.css';
import { NavButton } from './components/NavButton';

export const Header = () => {
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  return (
    <header className={styles.header} onMouseLeave={() => setIsAddDropdownOpen(false)}>
      <div className={styles.visualHeader}>
        <h1>DnD 5e Spellbook</h1>
        <nav>
          <ul>
            {/* TODO */}
            {/* <li className={styles.summaryView}>
            <input id="card-view" type="checkbox" />
            <label htmlFor="card-view">Card view</label>
          </li> */}
            <li>
              <NavButton icon={<IconDelete />} label="Clear spells" />
            </li>
            {/* TODO */}
            {/* <li><button>Print</button></li> */}
            <li>
              {/* <button
                className={isAddDropdownOpen ? styles.isOpen : undefined}
                onMouseEnter={() => setIsAddDropdownOpen(true)}
              >
                <IconAdd />
                <span className={styles.buttonLabel}> Add spells</span>
              </button> */}
              <NavDropdown title="Add spells" icon={<IconAdd />}>
                <button>Add by name</button>
                <button>Add from class list</button>
              </NavDropdown>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
