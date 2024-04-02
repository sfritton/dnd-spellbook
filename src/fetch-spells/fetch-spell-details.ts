import { copyFile, readdir } from 'fs/promises';
import * as SPELL_LISTS from '../../spells/spell-lists.json';
import { asyncMap, executeThenWait, rateLimitedMap } from './rate-limited-map';
import { saveSpell } from './save-spell';
import { consoleLogEmphasis } from './util';

export const getSavedSpells = async () => {
  const spellDirectoryPath = `${__dirname}/../../../spells`;
  const spellDirectories = await readdir(spellDirectoryPath);

  const allSpells = await Promise.all(
    spellDirectories.map(async (directory) =>
      /\.json$/.test(directory)
        ? undefined
        : {
            path: `${spellDirectoryPath}/${directory}`,
            spells: await readdir(`${spellDirectoryPath}/${directory}`),
          },
    ),
  );

  return allSpells.filter(Boolean).reduce<Record<string, string>>(
    (histogram, { path, spells }) => ({
      ...histogram,
      ...spells.reduce<Record<string, string>>(
        (classHistogram, spell) => ({ ...classHistogram, [spell.replace(/\.json$/, '')]: path }),
        {},
      ),
    }),
    {},
  );
};

export const fetchSpellDetails = async () => {
  consoleLogEmphasis('Fetching Spell Details');
  const spellLists = Object.entries(SPELL_LISTS);
  const savedSpells = await getSavedSpells();

  await rateLimitedMap(spellLists, ([className, spellList], i) => {
    console.log(i, new Date(), `Fetching ${className} spells ...`);
    return asyncMap(spellList, async (spell, j) => {
      const savedSpellPath = savedSpells[spell.name];
      if (savedSpellPath) {
        console.log(`\t${i}-${j}`, new Date(), `Found saved version of ${spell.name}, skipping`);
        await copyFile(
          `${savedSpellPath}/${spell.name}.json`,
          `${__dirname}/../../../spells/${className}/${spell.name}.json`,
        );
        return;
      }
      console.log(`\t${i}-${j}`, new Date(), `Fetching and saving ${spell.name} ...`);
      return executeThenWait(() => saveSpell(spell.url, className));
    });
  });

  console.log('Done!');
};
