import { load } from 'cheerio';
import { saveSpell } from './save-spell';
import { fetchDndPage } from './fetch-dnd-page';
import { rateLimitedForEach, setRandomInterval } from './set-random-interval';

const headers: HeadersInit = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.5',
  'cache-control': 'max-age=0',
  'sec-gpc': '1',
  'upgrade-insecure-requests': '1',
};

const options = {
  headers,
  body: null,
  method: 'GET',
};

// const fetchSpellsByClass = async (url: string) => {
//   const response = await fetchDndPage(url);

//   const text = await response.text();

//   const dom = load(text);

//   const spellUrls = dom('td > a').map((_, anchor) =>
//     anchor.attribs['href']
//   ).toArray();
// };

// fetchSpellList();
// saveSpell('/spell:bless');

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

const fetchSpellsByClass = async () => {
  await rateLimitedForEach(CLASS_SPELL_LINKS, (link, i) => console.log(i, new Date(), link));

  console.log('Done');
};

fetchSpellsByClass();
