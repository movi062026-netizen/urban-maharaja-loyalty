import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { REWARDS_TERMS_AND_CONDITIONS } from '../../constants';

export default function TermsPage() {
  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full pt-16 pb-12 bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container/90 border border-primary/20 shadow-xs mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
              Governance &amp; Guidelines
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-on-surface font-bold tracking-tight mb-3">
            Terms &amp; Conditions
          </h1>

          <p className="text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Rules, privileges, and fair-use guidelines governing the Urban Maharaja Digital Loyalty &amp; Rewards Program.
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Core Rewards Rules Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e0c8b0] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)]"
        >
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#eee0d2]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Rewards Program Terms
              </h2>
              <p className="text-xs text-on-surface-variant/80">
                Official rules governing seals, vouchers, and member dining privileges
              </p>
            </div>
          </div>

          <ul className="space-y-4">
            {REWARDS_TERMS_AND_CONDITIONS.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#fdfaf6] border border-[#ede0d2] text-xs sm:text-sm text-on-surface-variant/90 leading-relaxed"
              >
                <div className="w-6 h-6 rounded-full bg-white border border-[#e0c8b0] flex items-center justify-center shrink-0 mt-0.5 text-primary font-bold font-mono text-xs shadow-xs">
                  {idx + 1}
                </div>
                <div className="flex-1 font-sans">
                  {rule}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-[#eee0d2] flex items-center justify-between text-xs text-on-surface-variant/70 italic">
            <span>Urban Maharaja Rewards Program</span>
            <span>Final legal/business rules must be approved before publishing.</span>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/guest/rewards"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-container transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Royal Rewards Vault</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
