import { useState, useEffect } from 'react';
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
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-on-surface font-bold">Royal Rewards Catalog</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
            Configure dining perks, milestone rewards, and expiration rules for guests
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingReward(null); setForm({ title: '', description: '', requiredStamps: 5, validityDays: 30, rewardType: 'COMPLIMENTARY_ITEM' }); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Reward
        </button>
      </div>

      {/* Form Drawer / Modal */}
      {showForm && (
        <div className="bg-surface-container/90 rounded-2xl p-6 border border-outline-variant/40 backdrop-blur-xl shadow-xl animate-scaleIn">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/30">
            <h2 className="font-serif text-lg text-on-surface font-bold">{editingReward ? 'Edit Royal Reward' : 'New Royal Reward'}</h2>
            <button
              onClick={() => { setShowForm(false); setEditingReward(null); }}
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Royal Shahi Dessert Platter"
                className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Complimentary chef special curated for our 5-seal royal patrons..."
                className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Required Seals</label>
                <input
                  type="number"
                  value={form.requiredStamps}
                  onChange={(e) => setForm({ ...form, requiredStamps: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Validity (Days)</label>
                <input
                  type="number"
                  value={form.validityDays}
                  onChange={(e) => setForm({ ...form, validityDays: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  min={1}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Reward Classification</label>
              <select
                value={form.rewardType}
                onChange={(e) => setForm({ ...form, rewardType: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="COMPLIMENTARY_ITEM">Complimentary Item</option>
                <option value="DISCOUNT_PERCENTAGE">Discount (%)</option>
                <option value="DISCOUNT_FLAT">Discount (Flat)</option>
                <option value="FREE_BEVERAGE">Free Royal Beverage</option>
                <option value="SPECIAL_EXPERIENCE">Special Dining Experience</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 cursor-pointer"
              >
                {editingReward ? 'Update Reward' : 'Publish Reward'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingReward(null); }}
                className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-container/60 border border-outline-variant/30 animate-pulse" />
          ))
        ) : rewards.length === 0 ? (
          <div className="col-span-full bg-surface-container/85 rounded-2xl p-12 text-center border border-outline-variant/30">
            <Gift className="w-12 h-12 text-secondary/40 mx-auto mb-3" />
            <p className="text-on-surface-variant text-sm">No royal rewards configured yet</p>
          </div>
        ) : rewards.map((r) => (
          <div
            key={r._id}
            className={`glass-panel-elevated p-4 sm:p-5 flex flex-col justify-between transition-all ${
              !r.isActive ? 'opacity-60 border-dashed' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-on-surface text-base">{r.title}</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  r.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                }`}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{r.description || 'No description provided.'}</p>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="font-mono text-secondary font-semibold">
                {r.requiredStamps} Seals · {r.validityDays} Days Validity
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(r)}
                  className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
                  aria-label={`Edit ${r.title}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleActive(r)}
                  className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
                  aria-label={r.isActive ? 'Deactivate' : 'Activate'}
                >
                  {r.isActive ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-on-surface-variant/40" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
