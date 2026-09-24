import { useState, useEffect } from 'react';
import { settingsApi } from '../../services/api';
import { Settings, Save, Building2, Globe, Sparkles } from 'lucide-react';
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
      toast.success('Palace configurations saved');
    } catch (err) { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));
  const updateNested = (parent, field, value) => setSettings(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

  if (loading) return <div className="h-96 rounded-2xl bg-surface-container/60 border border-outline-variant/30 animate-pulse" />;

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-on-surface font-bold">Restaurant &amp; Program Settings</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
            Configure contact metadata, reservations, review URLs, and Maharaja Card rules
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-surface-container/85 rounded-2xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg text-on-surface font-bold">Palace Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Establishment Name</label>
            <input
              value={settings?.restaurantName || ''}
              onChange={(e) => update('restaurantName', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Royal Tagline</label>
            <input
              value={settings?.tagline || ''}
              onChange={(e) => update('tagline', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Official Telephone</label>
            <input
              value={settings?.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Official Email</label>
            <input
              value={settings?.email || ''}
              onChange={(e) => update('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Palace Physical Address</label>
            <input
              value={settings?.address || ''}
              onChange={(e) => update('address', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* External Integration URLs */}
      <div className="bg-surface-container/85 rounded-2xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <Globe className="w-5 h-5 text-secondary" />
          <h2 className="font-serif text-lg text-on-surface font-bold">Integration Endpoints &amp; URLs</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Google Review Landing URL</label>
            <input
              value={settings?.googleReviewUrl || ''}
              onChange={(e) => update('googleReviewUrl', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Google Maps Embedded / Profile URL</label>
            <input
              value={settings?.googleMapsUrl || ''}
              onChange={(e) => update('googleMapsUrl', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Table Reservation Direct URL</label>
            <input
              value={settings?.reservationUrl || ''}
              onChange={(e) => update('reservationUrl', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Loyalty Pass Config */}
      <div className="bg-surface-container/85 rounded-2xl p-6 border border-outline-variant/30 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg text-on-surface font-bold">Digital Maharaja Card Rules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Target Seals Per Cycle</label>
            <input
              type="number"
              value={settings?.loyaltyConfig?.targetStamps || 5}
              onChange={(e) => updateNested('loyaltyConfig', 'targetStamps', parseInt(e.target.value) || 5)}
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-mono"
              min={1}
            />
            <span className="text-[11px] text-on-surface-variant/70 mt-1 block">Standard cycle is 5 seals for complimentary perk</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30">
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface font-semibold">Royal Surprise Seals</label>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Surprise complimentary stamps upon anniversary visits</p>
            </div>
            <button
              type="button"
              onClick={() => updateNested('loyaltyConfig', 'isRoyalSurpriseEnabled', !settings?.loyaltyConfig?.isRoyalSurpriseEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${settings?.loyaltyConfig?.isRoyalSurpriseEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.loyaltyConfig?.isRoyalSurpriseEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
