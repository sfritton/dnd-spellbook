import { readFile, readdir, writeFile } from 'fs/promises';
import SPELL_LISTS from '../../data/spell-lists.json';

const DATA_DIRECTORY_PATH = `${__dirname}/../../../data`;

const generateSpellList = async (name: string, spellFileNames: string[]) => {
  const spells = await Promise.all(
    spellFileNames.map(async (spellFileName) => {
      const spellFile = await readFile(`${DATA_DIRECTORY_PATH}/spells/${spellFileName}`, 'utf8');

      const { title, level } = JSON.parse(spellFile);
      const id = spellFileName.replace(/\.json$/, '');

      return {
        id,
        title,
        level,
        url: `http://dnd5e.wikidot.com/spell:${id}`,
      };
    }),
  );

  const emptyHistogram = new Array(10).fill([]);

  const spellsByLevel = spells.reduce((histogram, spell) => {
    return histogram.map((leveledSpells, level) => [
      ...leveledSpells,
      ...(level === spell.level ? [spell] : []),
    ]);
  }, emptyHistogram);

  return writeFile(
    `${__dirname}/../../../src/constants/spells/${name}.json`,
    JSON.stringify(spellsByLevel, null, 2),
  );
};

const generateSpellTypescriptImports = async (spellFileNames: string[]) => {
  const imports = spellFileNames.map(
    (spellFileName, index) => `import spell${index} from '../../data/spells/${spellFileName}';`,
  );
  const exports = spellFileNames.map(
    (spellFileName, index) => `  '${spellFileName.replace(/\.json$/, '')}': spell${index},`,
  );

  const fileText = [...imports, '', 'export const spellDetails = {', ...exports, '};'].join('\n');

  return writeFile(`${__dirname}/../../../src/constants/spell-details.ts`, fileText);
};

const generateSpellLists = async () => {
  const spellFileNames = await readdir(`${DATA_DIRECTORY_PATH}/spells`);

  generateFilters(spellFileNames);

  generateSpellList('all', spellFileNames);
  Object.entries(SPELL_LISTS).map(([className, spells]) =>
    generateSpellList(
      className,
      spells.map((spell) => `${spell.name}.json`),
    ),
  );

  generateSpellTypescriptImports(spellFileNames);
};

const generateFilters = async (spellFileNames: string[]) => {
  const emptyHistograms = {
    castingTime: {},
    components: {},
    concentration: {},
    duration: {},
    range: {},
    ritual: {},
  };

  const spells = await Promise.all(
    spellFileNames.map(async (spellFileName) => {
      const spellFile = await readFile(`${DATA_DIRECTORY_PATH}/spells/${spellFileName}`, 'utf8');

      return JSON.parse(spellFile);
    }),
  );

  const filterHistograms = spells.reduce((acc, spell) => {
    const { castingTime, components, range, duration } = spell;

    return {
      castingTime: { ...acc.castingTime, [castingTime.toLowerCase().split(',')[0]]: true },
      // components: { ...acc.components, [components]: true },
      duration: { ...acc.duration, [duration]: true },
      range: { ...acc.range, [range]: true },
    };
  }, emptyHistograms);

  const filterLists = Object.fromEntries(
    Object.entries(filterHistograms).map(([key, value]) => [key, Object.keys(value).sort()]),
  );

  return writeFile(
    `${__dirname}/../../../src/constants/filter-histograms.json`,
    JSON.stringify(filterLists, null, 2),
  );
};

generateSpellLists();

// Object.entries(SPELL_LISTS).map(([className, spells]) => {
//   const imports = spells
//     .map(({ name }) => `import ${transformName(name)} from '../spells/${name}.json';`)
//     .join('\n');

//   const spellNames = spells.map(({ name }) => transformName(name)).join(',\n  ');

//   writeFile(
//     `${DATA_DIRECTORY_PATH}/class-spell-lists/${className}.ts`,
//     `${imports}

// export const spellDetails = {
//   ${spellNames}
// };

// export const spellList = ${JSON.stringify(spells, null, 2)};
//     `,
//   );
// });
