import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { User, Mail, Phone, Save, ShieldCheck, Sparkles } from 'lucide-react';
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
      toast.success('Royal profile details updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 animate-slideUp text-on-surface"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eee0d2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
              Noble Patron Account
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">Patron Profile</h1>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            Manage your personal profile, credentials, and notification contact details
          </p>
        </div>
      </div>

      <div className="rounded-[28px] bg-white border border-[#e4d3c2] shadow-[0_16px_45px_-12px_rgba(46,26,16,0.08)] p-6 sm:p-8 lg:p-10 max-w-2xl">
        {/* User Card Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#eee0d2]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-md border-2 border-white">
            <User className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Verified Court Member
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold truncate mt-1">
              {user?.name || 'Noble Guest'}
            </h2>
            <p className="text-xs text-secondary font-mono truncate mt-0.5">
              {user?.email || user?.phone}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
              Noble Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-sans shadow-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
              Royal Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-sans shadow-xs"
                placeholder="patron@urbanmaharaja.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
              Mobile Contact <span className="text-[10px] text-on-surface-variant/60 font-normal lowercase">(used for SMS seal alerts)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-11 pr-4 py-3 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container via-[#d44877] to-secondary text-white text-xs uppercase tracking-[0.16em] font-bold shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
    </motion.div>
  );
}
