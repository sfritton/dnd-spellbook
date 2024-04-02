import { load } from 'cheerio';
import { writeFile } from 'fs/promises';
import { fetchDndPage } from './fetch-dnd-page';
import { SPELL_DIRECTORY_PATH } from './constants';

const parseSpellPage = async (url: string) => {
  const response = await fetchDndPage(url);
  const text = await response.text();
  const dom = load(text);

  const title = dom('.page-title').text();
  const pageContents = dom('#page-content').text();
  const [_, source, levelAndSchool, castingTime, range, components, duration, ...description] =
    pageContents.replace(/\n+/g, '\n').split('\n');

  const spellLists = dom('#page-content a')
    .map((_, anchor) => anchor.attribs['href'])
    .toArray();

  return {
    title,
    source: source.replace(/^Source: /i, ''),
    levelAndSchool,
    level: Number.parseInt(levelAndSchool.match(/^[0-9]/)?.[0] ?? '0', 10),
    castingTime: castingTime.replace(/^Casting Time: /i, ''),
    range: range.replace(/^Range: /i, ''),
    components: components.replace(/^Components: /i, ''),
    duration: duration.replace(/^Duration: /i, ''),
    description: description.filter((line) => line !== '' && !/^Spell Lists\./i.test(line)),
    spellLists,
    // pageContents,
  };
};

export const saveSpell = async (url: string) => {
  const spell = await parseSpellPage(url);
  writeFile(
    `${SPELL_DIRECTORY_PATH}/${url.replace(/^\/spell:/i, '')}.json`,
    JSON.stringify(spell, null, 2),
  );
};
