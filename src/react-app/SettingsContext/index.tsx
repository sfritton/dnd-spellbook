import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type HighlightKey =
  | 'castingTime'
  | 'isRitual'
  | 'isConcentration'
  | 'range'
  | 'components'
  | 'duration';

interface SettingsContextValue {
  isCardMode: boolean;
  hideKnownSpells: boolean;
  highlights: HighlightKey[];
  setIsCardMode: (isCardMode: boolean) => void;
  setHideKnownSpells: (hideKnownSpells: boolean) => void;
  makeUpdateHighlight: (index: number) => (highlight: HighlightKey) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  isCardMode: false,
  hideKnownSpells: false,
  highlights: [],
  setIsCardMode: () => {},
  setHideKnownSpells: () => {},
  makeUpdateHighlight: () => () => {},
});

export const SettingsContextProvider = ({ children }: PropsWithChildren) => {
  const [isCardMode, setIsCardMode] = useState(false);
  const [hideKnownSpells, setHideKnownSpells] = useState(false);
  const [highlights, setHighlights] = useState<HighlightKey[]>([
    'castingTime',
    'isRitual',
    'isConcentration',
  ]);

  const makeUpdateHighlight = useCallback(
    (index: number) => (highlight: HighlightKey) => {
      setHighlights((prevHighlights) => {
        const newHighlights = [...prevHighlights];
        newHighlights[index] = highlight;

        return newHighlights;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      isCardMode,
      setIsCardMode,
      hideKnownSpells,
      setHideKnownSpells,
      highlights,
      makeUpdateHighlight,
    }),
    [
      isCardMode,
      setIsCardMode,
      hideKnownSpells,
      setHideKnownSpells,
      highlights,
      makeUpdateHighlight,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = () => useContext(SettingsContext);
