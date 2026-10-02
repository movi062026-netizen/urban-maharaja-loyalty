import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { settingsApi, reviewApi } from '../../services/api';
import { Star, ExternalLink, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

const DEFAULT_GOOGLE_REVIEW_URL = 'https://share.google/2nmScZz1II7jKmnKO';

export default function ReviewPage() {
  const [reviewUrl, setReviewUrl] = useState(DEFAULT_GOOGLE_REVIEW_URL);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    settingsApi.getSettings().then(({ data }) => {
      const url = data.data.settings?.googleReviewUrl;
      if (url && url !== 'REPLACE_WITH_GOOGLE_REVIEW_URL') {
        setReviewUrl(url);
      }
    }).catch(() => {});
  }, []);

  const handleClick = async () => {
    const finalUrl = reviewUrl || DEFAULT_GOOGLE_REVIEW_URL;
    try {
      await reviewApi.trackClick('maharaja-card');
    } catch (err) {
      // Non-fatal
    } finally {
      setClicked(true);
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 animate-slideUp text-on-surface max-w-2xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eee0d2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] uppercase font-black tracking-[0.2em] text-[#744d1c]">
              Court Testimonial
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">Royal Patronage Review</h1>
          <p className="text-xs text-[#3b241a] font-medium mt-1">
            Share your dining impression with fellow food connoisseurs on Google
          </p>
        </div>
      </div>

      <div className="rounded-[28px] bg-white border border-[#e4d3c2] shadow-[0_16px_45px_-12px_rgba(46,26,16,0.08)] p-6 sm:p-10 text-center">
        {/* Heart Medallion */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center mx-auto mb-6 text-white shadow-md border-2 border-white">
          <Heart className="w-10 h-10 text-white fill-white/20" />
        </div>

        {/* 5 Golden Stars */}
        <div className="flex items-center justify-center gap-1.5 mb-4 text-amber-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500 drop-shadow-xs" />
          ))}
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold mb-2">
          Loved Your Palace Dining Experience?
        </h2>
        <p className="text-[#3b241a] font-medium text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
          Your words illuminate our dastarkhān and inspire our royal khansamas. Share your 5-star review on Google to help fellow patrons discover Urban Maharaja.
        </p>

        <button
          onClick={handleClick}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-container via-[#d44877] to-secondary text-white text-xs sm:text-sm uppercase tracking-[0.16em] font-bold shadow-md hover:shadow-lg hover:brightness-110 transition-all inline-flex items-center gap-3 cursor-pointer active:scale-95"
        >
          <Star className="w-4 h-4 fill-white" />
          <span>Write a Google Review</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {clicked && (
          <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold inline-flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for your noble feedback and royal patronage!</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4 text-center bg-white border border-[#eee0d2] shadow-xs">
        <p className="text-xs text-[#3b241a] font-medium">
          You will be redirected directly to Urban Maharaja's verified Google Business profile.
        </p>
      </div>
    </motion.div>
  );
}
