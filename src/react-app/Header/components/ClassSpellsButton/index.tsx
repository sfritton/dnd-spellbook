import { Fragment, useState, useCallback, FormEvent } from 'react';
import { formatSpellLevel } from '../../../util';
import { CLASSES } from '../../../../constants/classes';
import * as spellLists from '../../../spells';
import { Spell } from '../../../types';
import styles from './index.module.css';
import { useSpellListContext } from '../../../SpellListContext';
import { useDialog } from '../../../Dialog';

const LEVEL_OPTIONS = [...new Array(10)].map((_, i) => ({
  value: i,
  label: formatSpellLevel(i, true),
}));

export const ClassSpellsButton = () => {
  const { appendSpells } = useSpellListContext();
  const [ClassSpellsDrawer, { open, close }] = useDialog();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const [select, fieldset] = e.target as HTMLFormElement;

      const className = (select as HTMLSelectElement).value;
      const levels = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].map((input) =>
        Number.parseInt(input.getAttribute('value'), 10),
      );

      appendSpells(
        levels.flatMap((level) => spellLists[className as keyof typeof spellLists][level]),
      );
      close();
    },
    [appendSpells, close],
  );

  return (
    <>
      <button onClick={open}>Add from class list</button>
      <ClassSpellsDrawer isDrawer title="Add spells from class list">
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
              <div key={value}>
                <input type="checkbox" value={value} id={`level-${value}`} />
                <label htmlFor={`level-${value}`}>{label}</label>
              </div>
            ))}
          </fieldset>
          <button type="submit">Load spells</button>
        </form>
      </ClassSpellsDrawer>
    </>
  );
};
