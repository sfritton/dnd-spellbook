import { Checkbox } from '../../../../Checkbox';

const slugify = (str: string) => str.toLowerCase().replace(/ /g, '-');

export const FilterSection = ({ name, values }: { name: string; values: string[] }) => {
  return (
    <>
      <h4>{name}</h4>
      <Checkbox label="All" id={slugify(`${name}-all`)} />
      {values.map((value) => (
        <Checkbox key={value} label={value} id={slugify(`${name}-${value}`)} />
      ))}
    </>
  );
};
