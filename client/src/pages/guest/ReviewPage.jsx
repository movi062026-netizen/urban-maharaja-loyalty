import { useState, useEffect } from 'react';
import { settingsApi, reviewApi } from '../../services/api';
import { Star, ExternalLink, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewPage() {
  const [reviewUrl, setReviewUrl] = useState('');
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    settingsApi.getSettings().then(({ data }) => {
      setReviewUrl(data.data.settings?.googleReviewUrl || '');
    }).catch(() => {});
  }, []);

  const handleClick = async () => {
    try {
      await reviewApi.trackClick('maharaja-card');
      setClicked(true);
      if (reviewUrl && reviewUrl !== 'REPLACE_WITH_GOOGLE_REVIEW_URL') {
        window.open(reviewUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast('Google Review URL is not yet configured', { icon: 'ℹ️' });
      }
    } catch (err) {
      // Still open the link even if tracking fails
      if (reviewUrl && reviewUrl !== 'REPLACE_WITH_GOOGLE_REVIEW_URL') {
        window.open(reviewUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="space-y-6 animate-slideUp text-on-surface">
      <div className="bg-surface-container/85 rounded-3xl p-8 border border-outline-variant/30 backdrop-blur-xl shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center mx-auto mb-5 text-primary shadow-lg">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="font-serif text-2xl text-on-surface font-bold mb-3">Loved Your Experience?</h1>
        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Your kind words illuminate our dastarkhān. Share your royal dining impression on Google to guide fellow connoisseurs.
        </p>

        <button
          onClick={handleClick}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all inline-flex items-center gap-2.5 cursor-pointer"
        >
          <Star className="w-4 h-4 fill-surface-container-lowest" />
          <span>Leave a Google Review</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {clicked && (
          <p className="text-xs text-green-300 font-semibold mt-4 animate-fadeIn">Thank you for your noble feedback! 🙏</p>
        )}
      </div>

      <div className="bg-surface-container/60 rounded-2xl p-4 text-center border border-outline-variant/30 backdrop-blur-md">
        <p className="text-xs text-on-surface-variant/70">
          You will be redirected to the official Urban Maharaja Google profile.
        </p>
      </div>
    </div>
  );
}
