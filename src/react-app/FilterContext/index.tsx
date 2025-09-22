import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Spell } from '../types';
import { spellDetails } from '../../constants/spell-details';
import { DEFAULT_FILTERS, Filters } from './constants';

export { DEFAULT_FILTERS, Filters } from './constants';

interface FilterContextValue {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  getShouldShowSpell: (spell: Spell.Summary) => void;
}

const FilterContext = createContext<FilterContextValue>({
  filters: DEFAULT_FILTERS,
  setFilters: () => {},
  getShouldShowSpell: () => {},
});

const getDefaultFilters = (): Filters => {
  const storedString = localStorage.getItem('filters');

  if (!storedString) return DEFAULT_FILTERS;

  return JSON.parse(storedString);
};

export const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState(getDefaultFilters());
  const getShouldShowSpell = useCallback(
    (spellSummary: Spell.Summary) => {
      const spell = spellDetails[spellSummary.id] as Spell.Details;

      // Casting Time
      const areAllCastingTimesValid = Object.values(filters.casting_time).every((value) => !value);

      if (!areAllCastingTimesValid) {
        const isAction = /1 action/gi.test(spell.castingTime);
        const isBonusAction = /1 bonus action/gi.test(spell.castingTime);
        const isReaction = /reaction/gi.test(spell.castingTime);
        const isOther = !isAction && !isBonusAction && !isReaction;

        if (!filters.casting_time.action && isAction) return false;
        if (!filters.casting_time.bonus_action && isBonusAction) return false;
        if (!filters.casting_time.reaction && isReaction) return false;
        if (!filters.casting_time.other && isOther) return false;
      }

      // Components
      const areAllComponentsValid = Object.values(filters.components).every((value) => !value);

      if (!areAllComponentsValid) {
        const isV = /v/gi.test(spell.components);
        const isS = /s/gi.test(spell.components);
        const isM = /m/gi.test(spell.components);

        if (!filters.components.v && isV) return false;
        if (!filters.components.s && isS) return false;
        if (!filters.components.m && isM) return false;
      }

      // Concentration
      const areAllConcentrationsValid = Object.values(filters.concentration).every(
        (value) => !value,
      );

      if (!areAllConcentrationsValid) {
        const isConcentration = /concentration/i.test(spell.duration);

        if (!filters.concentration.concentration && isConcentration) return false;
        if (!filters.concentration.non_concentration && !isConcentration) return false;
      }

      // Ritual
      const areAllRitualsValid = Object.values(filters.ritual).every((value) => !value);

      if (!areAllRitualsValid) {
        const isRitual = /ritual/i.test(spell.levelAndSchool);

        if (!filters.ritual.ritual && isRitual) return false;
        if (!filters.ritual.non_ritual && !isRitual) return false;
      }

      // Sources
      const areAllSourcesValid = Object.values(filters.sources).every((value) => !value);

      if (!areAllSourcesValid && !filters.sources[spell.source]) return false;

      return true;
    },
    [filters],
  );

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      getShouldShowSpell,
    }),
    [filters, getShouldShowSpell],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilterContext = () => useContext(FilterContext);
