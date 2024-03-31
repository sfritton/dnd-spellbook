import { useQuery } from '@tanstack/react-query';

interface ClassSpellsResponse {
  data?: {
    spells?: Spell[];
  };
}

interface Spell {
  index?: string;
  level?: number;
  name?: string;
}

export const useQueryClassSpells = ({ selectedClass }: { selectedClass: string }) => {
  const query = useQuery({
    queryKey: ['class-spells'],
    queryFn: () =>
      fetch('https://www.dnd5eapi.co/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              spells(class: "${selectedClass}", level: 1) {
                index
                level
                name
              }
            }
          `,
        }),
      }).then((response) => response.json() as Promise<ClassSpellsResponse>),
  });

  return query;
};
