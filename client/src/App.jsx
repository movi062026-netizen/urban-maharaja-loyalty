import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import WelcomeModal from './components/common/WelcomeModal';
import CookieConsent from './components/common/CookieConsent';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#f5ebde',
              color: '#2e1a14',
              border: '1px solid rgba(160, 58, 94, 0.25)',
              borderRadius: '14px',
              fontSize: '13px',
              fontFamily: 'Montserrat, system-ui, sans-serif',
              boxShadow: '0 12px 32px rgba(46, 26, 20, 0.12)',
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
        <WelcomeModal />
        <CookieConsent />
      </BrowserRouter>
    </AuthProvider>
  );
}
