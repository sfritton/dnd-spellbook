import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Spell } from '../types';
import { spellDetails } from '../../constants/spell-details';

export const DEFAULT_FILTERS = {
  casting_time: {
    action: false,
    bonus_action: false,
    reaction: false,
    other: false,
  },
  components: {
    v: false,
    s: false,
    m: false,
  },
  concentration: {
    concentration: false,
    non_concentration: false,
  },
  ritual: {
    ritual: false,
    non_ritual: false,
  },
};

export type Filters = typeof DEFAULT_FILTERS;

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

export const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
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

      return true;
    },
    [filters],
  );

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
