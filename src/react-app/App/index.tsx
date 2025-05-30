import { Header } from '../Header';
import { Spellbook } from '../Spellbook';
import { SpellListContextProvider } from '../SpellListContext';
import { DialogProvider } from '../Dialog';
import { SettingsContextProvider } from '../SettingsContext';
import { HealthAndSpellSlots } from '../HealthAndSpellSlots';
import { FilterContextProvider } from '../FilterContext';
import { PrintSection } from '../PrintSection';

export const App = () => {
  return (
    <SettingsContextProvider>
      <FilterContextProvider>
        <SpellListContextProvider>
          <DialogProvider>
            <Header />
            <PrintSection />
            <main>
              <Spellbook />
              <HealthAndSpellSlots />
            </main>
          </DialogProvider>
        </SpellListContextProvider>
      </FilterContextProvider>
    </SettingsContextProvider>
  );
};
