import { Link } from 'react-router-dom';
import { Crown, Star, Gift, CreditCard, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-deep-brown">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full border border-royal-gold/30" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border border-royal-rose/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-royal-gold/10" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full border-2 border-royal-gold/30 bg-royal-gold/5">
              <Crown className="w-10 h-10 sm:w-14 sm:h-14 text-royal-gold" />
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white mb-4 leading-tight">
            Urban <span className="text-royal-rose">Maharaja</span>
          </h1>
          <p className="text-royal-gold tracking-[0.3em] text-sm mb-8 uppercase">A Fine Dine</p>

          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Where royalty meets culinary excellence. Dine like a king and earn exclusive royal rewards
            with every visit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/loyalty" className="btn-royal text-base px-8 py-3.5 no-underline inline-flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> Explore Maharaja Card
            </Link>
            <Link to="/menu" className="btn-outline text-base px-8 py-3.5 no-underline inline-flex items-center justify-center gap-2 border-white/30 text-white/70 hover:bg-white/10 hover:text-white">
              View Royal Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Arch decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-cream" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section className="py-20 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-royal-gold uppercase tracking-[0.2em] mb-2">Loyalty Program</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-deep-brown mb-4">Your Royal Journey</h2>
            <p className="text-deep-brown/60 max-w-lg mx-auto">
              Earn royal stamps with every visit and unlock exclusive rewards fit for a Maharaja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Visit & Dine',
                desc: 'Enjoy our exquisite royal cuisine. Each visit earns you a stamp on your Maharaja Card.',
                step: '01',
              },
              {
                icon: CreditCard,
                title: 'Collect Stamps',
                desc: 'Watch your progress grow. Staff verifies your visit and approves your royal stamp.',
                step: '02',
              },
              {
                icon: Gift,
                title: 'Unlock Rewards',
                desc: 'Complete your card and unlock exclusive royal rewards — complimentary dishes, discounts, and more.',
                step: '03',
              },
            ].map(({ icon: Icon, title, desc, step }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-royal hover:shadow-royal-lg transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-royal-rose/10 flex items-center justify-center group-hover:bg-royal-rose/20 transition-colors">
                    <Icon className="w-6 h-6 text-royal-rose" />
                  </div>
                  <span className="text-3xl font-serif text-warm-beige">{step}</span>
                </div>
                <h3 className="font-serif text-xl text-deep-brown mb-3">{title}</h3>
                <p className="text-sm text-deep-brown/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-deep-brown relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-32 h-32 rounded-full border border-royal-gold" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-royal-gold mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Begin Your Royal Journey</h2>
          <p className="text-white/50 mb-8 text-lg">
            Scan the QR code at your table or sign up to start collecting stamps and earning rewards today.
          </p>
          <Link to="/login" className="btn-gold text-base px-10 py-3.5 no-underline inline-flex items-center gap-2">
            <Crown className="w-5 h-5" /> Get Your Maharaja Card
          </Link>
        </div>
      </section>
    </div>
  );
}
