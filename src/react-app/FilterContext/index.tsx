import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Spell } from '../types';
import { spellDetails } from '../../constants/spell-details';

export interface Filters {
  casting_time: {
    action: boolean;
    bonus_action: boolean;
    reaction: boolean;
    other: boolean;
  };
  components: {
    v: boolean;
    s: boolean;
    m: boolean;
  };
  concentration: {
    concentration: boolean;
    non_concentration: boolean;
  };
  ritual: {
    ritual: boolean;
    non_ritual: boolean;
  };
}

interface FilterContextValue {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  getShouldShowSpell: (spell: Spell.Summary) => void;
}

const DEFAULT_FILTERS: Filters = {
  casting_time: {
    action: true,
    bonus_action: true,
    reaction: true,
    other: true,
  },
  components: {
    v: true,
    s: true,
    m: true,
  },
  concentration: {
    concentration: true,
    non_concentration: true,
  },
  ritual: {
    ritual: true,
    non_ritual: true,
  },
};

const FilterContext = createContext<FilterContextValue>({
  filters: DEFAULT_FILTERS,
  setFilters: () => {},
  getShouldShowSpell: () => {},
});

export const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const getShouldShowSpell = useCallback((spellSummary: Spell.Summary) => {
    const spell = spellDetails[spellSummary.id];

    // TODO: compare spell to filters and choose whether or not to display
    return true;
  }, []);

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
