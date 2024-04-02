import { readFile, writeFile } from 'fs/promises';
import SPELL_LISTS from '../../data/spell-lists.json';

const DATA_DIRECTORY_PATH = `${__dirname}/../../../data`;

const transformName = (name: string) => name.replace(/-/g, '_');

Object.entries(SPELL_LISTS).map(([className, spells]) => {
  const imports = spells
    .map(({ name }) => `import ${transformName(name)} from '../spells/${name}.json';`)
    .join('\n');

  const spellNames = spells.map(({ name }) => transformName(name)).join(',\n  ');

  writeFile(
    `${DATA_DIRECTORY_PATH}/class-spell-lists/${className}.ts`,
    `${imports}

export const spellDetails = { 
  ${spellNames}
};

export const spellList = ${JSON.stringify(spells, null, 2)};
    `,
  );
});
