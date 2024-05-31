import { Header } from '../Header';
import { Spellbook } from '../Spellbook';
import { SpellListContextProvider } from '../SpellListContext';
import { DialogProvider } from '../Dialog';
import { SettingsContextProvider } from '../SettingsContext';
import { HealthAndSpellSlots } from '../HealthAndSpellSlots';

export const App = () => {
  return (
    <SettingsContextProvider>
      <SpellListContextProvider>
        <DialogProvider>
          <Header />
          <main>
            <HealthAndSpellSlots />
            <Spellbook />
          </main>
        </DialogProvider>
      </SpellListContextProvider>
    </SettingsContextProvider>
  );
};
