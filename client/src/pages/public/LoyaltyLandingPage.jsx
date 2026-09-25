import { Link, useSearchParams } from 'react-router-dom';
import MaharajaCard from '../../components/loyalty/MaharajaCard';

const tiers = [
  {
    tier: 'Tier 1',
    name: 'Emerald Patron',
    stamps: '3 Stamps',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bg: 'bg-emerald-950/20',
    perks: [
      'Complimentary royal welcome drink on every visit',
      'Priority table reservations on weekdays',
      'Seasonal chef amuse-bouche pairing',
    ],
  },
  {
    tier: 'Tier 2',
    name: 'Ruby Sovereign',
    stamps: '7 Stamps',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bg: 'bg-rose-950/25',
    perks: [
      'All Emerald privileges included',
      'Choice of complimentary signature dessert (Kesar Shahi Tukda)',
      'Reserved Jharokha alcove seating guarantee',
      'Private birthday vintage champagne pairing',
    ],
  },
  {
    tier: 'Supreme',
    name: 'Kohinoor Royal',
    stamps: '12+ Stamps',
    color: 'text-primary',
    borderColor: 'border-primary/60',
    bg: 'bg-primary-container/20',
    perks: [
      'All Ruby sovereign privileges included',
      'Bespoke 5-course feast crafted in your name by Executive Chef',
      'VIP private dining room booking without minimum spend',
      'Invitation to the annual closed-door Royal Dastarkhān banquet',
    ],
  },
];

export default function LoyaltyLandingPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[18px]">military_tech</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary">
              The Digital Maharaja Card
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
            Your Key to <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Imperial Privileges
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8">
            Ascend through royal tiers with every dining experience. Collect verified digital seals, unlock private salon tastings, and receive invitations to confidential sovereign banquets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest font-label-lg uppercase tracking-[0.16em] font-bold shadow-lg hover:scale-105 transition-all no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Claim Digital Card</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-lg uppercase tracking-[0.16em] border border-outline-variant/40 hover:border-primary/40 transition-all no-underline font-semibold"
            >
              <span>Cardholder Sign In</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {source && (
            <p className="text-secondary/70 font-label-sm uppercase tracking-widest mt-4">
              Privilege Referral Active: {source}
            </p>
          )}
        </div>
      </section>

      {/* ── Virtual Card Live Preview ─────────────────────────────────── */}
      <section className="relative w-full py-16 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-md mx-auto mb-16 flex flex-col items-center">
            <MaharajaCard
              guestName="Imperial Passholder"
              currentStamps={4}
              targetStamps={5}
              cycleNumber={1}
            />
            <p className="text-center text-xs uppercase tracking-[0.2em] text-secondary font-mono mt-4">
              Real-time digital pass stored in your mobile browser
            </p>
          </div>

          {/* Tier Breakdown */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary mb-2 block">
              Ascending Rank
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">
              The Three Sovereign Tiers
            </h2>
            <div className="w-16 h-0.5 bg-primary-container mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`p-8 rounded-3xl bg-surface-container/70 border ${t.borderColor} backdrop-blur-xl shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                      {t.tier}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 font-label-sm uppercase tracking-wider text-secondary">
                      {t.stamps}
                    </span>
                  </div>

                  <h3 className={`font-headline-sm text-headline-sm mb-4 ${t.color}`}>
                    {t.name}
                  </h3>

                  <ul className="space-y-3 font-body-sm text-body-sm text-on-surface-variant list-none p-0">
                    {t.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-outline-variant/30">
                  <Link
                    to="/login"
                    className="block w-full text-center py-3 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all font-label-sm uppercase tracking-widest border border-primary/30 no-underline font-semibold"
                  >
                    Enroll In Tier
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* How Stamp Collection Works */}
          <div className="rounded-3xl p-8 lg:p-14 bg-gradient-to-r from-surface-container-lowest via-surface-container-high to-surface-container-lowest border border-outline-variant/40 text-center">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
              How Stamp Approval Works
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
              When dining with us, simply display your phone’s digital card QR code or give your phone number to your waiter. Our staff approves your seal directly through their tablet terminal, updating your card in real time.
            </p>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all no-underline"
            >
              Get Your Digital Card Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
