import { IconAdd } from '../icons/IconAdd';
import { IconDelete } from '../icons/IconDelete';
import styles from './index.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1>DnD 5e Spellbook</h1>
      <nav>
        <ul>
          {/* TODO */}
          {/* <li className={styles.summaryView}>
            <input id="card-view" type="checkbox" />
            <label htmlFor="card-view">Card view</label>
          </li> */}
          <li>
            <button>
              <IconDelete />
              <span className={styles.buttonLabel}> Clear spells</span>
            </button>
          </li>
          {/* TODO */}
          {/* <li><button>Print</button></li> */}
          <li>
            <button>
              <IconAdd />
              <span className={styles.buttonLabel}> Add spells</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
