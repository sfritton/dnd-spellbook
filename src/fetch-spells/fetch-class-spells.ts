import { load } from 'cheerio';
import { fetchDndPage } from './fetch-dnd-page';
import { rateLimitedMap } from './rate-limited-map';
import { writeFile } from 'fs/promises';
import { consoleLogEmphasis, nameFromUrl } from './util';

const CLASS_SPELL_LINKS = [
  '/spells:artificer',
  '/spells:bard',
  '/spells:cleric',
  '/spells:druid',
  '/spells:eldritch-knight',
  '/spells:paladin',
  '/spells:ranger',
  '/spells:arcane-trickster',
  '/spells:sorcerer',
  '/spells:warlock',
  '/spells:wizard',
];

/** Fetches each class's spell list, and saves them in spells/spell-lists.json */
export const fetchClassSpellLists = async () => {
  consoleLogEmphasis('FETCHING CLASS SPELL LISTS');
  let classSpellLists: Record<string, { name: string; url: string; level: number }[]> = {};

  await rateLimitedMap(CLASS_SPELL_LINKS, async (url, i) => {
    console.log(i, new Date(), `Fetching spells from ${url} ...`);
    const pageHTML = await fetchDndPage(url).then((response) => response.text());
    const dom = load(pageHTML);

    const spellLevels = dom('.yui-nav a > em')
      .toArray()
      .map((em) =>
        Number.parseInt(
          // @ts-expect-error -- this should be a text node, but TS can't recognize that
          em.children[0].data?.match(/^[0-9]/)?.[0] ?? '0',
          10,
        ),
      );

    const getSpellUrlsByLevel = (level: number, tabIndex: number) =>
      dom(`#wiki-tab-0-${tabIndex} td > a`)
        .map((_, anchor) => {
          const url = anchor.attribs['href'];

          return {
            url,
            name: nameFromUrl(url),
            level,
          };
        })
        .toArray();

    const spellUrls = spellLevels.map((level, i) => getSpellUrlsByLevel(level, i)).flat();

    classSpellLists[nameFromUrl(url)] = spellUrls;
  });

  console.log('Saving results ...');

  await writeFile(
    `${__dirname}/../../spells/spell-lists.json`,
    JSON.stringify(classSpellLists, null, 2),
  );

  console.log('Done!');
};
