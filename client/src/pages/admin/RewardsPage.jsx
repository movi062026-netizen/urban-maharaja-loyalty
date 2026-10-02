import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rewardApi, adminApi } from '../../services/api';
import { Gift, Plus, Edit2, ToggleLeft, ToggleRight, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', requiredStamps: 5, validityDays: 30, rewardType: 'COMPLIMENTARY_ITEM' });

  useEffect(() => { loadRewards(); }, []);

  const loadRewards = async () => {
    try {
      const res = await adminApi.getRewards();
      setRewards(res.data.data.rewards || []);
    } catch (err) { toast.error('Failed to load rewards'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReward) {
        await rewardApi.updateReward(editingReward._id, form);
        toast.success('Royal reward updated');
      } else {
        await rewardApi.createReward(form);
        toast.success('Royal reward created');
      }
      setShowForm(false);
      setEditingReward(null);
      setForm({ title: '', description: '', requiredStamps: 5, validityDays: 30, rewardType: 'COMPLIMENTARY_ITEM' });
      loadRewards();
    } catch (err) { toast.error(err.response?.data?.error?.message || 'Failed to save reward'); }
  };

  const toggleActive = async (reward) => {
    try {
      await rewardApi.updateReward(reward._id, { isActive: !reward.isActive });
      toast.success(reward.isActive ? 'Reward deactivated' : 'Reward activated');
      loadRewards();
    } catch (err) { toast.error('Failed to update'); }
  };

  const startEdit = (r) => {
    setEditingReward(r);
    setForm({ title: r.title, description: r.description || '', requiredStamps: r.requiredStamps, validityDays: r.validityDays, rewardType: r.rewardType });
    setShowForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 animate-fadeIn text-on-surface">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-on-surface font-bold">Royal Rewards Catalog</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
            Configure dining perks, milestone rewards, and expiration rules for guests
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingReward(null); setForm({ title: '', description: '', requiredStamps: 5, validityDays: 30, rewardType: 'COMPLIMENTARY_ITEM' }); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Reward
        </button>
      </div>

      {/* Form Drawer / Modal */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e4d3c2] shadow-[0_20px_60px_-15px_rgba(46,26,16,0.12)] animate-scaleIn">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#eee0d2]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">Reward Catalog Configuration</span>
              <h2 className="font-serif text-xl text-on-surface font-bold mt-0.5">{editingReward ? 'Edit Royal Privilege' : 'Create Royal Privilege'}</h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setEditingReward(null); }}
              className="p-2 rounded-xl hover:bg-stone-100 text-on-surface-variant hover:text-on-surface cursor-pointer border border-transparent hover:border-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Royal Shahi Dessert Platter"
                className="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Complimentary chef special curated for our 5-seal royal patrons..."
                className="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">Required Seals</label>
                <input
                  type="number"
                  value={form.requiredStamps}
                  onChange={(e) => setForm({ ...form, requiredStamps: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">Validity (Days)</label>
                <input
                  type="number"
                  value={form.validityDays}
                  onChange={(e) => setForm({ ...form, validityDays: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
                  min={1}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">Reward Classification</label>
              <select
                value={form.rewardType}
                onChange={(e) => setForm({ ...form, rewardType: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
              >
                <option value="COMPLIMENTARY_ITEM">Complimentary Item</option>
                <option value="DISCOUNT_PERCENTAGE">Discount (%)</option>
                <option value="DISCOUNT_FLAT">Discount (Flat)</option>
                <option value="FREE_BEVERAGE">Free Royal Beverage</option>
                <option value="SPECIAL_EXPERIENCE">Special Dining Experience</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
              >
                {editingReward ? 'Update Privilege' : 'Publish Privilege'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingReward(null); }}
                className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-on-surface-variant text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards List — Royal Certificate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-52 rounded-[24px] bg-white border border-[#e4d3c2] animate-pulse shadow-sm" />
          ))
        ) : rewards.length === 0 ? (
          <div className="col-span-full glass-panel-elevated p-12 text-center">
            <Gift className="w-14 h-14 text-primary/25 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-on-surface font-bold mb-1">No Rewards Configured</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Create your first reward to start offering dining perks to loyal guests.</p>
          </div>
        ) : rewards.map((r, idx) => {
          const stats = r.claimStats || { totalClaimed: 0, totalRedeemed: 0, totalAvailable: 0 };

          // Visual styles based on reward type or index
          const sealThemes = [
            { bg: 'from-[#ba3461] to-[#7a1538]', border: 'border-[#ffd9e2]', glow: 'rgba(186,52,97,0.25)', tag: 'Imperial Signature' },
            { bg: 'from-[#cca056] to-[#744d1c]', border: 'border-[#ffdfb6]', glow: 'rgba(204,160,86,0.25)', tag: 'Palace Reserve' },
            { bg: 'from-[#7c3aed] to-[#4c1d95]', border: 'border-[#e9d5ff]', glow: 'rgba(124,58,237,0.25)', tag: 'Royalty Special' },
            { bg: 'from-[#059669] to-[#064e3b]', border: 'border-[#a7f3d0]', glow: 'rgba(5,150,105,0.25)', tag: 'Master Chef Exclusive' },
          ];
          const theme = sealThemes[idx % sealThemes.length];

          return (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className={`rounded-[24px] relative overflow-hidden transition-all duration-300 group ${
                r.isActive
                  ? 'bg-white border border-[#e4d3c2] shadow-[0_12px_36px_-10px_rgba(46,26,16,0.08)] hover:shadow-[0_20px_48px_-10px_rgba(46,26,16,0.14)] hover:border-primary/40 hover:-translate-y-1'
                  : 'bg-white/60 border border-dashed border-[#d4c4b4] opacity-60'
              }`}
            >
              {/* Top Regal Border Accent */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: r.isActive
                    ? 'linear-gradient(90deg, #ba3461 0%, #e882a3 35%, #cca056 70%, #ba3461 100%)'
                    : '#d4c4b4',
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Header with Medallion Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white bg-gradient-to-br ${theme.bg} border-2 ${theme.border}`}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold tracking-[0.16em] text-secondary">
                          {theme.tag}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-on-surface text-base sm:text-lg leading-tight truncate">
                        {r.title}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                        {r.description || 'Complimentary palace dining privilege'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                      r.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}
                  >
                    {r.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Claim Statistics Suite — High-Contrast Porcelain Boxes */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#fdfaf6] border border-[#eee0d2] text-center">
                    <span className="font-serif text-lg sm:text-xl font-black text-primary block leading-none">
                      {stats.totalClaimed}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1 block">
                      Total Claims
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fdfaf6] border border-[#eee0d2] text-center">
                    <span className="font-serif text-lg sm:text-xl font-black text-emerald-600 block leading-none">
                      {stats.totalRedeemed}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1 block">
                      Honored
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fdfaf6] border border-[#eee0d2] text-center">
                    <span className="font-serif text-lg sm:text-xl font-black text-amber-600 block leading-none">
                      {stats.totalAvailable}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1 block">
                      In Circulation
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[#ede0d4] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary font-bold px-2.5 py-1 rounded-lg bg-primary-container/10 border border-primary-container/20">
                      {r.requiredStamps} Seals Needed
                    </span>
                    <span className="font-mono text-on-surface-variant text-[11px]">
                      {r.validityDays}d valid
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(r)}
                      className="p-2 rounded-xl bg-white hover:bg-primary-container/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-[#e4d3c2] hover:border-primary/40 shadow-xs"
                      aria-label={`Edit ${r.title}`}
                      title="Edit Reward"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleActive(r)}
                      className="p-2 rounded-xl bg-white hover:bg-primary-container/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-[#e4d3c2] hover:border-primary/40 shadow-xs"
                      aria-label={r.isActive ? 'Deactivate' : 'Activate'}
                      title={r.isActive ? 'Deactivate Reward' : 'Activate Reward'}
                    >
                      {r.isActive ? (
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-stone-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
