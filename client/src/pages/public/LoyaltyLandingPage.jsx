import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MaharajaCard from '../../components/loyalty/MaharajaCard';
import ProgramTermsCard from '../../components/common/ProgramTermsCard';

const tiers = [
  {
    tier: 'Level 1',
    name: 'Emerald Patron',
    stamps: '3 Stamps',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-500/40',
    bg: 'bg-emerald-50',
    perks: [
      'Welcome beverage on your visits',
      'Priority reservations for dining',
      'Special seasonal chef treat',
    ],
  },
  {
    tier: 'Level 2',
    name: 'Ruby Sovereign',
    stamps: '7 Stamps',
    color: 'text-rose-700',
    borderColor: 'border-rose-500/40',
    bg: 'bg-rose-50',
    perks: [
      'All Level 1 benefits included',
      'Complimentary signature dessert of your choice',
      'Preferred comfortable seating',
      'Birthday dining treat from our team',
    ],
  },
  {
    tier: 'Level 3',
    name: 'Kohinoor Member',
    stamps: '12+ Stamps',
    color: 'text-primary',
    borderColor: 'border-primary/60',
    bg: 'bg-primary-container/20',
    perks: [
      'All Level 2 benefits included',
      'Special celebratory dining experience',
      'Priority table booking on busy evenings',
      'Exclusive tasting invitations for new menu specials',
    ],
  },
];

export default function LoyaltyLandingPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── Hero Banner: Introduction ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface-container/90 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary font-bold">
              Urban Maharaja Rewards
            </span>
          </div>

          <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight leading-tight mb-6 font-bold">
            Your Visits. <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Your Rewards.
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-3 mb-8">
            <p className="font-body-lg text-base sm:text-lg text-on-surface font-medium leading-relaxed">
              Every time you visit Urban Maharaja, you have the opportunity to collect rewards.
            </p>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Join our rewards program, keep track of your visits, and enjoy something extra the next time you dine with us.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-md uppercase tracking-[0.14em] font-bold shadow-lg hover:scale-105 transition-all no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Join Rewards Program</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-md uppercase tracking-[0.14em] border border-outline-variant/60 hover:border-primary/40 transition-all no-underline font-bold"
            >
              <span>Sign In to Your Card</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {source && (
            <p className="text-secondary font-label-sm uppercase tracking-widest mt-4">
              Referral Code: {source}
            </p>
          )}
        </div>
      </motion.section>

      {/* ── Virtual Card Live Preview ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full py-16 bg-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-md mx-auto mb-16 flex flex-col items-center">
            <MaharajaCard
              guestName="Member Guest"
              currentStamps={4}
              targetStamps={5}
              cycleNumber={1}
            />
            <p className="text-center text-xs uppercase tracking-[0.2em] text-secondary font-mono mt-4 font-semibold">
              Live digital card saved directly to your phone
            </p>
          </div>

          {/* Member Milestones */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary font-bold mb-2 block">
              Member Recognition
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold mb-3">
              Rewards as You Visit More Often
            </h2>
            <div className="w-16 h-1 bg-primary-container mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`p-8 rounded-3xl bg-surface-container/80 border ${t.borderColor} shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-sm text-xs font-bold uppercase tracking-widest text-outline">
                      {t.tier}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 font-label-sm text-xs font-bold uppercase tracking-wider text-secondary">
                      {t.stamps}
                    </span>
                  </div>

                  <h3 className={`font-headline-sm text-xl font-bold mb-4 ${t.color}`}>
                    {t.name}
                  </h3>

                  <ul className="space-y-3 font-body-sm text-sm text-on-surface-variant list-none p-0">
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
                    to="/register"
                    className="block w-full text-center py-3 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all font-label-sm uppercase tracking-wider border border-primary/30 no-underline font-bold text-xs"
                  >
                    Start Collecting Stamps
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* How Stamp Collection Works */}
          <div className="rounded-3xl p-8 lg:p-12 bg-surface-container/80 border border-outline-variant/40 text-center shadow-sm">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Simple &amp; Easy</span>
            </div>
            <h3 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold mb-3">
              How Collecting Stamps Works
            </h3>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
              When dining at Urban Maharaja, simply show your digital card or provide your registered mobile number to your server. Your visit is recorded, updating your stamp count right at your table.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-md uppercase tracking-[0.14em] font-bold shadow-lg hover:brightness-110 transition-all no-underline inline-block"
              >
                Join &amp; Get Your Card
              </Link>
            </div>
          </div>

          {/* Accessible but Visually Secondary Terms & Conditions */}
          <div className="mt-12 max-w-3xl mx-auto text-left">
            <ProgramTermsCard defaultOpen={false} />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
