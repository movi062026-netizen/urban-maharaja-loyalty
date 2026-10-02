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
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#744d1c] block">
              Program Guidelines
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#1d0f09] group-hover:text-primary transition-colors">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#483328] group-hover:text-primary transition-colors">
          <span className="text-xs font-mono font-bold hidden sm:inline">
            {isOpen ? 'Hide Rules' : 'View Rules'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Rules Content — Accessible and clearly legible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 pt-3.5 border-t border-[#ede0d2] space-y-2 text-xs sm:text-sm text-[#1d0f09] leading-relaxed font-sans">
              <ul className="space-y-2">
                {REWARDS_TERMS_AND_CONDITIONS.map((term, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" aria-hidden="true" />
                    <span className="font-medium text-[#22120b]">{term}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-2.5 border-t border-[#ede0d2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-[#483328] font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fair Dining &amp; Verification Policy</span>
                </span>
                <span className="italic text-[#744d1c]">
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
