import { spellDetails } from '../constants/spell-details';

export const formatSpellLevel = (level: number, isPlural = false) => {
  switch (level) {
    case 0:
      return `Cantrip${isPlural ? 's' : ''}`;
    case 1:
      return '1st-Level';
    case 2:
      return '2nd-Level';
    case 3:
      return '3rd-Level';
    default:
      return `${level}th-Level`;
  }
};

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

export type StateFunctionParameter<T> = T | ((prevValue: T) => T);
export type StateFunction<T> = (valueOrFn: StateFunctionParameter<T>) => void;

// biome-ignore lint/suspicious/noExplicitAny: Valid use of any
const isStateFunction = <T>(value: any): value is (prevValue: T) => T => {
  return typeof value === 'function';
};

export const getStateValue = <T>(valueOrFn: StateFunctionParameter<T>, prev: T): T =>
  isStateFunction<T>(valueOrFn) ? valueOrFn(prev) : valueOrFn;
