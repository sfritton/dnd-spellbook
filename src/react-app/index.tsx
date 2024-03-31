import { createRoot } from 'react-dom/client';

const container = document.getElementById('react-app');

if (container) {
  const root = createRoot(container);
  root.render(<h1>Hello World!</h1>);
}
