import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { SpellListContextProvider } from './SpellListContext';
import { DialogProvider } from './Dialog';

const container = document.getElementById('react-app');

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <SpellListContextProvider>
        <DialogProvider>
          <App />
        </DialogProvider>
      </SpellListContextProvider>
    </StrictMode>,
  );
}
