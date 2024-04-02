import { mkdir } from 'fs/promises';
import { CLASS_SPELL_LINKS } from './constants';
import { consoleLogEmphasis, nameFromUrl } from './util';

export const makeClassFolders = async () => {
  consoleLogEmphasis('Making Class Directories');

  await Promise.all(
    CLASS_SPELL_LINKS.map((url) => {
      const name = nameFromUrl(url);

      return mkdir(`${__dirname}/../../spells/${name}`);
    }),
  );

  console.log('Done!');
};
