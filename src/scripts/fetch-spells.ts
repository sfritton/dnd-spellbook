import { load } from 'cheerio';
import { saveSpell } from './save-spell';
import { fetchDndPage } from './fetch-dnd-page';
import { rateLimitedForEach } from './rate-limited-for-each';
import { writeFile } from 'fs/promises';

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

const fetchSpellListsByClass = async () => {
  let classSpellLists: Record<string, string[]> = {};

  // TODO: only doing a couple for now
  await rateLimitedForEach(CLASS_SPELL_LINKS.slice(0, 2), async (url, i) => {
    console.log(i, new Date(), `Fetching spells from ${url} ...`);
    const pageHTML = await fetchDndPage(url).then((response) => response.text());
    const dom = load(pageHTML);

    const spellUrls = dom('td > a')
      .map((_, anchor) => anchor.attribs['href'])
      .toArray();

    classSpellLists[url] = spellUrls;
  });

  console.log('Saving results ...');

  await writeFile(
    `${__dirname}/../../spells/spell-lists.json`,
    JSON.stringify(classSpellLists, null, 2),
  );

  console.log('Done');
};

fetchSpellListsByClass();
