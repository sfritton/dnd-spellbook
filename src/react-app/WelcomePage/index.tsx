import { CharacterNameInput } from '../CharacterNameInput';
import { ClassSpellsButton } from '../Header/components/ClassSpellsButton';
import styles from './index.module.css';

export const WelcomePage = () => (
  <section className={styles.welcome}>
    <div className={styles.welcomeInner}>
      <h2>Welcome to your D&amp;D 5e Spellbook!</h2>
      <p>
        This is a simple tool to assemble your character's spells and quickly reference them during
        combat.
      </p>
      <h3>Name your character</h3>
      <CharacterNameInput id="welcome-name-input" />
      <h3>Start adding spells</h3>
      <div className={styles.buttons}>
        <button type="button" onClick={() => document.getElementById('search-bar')?.focus()}>
          Add by name
        </button>
        <ClassSpellsButton />
      </div>
    </div>
  </section>
);
