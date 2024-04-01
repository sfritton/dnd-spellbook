import { CheerioAPI, load } from 'cheerio';
import { writeFile } from 'fs/promises';

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

const fetchFromApi = (url: string) => fetch(`http://dnd5e.wikidot.com${url}`, options);

const parseSpellPage = async (url: string) => {
  const response = await fetchFromApi(url);
  const text = await response.text();
  const dom = load(text);

  const title = dom('.page-title').text();
  const pageContents = dom('#page-content').text();
  const [_, source, level, castingTime, range, components, duration, ...description] = pageContents
    .replace(/\n+/g, '\n')
    .split('\n');

  return {
    title,
    source: source.replace(/^Source: /i, ''),
    level,
    castingTime: castingTime.replace(/^Casting Time: /i, ''),
    range: range.replace(/^Range: /i, ''),
    components: components.replace(/^Components: /i, ''),
    duration: duration.replace(/^Duration: /i, ''),
    description,
    // pageContents,
  };
};

const saveSpell = async (url: string) => {
  const spell = await parseSpellPage(url);
  writeFile(
    `${__dirname}/../../spells/${url.replace(/^\/spell:/i, '')}.json`,
    JSON.stringify(spell, null, 2),
  );
};

const fetchSpellList = async () => {
  const response = await fetchFromApi('/spells:paladin');
  // const response = await fetchFromApi('/spell:bless');

  const text = await response.text();

  const dom = load(text);

  dom('#wiki-tab-0-0 td > a').each((_, anchor) => {
    const url = anchor.attribs['href'];
    saveSpell(url);
  });
};

fetchSpellList();
// saveSpell('/spell:bless');
