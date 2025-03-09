import { Header } from '../Header';
import { Spellbook } from '../Spellbook';
import { SpellListContextProvider } from '../SpellListContext';
import { DialogProvider } from '../Dialog';
import { SettingsContextProvider } from '../SettingsContext';
import { HealthAndSpellSlots } from '../HealthAndSpellSlots';
import { FilterContextProvider } from '../FilterContext';

export const App = () => {
  return (
    <SettingsContextProvider>
      <FilterContextProvider>
        <SpellListContextProvider>
          <DialogProvider>
            <Header />
            <main>
              <HealthAndSpellSlots />
              <Spellbook />
            </main>
          </DialogProvider>
        </SpellListContextProvider>
      </FilterContextProvider>
    </SettingsContextProvider>
  );
};
