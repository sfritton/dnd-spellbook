import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { QueryTest } from './QueryTest';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <h1>Howdy</h1>
    {/* <QueryTest /> */}
  </QueryClientProvider>
);
