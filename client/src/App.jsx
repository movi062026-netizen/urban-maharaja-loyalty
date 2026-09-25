import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#210e11',
              color: '#ffffff',
              border: '1px solid rgba(222, 107, 144, 0.4)',
              borderRadius: '14px',
              fontSize: '13px',
              fontFamily: 'Montserrat, system-ui, sans-serif',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.75)',
            },
            success: {
              iconTheme: { primary: '#de6b90', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />

        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
