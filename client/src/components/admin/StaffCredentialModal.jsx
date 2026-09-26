import { useState } from 'react';
import { X, UserPlus, Key, Copy, Check, Shield } from 'lucide-react';
import { copyToClipboard } from '../../utils';
import { validateStaffForm } from '../../validation/staffValidation';
import toast from 'react-hot-toast';

export default function StaffCredentialModal({ isOpen, onClose, onSubmit, loading = false, createdCredential = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateStaffForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  const handleCopy = async (text) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success('Concierge credentials copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-surface-container rounded-3xl border border-primary/40 shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface">
                {createdCredential ? 'Concierge Credentials Issued' : 'Provision Floor Staff'}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">Super Admin Governance</p>
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

        {createdCredential ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30">
              <span className="text-xs uppercase font-mono tracking-wider text-secondary font-bold block mb-1">
                ✓ Account Created Successfully
              </span>
              <p className="text-xs text-on-surface-variant">
                Share these login details securely with the floor member. They will sign in via the Staff Portal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-lowest font-mono text-xs space-y-2.5 border border-outline-variant/30">
              <div className="flex justify-between">
                <span className="text-outline">Portal URL:</span>
                <span className="text-primary font-bold">{window.location.origin}/staff/login</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Staff Member:</span>
                <span className="text-on-surface font-semibold">{createdCredential.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Email:</span>
                <span className="text-on-surface font-semibold">{createdCredential.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Password:</span>
                <span className="text-secondary font-bold">{createdCredential.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Designation:</span>
                <span className="text-on-surface uppercase font-bold">{createdCredential.role}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `Urban Maharaja Terminal Login\nPortal: ${window.location.origin}/staff/login\nEmail: ${createdCredential.email}\nPassword: ${createdCredential.password}`
                  )
                }
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Credentials'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface text-xs uppercase tracking-wider font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Staff Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Singh"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
              />
              {errors.name && <span className="text-xs text-error mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Staff Email (Login ID) *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. vikram@urbanmaharaja.com"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
              />
              {errors.email && <span className="text-xs text-error mt-1 block">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Initial Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
              />
              {errors.password && (
                <span className="text-xs text-error mt-1 block">{errors.password}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                >
                  <option value="STAFF">Floor Staff Concierge</option>
                  <option value="ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Mobile (Optional)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
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
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Generate Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
