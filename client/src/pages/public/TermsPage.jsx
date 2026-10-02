import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { REWARDS_TERMS_AND_CONDITIONS } from '../../constants';

export default function TermsPage() {
  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full pt-16 pb-12 bg-gradient-to-b from-[#fdfaf6] via-white to-[#f9f3eb] text-center overflow-hidden border-b border-[#eee0d2]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#e0c8b0] shadow-xs mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[11px] uppercase font-black tracking-[0.2em] text-[#744d1c]">
              Governance &amp; Guidelines
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1d0f09] font-black tracking-tight mb-3">
            Terms &amp; Conditions
          </h1>

          <p className="text-sm sm:text-base text-[#3b241a] font-medium max-w-2xl mx-auto leading-relaxed">
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
          className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-[#e0c8b0] shadow-[0_16px_45px_-10px_rgba(46,26,16,0.1)]"
        >
          <div className="flex items-center gap-3.5 pb-5 mb-6 border-b border-[#eee0d2]">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1d0f09]">
                Rewards Program Terms
              </h2>
              <p className="text-xs sm:text-sm text-[#3b241a] font-medium mt-0.5">
                Official rules governing seals, vouchers, and member dining privileges
              </p>
            </div>
          </div>

          <ul className="space-y-3.5">
            {REWARDS_TERMS_AND_CONDITIONS.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fdfaf6] hover:bg-white border-2 border-[#ede0d2] hover:border-[#ba3461]/40 transition-all text-sm sm:text-base text-[#1d0f09] font-medium leading-relaxed shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 font-black font-mono text-xs shadow-xs">
                  {idx + 1}
                </div>
                <div className="flex-1 font-sans text-[#1d0f09] font-semibold text-sm sm:text-[15px] pt-0.5">
                  {rule}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-5 border-t border-[#eee0d2] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#3b241a] font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Urban Maharaja Digital Loyalty Platform</span>
            </span>
            <span className="text-[#744d1c] font-mono">
              Final legal/business rules must be approved before publishing.
            </span>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            to="/guest/rewards"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-primary-container/10 border-2 border-[#e0c8b0] hover:border-primary/40 text-xs font-black uppercase tracking-wider text-primary transition-all no-underline shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Royal Rewards Vault</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
