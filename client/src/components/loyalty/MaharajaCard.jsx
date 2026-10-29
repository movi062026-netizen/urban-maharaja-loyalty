import { motion } from 'framer-motion';
import { Check, Crown, Gift } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Digital Maharaja Card — premium metal-card styling.
 * Deep wine lacquer body, gold foil typography, EMV chip, contactless mark,
 * stamp progress row and embossed holder details.
 */

const GOLD_TEXT = {
  backgroundImage: 'linear-gradient(100deg, #f6e3b4 0%, #d9b26a 35%, #fff1c9 55%, #c8994a 80%, #e9cf91 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const TIERS = {
  sovereign: { key: 'card.tier.sovereign', ring: '#e8c77e', text: '#2a1208', bg: 'linear-gradient(135deg, #f7e3ad, #d4a752)' },
  ruby: { key: 'card.tier.ruby', ring: 'rgba(244, 114, 182, 0.6)', text: '#ffe4ef', bg: 'rgba(219, 39, 119, 0.25)' },
  noble: { key: 'card.tier.noble', ring: 'rgba(232, 199, 126, 0.5)', text: '#f3dfb0', bg: 'rgba(232, 199, 126, 0.12)' },
};

const formatMemberId = (memberId) => {
  const clean = String(memberId || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
  const tail = (clean.slice(-8) || '00000000').padStart(8, '0');
  return `UM ${tail.slice(0, 4)} ${tail.slice(4)}`;
};

function ContactlessMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8c77e]/80" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 8.5a5 5 0 0 1 0 7" />
      <path d="M12 6a8.5 8.5 0 0 1 0 12" />
      <path d="M15.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  );
}

