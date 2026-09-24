import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { User, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ name, email: email || undefined });
      updateUser(data.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <h1 className="font-serif text-2xl text-deep-brown">Profile</h1>

      <div className="bg-white rounded-2xl p-6 shadow-royal">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-warm-beige">
          <div className="w-14 h-14 rounded-full bg-royal-rose/10 flex items-center justify-center">
            <User className="w-7 h-7 text-royal-rose" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-deep-brown">{user?.name}</h2>
            <p className="text-xs text-deep-brown/40">{user?.phone}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-deep-brown/70 mb-1">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-deep-brown/70 mb-1">Email (optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-warm-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold/50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-brown/70 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-brown/30" />
              <input
                type="tel"
                value={user?.phone || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-warm-beige rounded-xl bg-cream text-deep-brown/50"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-royal w-full flex items-center justify-center gap-2">
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
