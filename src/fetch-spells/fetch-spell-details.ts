import { readdir } from 'fs/promises';
import { consoleLogEmphasis, nameFromUrl } from './util';
import { fetchDndPage } from './fetch-dnd-page';
import { load } from 'cheerio';
import { SPELL_DIRECTORY_PATH } from './constants';

export const getSavedSpells = async () => {
  const allSpells = await readdir(SPELL_DIRECTORY_PATH);

  return allSpells.reduce<Record<string, boolean>>(
    (histogram, spellFileName) => ({
      ...histogram,
      [spellFileName.replace(/\.json$/, '')]: true,
    }),
    {},
  );
};

const fetchAllSpellNames = async () => {
  const pageHTML = await fetchDndPage('/spells').then((response) => response.text());
  const dom = load(pageHTML);

  return dom(`td > a`)
    .map((_, anchor) => {
      const url = anchor.attribs['href'];

      return {
        url,
        name: nameFromUrl(url),
      };
    })
    .toArray();
};

export const fetchSpellDetails = async () => {
  consoleLogEmphasis('Fetching Spell Details');
  const spellList = await fetchAllSpellNames();
  const savedSpells = await getSavedSpells();

  const spellsToFetch = spellList.filter((spell) => !savedSpells[spell.name]);
  console.log(
    `\nFound ${spellsToFetch.length} new spells:\n  - ${spellsToFetch
      .map((spell) => spell.name)
      .join('\n  - ')}\n`,
  );

  // TODO: refactor this to a single map
  // await rateLimitedMap(spellLists, ([className, spellList], i) => {
  //   console.log(i, new Date(), `Fetching ${className} spells ...`);
  //   return asyncMap(spellList, async (spell, j) => {
  //     if (savedSpells[spell.name]) {
  //       console.log(`\t${i}-${j}`, new Date(), `Found saved version of ${spell.name}, skipping`);
  //       return;
  //     }
  //     console.log(`\t${i}-${j}`, new Date(), `Fetching and saving ${spell.name} ...`);
  //     return executeThenWait(() => saveSpell(spell.url));
  //   });
  // });

  console.log('Done!');
};
