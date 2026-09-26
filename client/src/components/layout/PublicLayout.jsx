import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background text-on-surface antialiased overflow-x-hidden w-full max-w-full">
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden bg-background pt-20" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
