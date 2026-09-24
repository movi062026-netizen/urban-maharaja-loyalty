import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid imperial email address');
      return;
    }
    toast.success('Your imperial invitation to the Maharaja Gazette has been dispatched!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface-variant" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Provenance */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <img
                alt="Urban Maharaja logo"
                className="h-10 w-10 object-cover rounded-full border border-primary/40 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXfNDYsMNpYnQyhMne22oWb4DIfAUVqXueX3fQTazODkKNaq6IpvuCe6yu7lv8L_lhENbBqd1cgSUVpqme1pDmXcF8kdOmsWW-xz4nTkD3tAJqwgEzZwvhUD_OtagFfWDTLe9rV4m0bd-kPRK7TbG269RThlqZhCdLFfV5bpAw7-c3L8UwduSZx61Qj3VRfiR96AzL9LrhoyzWY2fbYfPnnGaCG2XoTN48W0PTqBxGbc3rkEUpl_vp3g"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm uppercase tracking-[0.2em] text-primary font-bold">
                  Urban Maharaja
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-secondary">
                  Imperial Gastronomy
                </span>
              </div>
            </Link>

            <p className="font-body-sm text-body-sm text-on-surface-variant/80 leading-relaxed">
              An ultra-luxurious dining sanctuary breathing the majestic grandeur of Rajasthan and imperial Mughal courts into modern culinary artistry.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-primary/20 text-primary w-fit">
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.22em]">Michelin Standard 2026</span>
            </div>
          </div>

          {/* Imperial Portals */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-title-md text-title-md text-on-surface uppercase tracking-widest text-primary">
              Imperial Portals
            </h4>
            <ul className="space-y-2.5 font-body-sm text-body-sm list-none p-0">
              <li>
                <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  Our Royal Heritage
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  The Degustation Menu
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  Maharaja Privileges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  The Royal Chef's Table
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors no-underline">
                  Jharokha Private Banquets
                </Link>
              </li>
            </ul>
          </div>

          {/* Palace & Hours */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-title-md text-title-md text-on-surface uppercase tracking-widest text-primary">
              Palace & Hours
            </h4>
            <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">schedule</span>
                <div>
                  <p className="text-on-surface font-medium mb-0.5">Royal Dining Hours</p>
                  <p className="text-on-surface-variant/80">Mon – Sun: 12:00 PM – 11:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">location_on</span>
                <div>
                  <p className="text-on-surface font-medium mb-0.5">Imperial Pavilion</p>
                  <p className="text-on-surface-variant/80">Plot No. AC-209, Central Spine, Mahal Road, Jagatpura, Jaipur, Rajasthan 302017</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">call</span>
                <div>
                  <p className="text-on-surface font-medium mb-0.5">VIP Concierge</p>
                  <p className="text-on-surface-variant/80">+1 (800) MAHARAJA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maharaja Gazette */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-title-md text-title-md text-on-surface uppercase tracking-widest text-primary">
              Maharaja Gazette
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant/80">
              Receive confidential invitations to seasonal royal tastings and rare vintage releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your imperial address..."
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="mt-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-label-md text-label-md uppercase tracking-[0.16em] font-semibold hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  Subscribe to Gazette
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant/70 border-t border-outline-variant/20">
          <p>© {new Date().getFullYear()} Urban Maharaja — A Fine Dine. All Imperial Rights Reserved.</p>
          <div className="flex items-center gap-6 font-label-sm text-label-sm uppercase tracking-[0.22em]">
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Privacy Policy
            </Link>
            <span className="text-outline-variant">•</span>
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Terms of Royal Service
            </Link>
            <span className="text-outline-variant">•</span>
            <Link to="/about" className="hover:text-primary transition-colors no-underline">
              Guest Dress Code
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
