import { ClassSpellsButton } from '../Header/components/ClassSpellsButton';
import styles from './index.module.css';

export const WelcomePage = () => {
  return (
    <section className={styles.welcome}>
      <div className={styles.welcomeInner}>
        <h2>Welcome to your DnD 5e Spellbook!</h2>
        <p>
          This is a simple tool to assemble your character's spells and quickly reference them
          during combat.
        </p>
        <h3>Start adding spells</h3>
        <div className={styles.buttons}>
          <button onClick={() => document.getElementById('search-bar')?.focus()}>
            Add by name
          </button>
          <ClassSpellsButton />
        </div>
      </div>
    </section>
  );
};
