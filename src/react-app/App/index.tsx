import { Header } from '../Header';
import { Spellbook } from '../Spellbook';
import { SpellListContextProvider } from '../SpellListContext';
import { DialogProvider } from '../Dialog';
import { SettingsContextProvider } from '../SettingsContext';

export const App = () => {
  return (
    <SettingsContextProvider>
      <SpellListContextProvider>
        <DialogProvider>
          <Header />
          <main>
            <Spellbook />
          </main>
        </DialogProvider>
      </SpellListContextProvider>
    </SettingsContextProvider>
  );
};
