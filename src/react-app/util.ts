import { spellDetails } from '../constants/spell-details';

export const formatSpellLevel = (level: number, isPlural = false) =>
  level === 0
    ? `Cantrip${isPlural ? 's' : ''}`
    : level === 1
      ? '1st-Level'
      : level === 2
        ? '2nd-Level'
        : level === 3
          ? '3rd-Level'
          : `${level}th-Level`;

export const getDescriptionLength = (id: string) => {
  const { description } = spellDetails[id] ?? {};

  if (!description) return 0;

  return description.join('').length;
};

export const classNames = (...classNames: (Record<string, boolean> | string | undefined)[]) =>
  classNames
    .flatMap((className) =>
      typeof className === 'undefined'
        ? []
        : typeof className === 'string'
          ? [className]
          : Object.entries(className).flatMap(([name, value]) => (value ? [name] : [])),
    )
    .join(' ');
