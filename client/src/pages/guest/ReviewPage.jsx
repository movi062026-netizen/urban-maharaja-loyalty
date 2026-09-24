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
    <div className="space-y-6 animate-slideUp">
      <div className="bg-white rounded-2xl p-8 shadow-royal text-center">
        <div className="w-16 h-16 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-5">
          <Heart className="w-8 h-8 text-royal-rose" />
        </div>

        <h1 className="font-serif text-2xl text-deep-brown mb-3">Loved Your Experience?</h1>
        <p className="text-deep-brown/50 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          Your kind words mean the world to us. Share your royal dining experience
          and help others discover Urban Maharaja.
        </p>

        <button
          onClick={handleClick}
          className="btn-gold inline-flex items-center gap-2 text-base px-8 py-3"
        >
          <Star className="w-5 h-5" />
          Leave a Google Review
          <ExternalLink className="w-4 h-4" />
        </button>

        {clicked && (
          <p className="text-sm text-success mt-4 animate-fadeIn">Thank you for your feedback! 🙏</p>
        )}
      </div>

      <div className="bg-cream-dark rounded-xl p-4 text-center">
        <p className="text-xs text-deep-brown/30">
          You will be redirected to Google Maps to leave your review.
        </p>
      </div>
    </div>
  );
}
