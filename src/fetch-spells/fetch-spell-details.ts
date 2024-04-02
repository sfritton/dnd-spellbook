import * as SPELL_LISTS from '../../spells/spell-lists.json';
import { rateLimitedMap } from './rate-limited-map';
import { saveSpell } from './save-spell';
import { consoleLogEmphasis } from './util';

export const fetchSpellDetails = async () => {
  consoleLogEmphasis('Fetching Spell Details');
  const spellLists = Object.entries(SPELL_LISTS);

  await rateLimitedMap(spellLists.slice(0, 2), ([className, spellList], i) => {
    console.log(i, new Date(), `Fetching ${className} spells ...`);
    return rateLimitedMap(spellList.slice(0, 2), (spell, j) => {
      console.log(`\t${i}-${j}`, new Date(), `Fetching and saving ${spell.name} ...`);
      return saveSpell(spell.url, className);
    });
  });

  console.log('Done!');
};
