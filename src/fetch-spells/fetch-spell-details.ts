import { readdir } from 'fs/promises';
import { consoleLogEmphasis, nameFromUrl } from './util';
import { fetchDndPage } from './fetch-dnd-page';
import { load } from 'cheerio';
import { rateLimitedMap } from './rate-limited-map';
import { saveSpell } from './save-spell';
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

  await rateLimitedMap(spellsToFetch, (spell, i) => {
    console.log(
      `${i + 1}/${spellsToFetch.length}`,
      new Date(),
      `Fetching and saving ${spell.name} ...`,
    );
    return saveSpell(spell.url);
  });

  console.log('Done!');
};
