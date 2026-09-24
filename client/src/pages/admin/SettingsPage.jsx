import { useState, useEffect } from 'react';
import { settingsApi } from '../../services/api';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getSettings();
      setSettings(res.data.data.settings);
    } catch (err) { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      toast.success('Settings saved');
    } catch (err) { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));
  const updateNested = (parent, field, value) => setSettings(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

  if (loading) return <div className="h-96 skeleton rounded-xl animate-pulse" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-deep-brown">Restaurant Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-royal text-sm flex items-center gap-1.5">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-royal space-y-4">
        <h2 className="font-serif text-lg text-deep-brown border-b border-warm-beige pb-2">Restaurant Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Name</label>
            <input value={settings?.restaurantName || ''} onChange={(e) => update('restaurantName', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Tagline</label>
            <input value={settings?.tagline || ''} onChange={(e) => update('tagline', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Phone</label>
            <input value={settings?.phone || ''} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Email</label>
            <input value={settings?.email || ''} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Address</label>
            <input value={settings?.address || ''} onChange={(e) => update('address', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
        </div>
      </div>

      {/* URLs */}
      <div className="bg-white rounded-xl p-6 shadow-royal space-y-4">
        <h2 className="font-serif text-lg text-deep-brown border-b border-warm-beige pb-2">URLs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Google Review URL</label>
            <input value={settings?.googleReviewUrl || ''} onChange={(e) => update('googleReviewUrl', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Google Maps URL</label>
            <input value={settings?.googleMapsUrl || ''} onChange={(e) => update('googleMapsUrl', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Reservation URL</label>
            <input value={settings?.reservationUrl || ''} onChange={(e) => update('reservationUrl', e.target.value)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" />
          </div>
        </div>
      </div>

      {/* Loyalty Config */}
      <div className="bg-white rounded-xl p-6 shadow-royal space-y-4">
        <h2 className="font-serif text-lg text-deep-brown border-b border-warm-beige pb-2">Loyalty Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Target Stamps</label>
            <input type="number" value={settings?.loyaltyConfig?.targetStamps || 5} onChange={(e) => updateNested('loyaltyConfig', 'targetStamps', parseInt(e.target.value) || 5)} className="w-full px-4 py-2.5 border border-warm-beige rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/50" min={1} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-deep-brown/70">Royal Surprise</label>
            <button
              type="button"
              onClick={() => updateNested('loyaltyConfig', 'isRoyalSurpriseEnabled', !settings?.loyaltyConfig?.isRoyalSurpriseEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.loyaltyConfig?.isRoyalSurpriseEnabled ? 'bg-success' : 'bg-warm-beige'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.loyaltyConfig?.isRoyalSurpriseEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
