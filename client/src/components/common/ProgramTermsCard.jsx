import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { REWARDS_TERMS_AND_CONDITIONS } from '../../constants';

export default function ProgramTermsCard({
  title = 'Rewards Program Terms & Conditions',
  defaultOpen = false,
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl bg-[#fdfaf6]/90 border border-[#ede0d2] text-on-surface transition-all duration-300 ${
        compact ? 'p-3.5' : 'p-4 sm:p-5'
      } ${className}`}
    >
      {/* Header bar — Clickable toggle for accessibility while remaining visually secondary */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/70 group-hover:text-primary transition-colors shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-secondary/90 block">
              Program Guidelines
            </span>
            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant/60 group-hover:text-primary transition-colors">
          <span className="text-[11px] font-mono font-medium hidden sm:inline">
            {isOpen ? 'Hide Rules' : 'View Rules'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Rules Content — Accessible but visually secondary */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 pt-3.5 border-t border-[#ede0d2]/70 space-y-2 text-[11px] sm:text-xs text-on-surface-variant/80 leading-relaxed font-sans">
              <ul className="space-y-1.5">
                {REWARDS_TERMS_AND_CONDITIONS.map((term, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/70 mt-1.5 shrink-0" aria-hidden="true" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-2 border-t border-[#ede0d2]/50 flex items-center justify-between text-[10px] text-on-surface-variant/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Fair Dining &amp; Verification Policy</span>
                </span>
                <span className="italic">
                  Final legal/business rules must be approved before publishing.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
