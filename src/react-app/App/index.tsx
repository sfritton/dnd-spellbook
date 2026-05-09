import { AbilityContextProvider } from '../AbilityContext';
import { DialogProvider } from '../Dialog';
import { FilterContextProvider } from '../FilterContext';
import { Header } from '../Header';
import { HealthAndSpellSlots } from '../HealthAndSpellSlots';
import { PrintSection } from '../PrintSection';
import { SettingsContextProvider } from '../SettingsContext';
import { Spellbook } from '../Spellbook';
import { SpellListContextProvider } from '../SpellListContext';

export const App = () => {
  return (
    <AbilityContextProvider>
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
    </AbilityContextProvider>
  );
};
