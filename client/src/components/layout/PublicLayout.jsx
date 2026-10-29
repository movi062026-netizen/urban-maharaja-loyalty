import { Outlet } from 'react-router-dom';
import { Home, UtensilsCrossed, CreditCard, CalendarCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const portalPath = (role) => (role === 'ADMIN' ? '/admin/dashboard' : role === 'STAFF' ? '/staff/dashboard' : '/guest/card');

export default function PublicLayout() {
  const { user } = useAuth();

  const tabs = [
    { to: '/', label: 'tab.home', icon: Home },
    { to: '/menu', label: 'tab.menu', icon: UtensilsCrossed },
    { to: '/loyalty', label: 'tab.card', icon: CreditCard, featured: true },
    { to: '/contact', label: 'tab.reserve', icon: CalendarCheck },
    user
      ? { to: portalPath(user.role), label: 'tab.account', icon: User }
      : { to: '/login', label: 'tab.login', icon: User, match: ['/login', '/register'] },
  ];

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background text-on-surface antialiased overflow-x-hidden w-full max-w-full pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden bg-background pt-20" role="main">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav items={tabs} />
    </div>
  );
}
