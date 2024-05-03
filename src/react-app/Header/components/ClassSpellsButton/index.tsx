import { useCallback, FormEvent } from 'react';
import { formatSpellLevel } from '../../../util';
import { CLASSES } from '../../../../constants/classes';
import * as spellLists from '../../../spells';
import styles from './index.module.css';
import { useSpellListContext } from '../../../SpellListContext';
import { useSingleDialog } from '../../../Dialog';
import { Checkbox } from '../../../Checkbox';

const LEVEL_OPTIONS = [...new Array(10)].map((_, i) => ({
  value: i,
  label: formatSpellLevel(i, true),
}));

export const ClassSpellsButton = () => {
  const { appendSpells } = useSpellListContext();
  const { open, close } = useSingleDialog();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const [select, fieldset] = e.target as HTMLFormElement;

      const className = (select as HTMLSelectElement).value;
      const levels = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        Number.parseInt(input.getAttribute('id').replace('level-', ''), 10),
      );

      appendSpells(
        levels.flatMap((level) => spellLists[className as keyof typeof spellLists][level]),
      );
      close();
    },
    [appendSpells, close],
  );

  const openDialog = useCallback(() => {
    open({
      title: 'Add spells from class list',
      isDrawer: true,
      children: (
        <>
          <form className={styles.classSpellsForm} onSubmit={handleSubmit}>
            <label className={styles.selectLabel} htmlFor="class-select">
              Choose a class
            </label>
            <select id="class-select">
              {CLASSES.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <fieldset>
              <legend>Choose spell levels</legend>
              {LEVEL_OPTIONS.map(({ value, label }) => (
                <Checkbox key={value} id={`level-${value}`} label={label} />
              ))}
            </fieldset>
            <button type="submit">Load spells</button>
          </form>
        </>
      ),
    });
  }, [handleSubmit, open]);

  return <button onClick={openDialog}>Add from class list</button>;
};
