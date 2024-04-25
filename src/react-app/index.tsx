import { createRoot } from 'react-dom/client';
import { App } from './App';
import { SpellListContextProvider } from './SpellListContext';

const container = document.getElementById('react-app');

if (container) {
  const root = createRoot(container);
  root.render(
    <SpellListContextProvider>
      <App />
    </SpellListContextProvider>,
  );
}
