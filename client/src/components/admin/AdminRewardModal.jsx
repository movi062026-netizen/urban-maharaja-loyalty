import { useState, useEffect } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { validateRewardForm } from '../../validation/rewardValidation';

export default function AdminRewardModal({ isOpen, onClose, onSave, reward = null, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    requiredStamps: 5,
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reward) {
      setFormData({
        title: reward.title || '',
        requiredStamps: reward.requiredStamps || 5,
        description: reward.description || '',
        isActive: reward.isActive ?? true,
      });
    } else {
      setFormData({
        title: '',
        requiredStamps: 5,
        description: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [reward, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateRewardForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-primary/40 shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">
                {reward ? 'Edit Royal Privilege' : 'Create New Privilege'}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">Rewards Catalog Configuration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Privilege Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Complimentary Royal Shahi Tukda"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
            />
            {errors.title && <span className="text-xs text-error mt-1 block">{errors.title}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Required Seals *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.requiredStamps}
              onChange={(e) => setFormData({ ...formData, requiredStamps: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all font-mono"
            />
            {errors.requiredStamps && (
              <span className="text-xs text-error mt-1 block">{errors.requiredStamps}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Description / Dining Terms
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain how the patron redeems this privilege at Urban Maharaja..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30">
            <span className="text-xs font-medium text-on-surface">Active in Catalog</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Privilege</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
