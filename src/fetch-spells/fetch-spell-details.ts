import { readdir } from 'fs/promises';
import * as SPELL_LISTS from '../../spells/spell-lists.json';
import { asyncMap, executeThenWait, rateLimitedMap } from './rate-limited-map';
import { saveSpell } from './save-spell';
import { consoleLogEmphasis } from './util';

export const getSavedSpells = async () => {
  const spellDirectories = await readdir(`${__dirname}/../../../spells`);

  const allSpells = await Promise.all(
    spellDirectories.map((directory) =>
      /\.json$/.test(directory)
        ? ([] as string[])
        : readdir(`${__dirname}/../../../spells/${directory}`),
    ),
  );

  return allSpells
    .flat()
    .reduce<Record<string, true>>(
      (histogram, spell) => ({ ...histogram, [spell.replace(/\.json$/, '')]: true }),
      {},
    );
};

export const fetchSpellDetails = async () => {
  consoleLogEmphasis('Fetching Spell Details');
  const spellLists = Object.entries(SPELL_LISTS);
  const savedSpells = await getSavedSpells();

  await rateLimitedMap(spellLists, ([className, spellList], i) => {
    console.log(i, new Date(), `Fetching ${className} spells ...`);
    return asyncMap(spellList, (spell, j) => {
      if (savedSpells[spell.name]) {
        console.log(`\t${i}-${j}`, new Date(), `Found saved version of ${spell.name}, skipping`);
      }
      console.log(`\t${i}-${j}`, new Date(), `Fetching and saving ${spell.name} ...`);
      return executeThenWait(() => saveSpell(spell.url, className));
    });
  });

  console.log('Done!');
};
