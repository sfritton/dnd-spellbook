import type { Spell } from '../../../types';
import type { CharacterClassMap } from '../../HealthAndSpellSlots/types';
import { makeGetSpellCountByClass } from '../make-get-spell-count-by-class';

const BASE_SPELL: Spell.Details = {
  castingTime: '',
  components: '',
  description: [],
  duration: '',
  level: 1,
  levelAndSchool: '',
  range: '',
  source: '',
  spellLists: [],
  title: '',
};

describe('makeGetSpellCountByClass', () => {
  const testCases: {
    description: string;
    preparedSpells: Pick<Spell.Details, 'spellLists' | 'level'>[];
    characterClassMap: CharacterClassMap;
    output: Partial<Record<string, number>>;
  }[] = [
    {
      description: 'handles empty preparedSpells',
      preparedSpells: [],
      characterClassMap: { cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 } },
      output: {},
    },
    {
      description: 'handles empty character classes',
      preparedSpells: [{ level: 1, spellLists: ['cleric'] }],
      characterClassMap: {},
      output: { 'no-valid-classes': 1 },
    },
    {
      description: 'puts single class spells into their places',
      preparedSpells: [
        { level: 1, spellLists: ['cleric'] },
        { level: 1, spellLists: ['druid'] },
      ],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
        druid: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
      },
      output: { cleric: 1, druid: 1 },
    },
    {
      description: 'puts multi-class spells where they fit (part 1)',
      preparedSpells: [
        { level: 1, spellLists: ['cleric'] },
        { level: 1, spellLists: ['druid'] },
        { level: 1, spellLists: ['cleric', 'druid'] },
      ],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
        druid: { maxSpellLevel: 1, maxSpellsPrepared: 2 },
      },
      output: { cleric: 1, druid: 2 },
    },
    {
      description: 'puts multi-class spells where they fit (part 2)',
      preparedSpells: [
        { level: 1, spellLists: ['cleric'] },
        { level: 1, spellLists: ['druid'] },
        { level: 1, spellLists: ['cleric', 'druid'] },
      ],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 2 },
        druid: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
      },
      output: { cleric: 2, druid: 1 },
    },
    {
      description: 'puts multi-class spells where they fit (part 3)',
      preparedSpells: [
        { level: 1, spellLists: ['cleric', 'druid'] },
        { level: 1, spellLists: ['cleric', 'druid'] },
      ],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
        druid: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
      },
      output: { cleric: 1, druid: 1 },
    },
    {
      description:
        'forces multi-class spells into a single class bucket if there are no better options',
      preparedSpells: [
        { level: 1, spellLists: ['cleric'] },
        { level: 1, spellLists: ['druid'] },
        { level: 1, spellLists: ['cleric', 'druid'] },
        { level: 1, spellLists: ['cleric', 'druid'] },
      ],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 2 },
        druid: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
      },
      output: { cleric: 3, druid: 1 },
    },
    {
      description: 'puts a multi-class spell into the class that has the appropriate level',
      preparedSpells: [{ level: 2, spellLists: ['cleric', 'druid'] }],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
        druid: { maxSpellLevel: 2, maxSpellsPrepared: 1 },
      },
      output: { druid: 1 },
    },
    {
      description: "marks down prepared spells that don't fit into character classes",
      preparedSpells: [{ level: 2, spellLists: ['cleric'] }],
      characterClassMap: {
        cleric: { maxSpellLevel: 1, maxSpellsPrepared: 1 },
      },
      output: { 'no-valid-classes': 1 },
    },
  ];

  testCases.map(({ description, preparedSpells, characterClassMap, output }) =>
    it(description, () => {
      expect(
        makeGetSpellCountByClass(preparedSpells.map((spell) => ({ ...BASE_SPELL, ...spell })))(
          characterClassMap,
        ),
      ).toEqual(output);
    }),
  );
});
