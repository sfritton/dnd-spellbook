import { useQueryClassSpells } from './queries/use-query-class-spells';

export const QueryTest = () => {
  const result = useQueryClassSpells({ selectedClass: 'paladin' });

  console.log(result.data?.data.spells.sort((a, b) => a.index?.localeCompare(b.index)));
};