function Chip() {
  return (
    <div
      className="w-10 h-8 sm:w-12 sm:h-9 rounded-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.35)]"
      style={{ background: 'linear-gradient(135deg, #f3d48c 0%, #c9993f 45%, #f0d08a 70%, #a8792c 100%)' }}
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-1/3 w-px bg-[#7a5418]/40" />
      <div className="absolute inset-y-0 right-1/3 w-px bg-[#7a5418]/40" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-[#7a5418]/40" />
      <div className="absolute inset-x-0 bottom-1/3 h-px bg-[#7a5418]/40" />
      <div className="absolute inset-[30%] rounded-sm border border-[#7a5418]/40" />
    </div>
  );
}

export default function MaharajaCard({
  guestName,
  memberId,
  currentStamps = 0,
  targetStamps = 5,
  cycleNumber = 1,
  isComplete = false,
}) {
  const { t } = useLanguage();
  const target = Math.max(1, targetStamps || 5);
  const stamps = Math.min(Math.max(0, currentStamps || 0), target);
  const complete = isComplete || stamps >= target;
  const remaining = target - stamps;
  const percent = Math.round((stamps / target) * 100);

  const tier = complete ? TIERS.sovereign : stamps >= Math.ceil(target * 0.6) ? TIERS.ruby : TIERS.noble;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[480px] aspect-[1.586/1] min-h-[230px] rounded-[22px] overflow-hidden select-none text-[#f3dfb0] shadow-[0_30px_60px_-18px_rgba(42,10,22,0.65),0_10px_24px_-8px_rgba(0,0,0,0.35)] ring-1 ring-[#e8c77e]/30"
      style={{
        background: 'linear-gradient(135deg, #3a0f20 0%, #5c1630 42%, #2b0a17 72%, #1a060e 100%)',
        perspective: 1000,
      }}
      role="region"
      aria-label={t('card.ariaLabel')}
    >
      {/* Guilloche pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.09] pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="um-guilloche" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="10" fill="none" stroke="#f3d48c" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#f3d48c" strokeWidth="0.5" />
            <circle cx="22" cy="22" r="10" fill="none" stroke="#f3d48c" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#um-guilloche)" />
      </svg>

      {/* Light pools */}
      <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-[#e8c77e]/15" />
      <div className="absolute -bottom-28 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-[#db2777]/15" />

      {/* Sheen sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-[140%] h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 animate-holographic-shine" />
      </div>

      {/* Inner foil border */}
      <div className="absolute inset-[7px] rounded-[16px] border border-[#e8c77e]/20 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[1.5px] shrink-0" style={{ background: 'linear-gradient(135deg, #f6e3b4, #b8862f)' }}>
              <img src="/logo.png" alt="" className="w-full h-full rounded-full object-cover bg-[#2b0a17]" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block font-serif text-sm sm:text-lg font-bold tracking-[0.14em] uppercase truncate" style={GOLD_TEXT}>
                {t('card.brand')}
              </span>
              <span className="block text-[8px] sm:text-[10px] uppercase tracking-[0.28em] text-[#e8c77e]/70 font-semibold truncate">
                {t('card.subtitle')}
              </span>
            </div>
          </div>

          <span
            className="shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm"
            style={{ background: tier.bg, color: tier.text, boxShadow: `inset 0 0 0 1px ${tier.ring}` }}
          >
            <Crown className="w-3 h-3" aria-hidden="true" />
            {t(tier.key)}
          </span>
        </div>

        {/* Chip row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Chip />
            <ContactlessMark />
          </div>
          <div className="text-right leading-none">
            <span className="block font-serif text-2xl sm:text-3xl font-bold" style={GOLD_TEXT}>
              {stamps}<span className="text-base sm:text-lg text-[#e8c77e]/60">/{target}</span>
            </span>
            <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-[#e8c77e]/60 font-semibold mt-1">
              {t('card.stamps')}
            </span>
          </div>
        </div>

        {/* Stamp progress */}
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2.5" aria-label={t('card.progress', { count: stamps, target })}>
            {Array.from({ length: target }, (_, i) => {
              const filled = i < stamps;
              const isNext = i === stamps && !complete;
              const isLast = i === target - 1;
              return (
                <div key={i} className="flex-1 flex items-center justify-center">
                  <div
                    className={`relative w-full max-w-[42px] aspect-square rounded-full flex items-center justify-center transition-all duration-500 ${
                      isNext ? 'animate-pulse' : ''
                    }`}
                    style={
                      filled
                        ? {
                            background: 'radial-gradient(circle at 30% 30%, #fff1c9 0%, #e2b866 45%, #a8792c 100%)',
                            boxShadow: '0 4px 12px -2px rgba(232,199,126,0.55), inset 0 1px 1px rgba(255,255,255,0.6)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            boxShadow: isNext ? 'inset 0 0 0 1.5px #e8c77e' : 'inset 0 0 0 1px rgba(232,199,126,0.35)',
                          }
                    }
                  >
                    {filled ? (
                      <Check className="w-1/2 h-1/2 text-[#3a0f20]" strokeWidth={3} aria-hidden="true" />
                    ) : isLast ? (
                      <Gift className="w-[45%] h-[45%] text-[#e8c77e]/70" aria-hidden="true" />
                    ) : (
                      <span className="text-[10px] sm:text-xs font-semibold text-[#e8c77e]/55">{i + 1}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2.5 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c8994a, #f6e3b4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[9px] sm:text-[10px] font-semibold tracking-wide text-[#f3dfb0]/80">
            {complete ? `★ ${t('card.rewardReady')}` : t('card.toReward', { count: remaining })}
          </p>
        </div>

        {/* Holder details */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.26em] text-[#e8c77e]/55 font-semibold">
              {t('card.member')}
            </span>
            <span className="block font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#f6e3b4] truncate [text-shadow:0_1px_0_rgba(0,0,0,0.5)]">
              {guestName || 'Royal Guest'}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.26em] text-[#e8c77e]/55 font-semibold">
              {t('card.memberId')} · {t('card.cycle')} {cycleNumber}
            </span>
            <span className="block font-mono text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-[#f6e3b4] [text-shadow:0_1px_0_rgba(0,0,0,0.5)]">
              {formatMemberId(memberId)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
