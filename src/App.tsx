import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { PageHeaderProvider } from './context/PageHeaderContext';

function App() {
  return (
    <BrowserRouter>
      <PageHeaderProvider>
        <AppRoutes />
      </PageHeaderProvider>
    </BrowserRouter>
  );
}

export default App;
