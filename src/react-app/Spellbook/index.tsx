import { SpellList } from '../SpellList';
import styles from './index.module.css';
import { formatSpellLevel } from '../util';
import { useSpellListContext } from '../SpellListContext';
import { WelcomePage } from '../WelcomePage';
import { useSettingsContext } from '../SettingsContext';

export const Spellbook = () => {
  const { spellLists, preparedSpells } = useSpellListContext();
  const { hideKnownSpells } = useSettingsContext();

  const hasSpells = spellLists.some((spells) => spells.length > 0);
  const hasPreparedSpells = preparedSpells.some((spells) => spells.length > 0);

  if (!hasSpells) return <WelcomePage />;

  return (
    <>
      <section>
        <h2>Prepared Spells</h2>
        {hasPreparedSpells ? (
          preparedSpells.map((spells, index) =>
            spells.length > 0 ? (
              <section key={index}>
                <h3>{formatSpellLevel(index, true)}</h3>
                <SpellList spells={spells} checkboxIdSuffix="prepared" />
              </section>
            ) : null,
          )
        ) : (
          <div className={styles.spellListPlaceholder}>
            Check the box next to a spell to add it to your prepared spells.
          </div>
        )}
      </section>
      {hideKnownSpells ? null : (
        <>
          <h2>Known Spells</h2>
          {spellLists.map((spells, index) =>
            spells.length > 0 ? (
              <section key={index}>
                <h3>{formatSpellLevel(index, true)}</h3>
                <SpellList spells={spells} checkboxIdSuffix="known" />
              </section>
            ) : null,
          )}
        </>
      )}
    </>
  );
};
