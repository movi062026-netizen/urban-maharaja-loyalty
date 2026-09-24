import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
      <Navbar />
      <main className="flex-1 w-full bg-background pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
