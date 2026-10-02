import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

/**
 * Ultra-Luxurious Digital Maharaja Card — Sovereign Edition
 * - Light luminous jewel seal colors (no dark pink)
 * - Exquisite circular royal seal crest for high visibility
 * - Circular stamp badges with double-ring gold embroidery and clear contrast
 * - Gold EMV chip, holographic light sweep, embossed patron details
 */
export default function MaharajaCard({
  guestName,
  currentStamps = 0,
  targetStamps = 5,
  cycleNumber = 1,
  isComplete = false,
}) {
  const stamps = currentStamps || 0;
  const target = targetStamps || 5;

  const getTier = () => {
    if (isComplete || stamps >= target) {
      return {
        name: 'Sovereign Patron',
        color: '#c99a4e',
        bg: 'rgba(201, 154, 78, 0.14)',
        border: 'rgba(201, 154, 78, 0.5)',
        glow: 'rgba(201, 154, 78, 0.35)',
      };
    }
    if (stamps >= 3) {
      return {
        name: 'Imperial Ruby',
        color: '#b8446a',
        bg: 'rgba(184, 68, 106, 0.12)',
        border: 'rgba(184, 68, 106, 0.45)',
        glow: 'rgba(184, 68, 106, 0.25)',
      };
    }
    return {
      name: 'Noble Member',
      color: '#7a5420',
      bg: 'rgba(122, 84, 32, 0.1)',
      border: 'rgba(122, 84, 32, 0.35)',
      glow: 'rgba(212, 166, 106, 0.2)',
    };
  };

  const tier = getTier();

  // Premium Light Jewel Tones for Seals 1 to 5 (Soft Champagne, Rose Pearl, Jade Quartz, Royal Lavender, Sunburst Gold)
  const sealThemes = [
    {
      name: 'Champagne Gold',
      bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
      shadow: '0 6px 18px -2px rgba(245, 158, 11, 0.35)',
      ring: 'rgba(217, 119, 6, 0.6)',
      textColor: '#78350f',
      accent: '#b45309',
    },
    {
      name: 'Rose Pearl',
      bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 50%, #fb7185 100%)',
      shadow: '0 6px 18px -2px rgba(251, 113, 133, 0.35)',
      ring: 'rgba(225, 29, 72, 0.6)',
      textColor: '#881337',
      accent: '#be123c',
    },
    {
      name: 'Crystal Jade',
      bg: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 50%, #34d399 100%)',
      shadow: '0 6px 18px -2px rgba(52, 211, 153, 0.35)',
      ring: 'rgba(5, 150, 105, 0.6)',
      textColor: '#064e3b',
      accent: '#047857',
    },
    {
      name: 'Amethyst Quartz',
      bg: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #c084fc 100%)',
      shadow: '0 6px 18px -2px rgba(192, 132, 252, 0.35)',
      ring: 'rgba(147, 51, 234, 0.6)',
      textColor: '#581c87',
      accent: '#7e22ce',
    },
    {
      name: 'Sunburst Gold',
      bg: 'linear-gradient(135deg, #fffbeb 0%, #fef08a 45%, #eab308 100%)',
      shadow: '0 8px 22px -2px rgba(234, 179, 8, 0.45)',
      ring: 'rgba(202, 138, 4, 0.7)',
      textColor: '#713f12',
      accent: '#a16207',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[500px] aspect-[1.58/1] min-h-[250px] rounded-[28px] overflow-hidden text-[#2c1a14] select-none shadow-[0_24px_60px_-12px_rgba(46,26,20,0.18),0_12px_24px_-6px_rgba(201,154,78,0.12)] border border-[#e8d2ba]/70"
      style={{
        background: 'linear-gradient(135deg, #fffdfa 0%, #fcf5eb 35%, #f4e4ce 75%, #ebd7bd 100%)',
      }}
      role="region"
      aria-label="Digital Maharaja Card"
    >
      {/* ── Ambient Radial Sheen ────────────────────────────────────── */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-50"
        style={{ background: `radial-gradient(circle, ${tier.glow}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-20 -left-12 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(228,193,148,0.4), transparent 70%)' }}
      />

      {/* ── Diagonal Gold Guilloche Lines ───────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #8a5a22, #8a5a22 1px, transparent 1px, transparent 12px)',
        }}
      />

      {/* ── Animated Holographic Light Sweep ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
        <div className="w-[140%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 animate-holographic-shine" />
      </div>

      {/* ── Card Content ─────────────────────────────────────────────── */}
      <div className="relative h-full flex flex-col justify-between z-10 p-5 sm:p-6 md:p-7">
        {/* Top Header: Circular Royal Insignia & Member Tier */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* High-Visibility Circular Seal Insignia */}
            <div className="relative group/logo">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-[#c99a4e] via-[#deb268] to-[#996d2b] p-[2px] shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#fbf5ed] border border-[#d4a66a]/60 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                  {/* Subtle inner radial glow */}
                  <div className="absolute inset-0 bg-radial from-white via-transparent to-[#ecdcc8]/30" />
                  <span className="font-serif text-[11px] sm:text-xs font-black tracking-widest text-[#7a4e1a] uppercase leading-none">
                    UM
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-mono tracking-tighter text-[#b8446a] font-bold uppercase mt-0.5">
                    ROYAL
                  </span>
                </div>
              </div>
              {/* Circular outer orbital ring */}
              <div className="absolute -inset-1 rounded-full border border-[#d4a66a]/40 border-dashed pointer-events-none" />
            </div>

            <div className="min-w-0">
              <span className="font-serif text-[13px] sm:text-base font-bold tracking-[0.12em] uppercase text-[#331c15] block leading-tight">
                Urban Maharaja
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.22em] text-[#8c602a] font-bold block mt-0.5">
                Imperial Dining Privilege
              </span>
            </div>
          </div>

          {/* Tier Badge Pill */}
          <div
            className="px-3.5 py-1.5 rounded-full border backdrop-blur-md shadow-sm shrink-0 flex items-center gap-1.5"
            style={{
              borderColor: tier.border,
              background: tier.bg,
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: tier.color }} />
            <span
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: tier.color }}
            >
              {tier.name}
            </span>
          </div>
        </div>

        {/* Middle: Gold EMV Chip & Pass Counter */}
        <div className="flex items-center justify-between my-auto py-1">
          <div className="flex items-center gap-3">
            {/* Authentic Gold Smart Chip */}
            <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-[6px] bg-gradient-to-br from-[#dfb470] via-[#c8994a] to-[#9c6f2a] border border-[#ecd5a8] relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_6px_rgba(46,26,20,0.15)]">
              <div className="absolute inset-0 flex flex-col justify-center px-1.5 gap-[2px]">
                <div className="w-full h-[0.5px] bg-white/40" />
                <div className="w-[65%] h-[0.5px] bg-white/30" />
                <div className="w-full h-[0.5px] bg-white/40" />
              </div>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-[#6d5138]">
              <span className="font-bold text-[#3d241c]">Pass Cycle #{cycleNumber}</span>
              <span className="text-[9px] block text-[#8a6e54]">DINING VERIFIED</span>
            </div>
          </div>

          {/* Counter Badge Pill */}
          <div className="flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#d4ba9e]/50 shadow-sm backdrop-blur-sm">
            <span className="font-serif text-lg sm:text-xl font-black text-[#9a2d52] leading-none">
              {stamps}
            </span>
            <span className="text-[11px] text-[#74553b] font-mono font-medium">/ {target} Seals</span>
          </div>
        </div>

        {/* Bottom: 5 Circular Royal Stamp Seals — Light, High-Visibility, Premium */}
        <div className="flex items-center gap-2 sm:gap-3 my-1">
          {Array.from({ length: target }, (_, i) => {
            const collected = i < stamps;
            const theme = sealThemes[i % sealThemes.length];

            return (
              <div
                key={i}
                className="flex-1 aspect-square rounded-full flex flex-col items-center justify-center relative transition-all duration-500"
                style={
                  collected
                    ? {
                        background: theme.bg,
                        boxShadow: theme.shadow,
                        border: `2px solid ${theme.ring}`,
                        transform: 'scale(1.04)',
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px dashed rgba(175, 142, 110, 0.55)',
                      }
                }
              >
                {collected ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Inner Gold Circular Mandala Ring */}
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/80 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.12)]">
                      <span
                        className="font-serif text-[11px] sm:text-xs font-black leading-none"
                        style={{ color: theme.textColor }}
                      >
                        #{i + 1}
                      </span>
                    </div>
                    <span
                      className="text-[6.5px] sm:text-[7.5px] font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: theme.accent }}
                    >
                      SEALED
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-xs sm:text-sm font-serif font-bold text-[#8a705b]/60 leading-none">
                      {i + 1}
                    </span>
                    <span className="text-[6px] sm:text-[7px] uppercase tracking-wider text-[#9d836e]/50 font-mono mt-0.5">
                      Open
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card Footer: Embossed Patron Name & Member Pass ID */}
        <div className="flex items-end justify-between pt-1 border-t border-[#d8be9f]/40">
          <div>
            <span className="text-[8px] uppercase tracking-[0.2em] font-mono text-[#8c6742] block font-semibold">
              Honored Member
            </span>
            <span className="font-serif text-xs sm:text-sm font-bold text-[#351e16] tracking-wide block truncate max-w-[200px] sm:max-w-[260px]">
              {guestName || 'Noble Patron'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[8px] uppercase tracking-[0.2em] font-mono text-[#8c6742] block font-semibold">
              Status
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#9a2d52]">
              {isComplete || stamps >= target ? '★ VOUCHER READY' : `${target - stamps} TO REWARD`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
