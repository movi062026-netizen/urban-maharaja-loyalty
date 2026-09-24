import { useState, useEffect } from 'react';
import { rewardApi, adminApi } from '../../services/api';
import { Gift, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
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
        toast.success('Reward updated');
      } else {
        await rewardApi.createReward(form);
        toast.success('Reward created');
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-deep-brown">Reward Management</h1>
        <button onClick={() => { setShowForm(true); setEditingReward(null); setForm({ title: '', description: '', requiredStamps: 5, validityDays: 30, rewardType: 'COMPLIMENTARY_ITEM' }); }} className="btn-royal text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Reward
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-royal animate-scaleIn">
          <h2 className="font-serif text-lg text-deep-brown mb-4">{editingReward ? 'Edit Reward' : 'New Reward'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm" required maxLength={200} />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm" rows={3} maxLength={1000} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-1">Required Stamps</label>
                <input type="number" value={form.requiredStamps} onChange={(e) => setForm({ ...form, requiredStamps: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm" min={1} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-1">Validity (Days)</label>
                <input type="number" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm" min={1} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1">Reward Type</label>
              <select value={form.rewardType} onChange={(e) => setForm({ ...form, rewardType: e.target.value })} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50 text-sm">
                <option value="COMPLIMENTARY_ITEM">Complimentary Item</option>
                <option value="DISCOUNT_PERCENTAGE">Discount (%)</option>
                <option value="DISCOUNT_FLAT">Discount (Flat)</option>
                <option value="FREE_BEVERAGE">Free Beverage</option>
                <option value="SPECIAL_EXPERIENCE">Special Experience</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-royal text-sm">
                {editingReward ? 'Update Reward' : 'Create Reward'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingReward(null); }} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)
        ) : rewards.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-royal">
            <Gift className="w-10 h-10 text-warm-beige mx-auto mb-3" />
            <p className="text-deep-brown/40">No rewards configured yet</p>
          </div>
        ) : rewards.map((r) => (
          <div key={r._id} className={`bg-white rounded-xl p-4 shadow-royal flex items-center justify-between ${!r.isActive ? 'opacity-60' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-deep-brown">{r.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.isActive ? 'bg-success/10 text-success' : 'bg-warm-beige text-deep-brown/40'}`}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-deep-brown/40 mt-0.5">{r.description}</p>
              <p className="text-xs text-royal-gold mt-1">{r.requiredStamps} stamps · {r.validityDays} days validity</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-cream" aria-label={`Edit ${r.title}`}>
                <Edit2 className="w-4 h-4 text-deep-brown/40" />
              </button>
              <button onClick={() => toggleActive(r)} className="p-2 rounded-lg hover:bg-cream" aria-label={r.isActive ? 'Deactivate' : 'Activate'}>
                {r.isActive ? <ToggleRight className="w-5 h-5 text-success" /> : <ToggleLeft className="w-5 h-5 text-deep-brown/30" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
