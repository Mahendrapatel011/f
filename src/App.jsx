import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;
