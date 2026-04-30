import { type FormEvent, useCallback } from 'react';

import { CLASSES } from '../../../../constants/classes';
import { Checkbox } from '../../../Checkbox';
import { useSingleDialog } from '../../../Dialog';
import { IconAdd } from '../../../icons/IconAdd';
import { useSpellListContext } from '../../../SpellListContext';
import { spellLists } from '../../../spells';
import { formatSpellLevel } from '../../../util';
import { NavButton } from '../NavButton';
import styles from './index.module.css';

const LEVEL_OPTIONS = [...new Array(10)].map((_, i) => ({
  value: i,
  label: formatSpellLevel(i, true),
}));

export const ClassSpellsButton = ({ isNav = false }: { isNav?: boolean }) => {
  const { appendSpells } = useSpellListContext();
  const { open, close } = useSingleDialog();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const [select, fieldset] = e.target as HTMLFormElement;

      const className = (select as HTMLSelectElement).value;
      const levels = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        Number.parseInt(input.getAttribute('id')?.replace?.('level-', '') ?? '', 10),
      );

      appendSpells(levels.flatMap((level) => spellLists[className][level]));
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

  if (isNav) {
    return <NavButton icon={<IconAdd />} label="Add spells" onClick={openDialog} />;
  }

  return (
    <button type="button" onClick={openDialog}>
      Add from class list
    </button>
  );
};
