import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { User, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({
        name,
        email: email || undefined,
        phone: phone || undefined,
      });
      updateUser(data.data.user);
      toast.success('Royal profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-slideUp text-on-surface">
      <div>
        <h1 className="font-serif text-2xl text-on-surface font-bold">Patron Profile</h1>
        <p className="text-xs text-on-surface-variant mt-1">Manage your royal account details and contact preferences</p>
      </div>

      <div className="bg-surface-container/85 rounded-3xl p-6 sm:p-8 border border-outline-variant/30 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-outline-variant/30">
          <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary shadow-md">
            <User className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-lg text-on-surface font-bold truncate">{user?.name}</h2>
            <p className="text-xs text-primary font-mono truncate">{user?.email || user?.phone}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
              Noble Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-high/80 border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-sans"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
              Royal Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-high/80 border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
              Mobile Contact <span className="text-[10px] text-on-surface-variant/60 lowercase">(optional for SMS)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-high/80 border border-outline-variant/40 rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-sans"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
