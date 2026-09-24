import { Link, useSearchParams } from 'react-router-dom';
import { Crown, CreditCard, Gift, Star, Shield, ArrowRight } from 'lucide-react';
import MaharajaCard from '../../components/loyalty/MaharajaCard';

export default function LoyaltyLandingPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');

  return (
    <div>
      {/* Hero */}
      <section className="bg-deep-brown py-16 sm:py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <Crown className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl sm:text-5xl text-white mb-4">Digital Maharaja Card</h1>
          <p className="text-white/50 text-lg mb-8">Your Royal Loyalty Companion</p>

          <Link to="/login" className="btn-gold text-base px-8 py-3.5 no-underline inline-flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Get Your Card
          </Link>
          {source && (
            <p className="text-white/30 text-xs mt-4">Welcome from {source}</p>
          )}
        </div>
      </section>

      {/* Demo Card */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-md mx-auto">
          <p className="text-center text-sm text-deep-brown/50 mb-6 uppercase tracking-widest">Preview</p>
          <MaharajaCard
            guestName="Royal Guest"
            currentStamps={3}
            targetStamps={5}
            cycleNumber={1}
            isComplete={false}
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-deep-brown text-center mb-12">Royal Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'Digital Card', desc: 'Access your card anytime on your phone — no app download required.' },
              { icon: Star, title: 'Earn Stamps', desc: 'Every verified visit earns you a royal stamp towards your reward.' },
              { icon: Gift, title: 'Unlock Rewards', desc: 'Complete your card and enjoy complimentary treats and exclusive offers.' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected. No spam. Just royal rewards.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl hover:bg-cream transition-colors">
                <div className="w-12 h-12 rounded-full bg-royal-rose/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-royal-rose" />
                </div>
                <h3 className="font-serif text-lg text-deep-brown mb-2">{title}</h3>
                <p className="text-sm text-deep-brown/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-serif text-2xl text-deep-brown mb-4">Ready to Begin?</h2>
          <p className="text-deep-brown/50 mb-6">Sign up with your phone number and start earning royal stamps today.</p>
          <Link to="/login" className="btn-royal px-8 py-3 no-underline inline-flex items-center gap-2">
            Start Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
