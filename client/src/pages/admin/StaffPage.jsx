import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { UserCog, Plus, ShieldCheck, Mail, Key, Check, Copy, UserX, UserCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: 'Staff@123',
    role: 'STAFF',
  });
  const [createdCredential, setCreatedCredential] = useState(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStaff();
      setStaffList(res.data.data.staff || []);
    } catch (err) {
      toast.error('Failed to retrieve staff roster');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error('All fields are required');
      return;
    }

    setCreating(true);
    try {
      const res = await adminApi.createStaff(newStaff);
      toast.success(`Credentials created for ${newStaff.name}`);
      setCreatedCredential({
        name: newStaff.name,
        email: newStaff.email,
        password: newStaff.password,
        role: newStaff.role,
      });
      setNewStaff({ name: '', email: '', password: 'Staff@123', role: 'STAFF' });
      loadStaff();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to create staff credentials');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (staffMember) => {
    const nextStatus = !staffMember.isActive;
    try {
      await adminApi.updateStaff(staffMember._id, { isActive: nextStatus });
      toast.success(`${staffMember.name} is now ${nextStatus ? 'Active' : 'Deactivated'}`);
      loadStaff();
    } catch (err) {
      toast.error('Failed to update staff status');
    }
  };

  const handleCopyCredentials = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-on-surface">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold">
            Staff & Concierge Management
          </h1>
          <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1">
            Issue and govern terminal credentials for stamp desk attendants and system administrators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStaff}
            className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Refresh Staff Roster"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCreatedCredential(null);
              setShowModal(true);
            }}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl glass-btn-primary text-[10px] sm:text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Staff Credentials</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Cards / Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-surface-container/60 border border-outline-variant/30" />
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface-container/40 border border-outline-variant/30">
          <UserCog className="w-12 h-12 text-primary/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-on-surface font-semibold">No Staff Registered</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Click &quot;Issue Staff Credentials&quot; above to create terminal access for restaurant staff.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((member) => (
            <div
              key={member._id}
              className="glass-panel-elevated p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider ${
                      member.role === 'ADMIN'
                        ? 'bg-primary-container/30 text-primary border border-primary/40'
                        : 'bg-secondary-container/30 text-secondary border border-secondary/40'
                    }`}
                  >
                    {member.role === 'ADMIN' ? 'Super Admin' : 'Staff Concierge'}
                  </span>
                </div>

                <h3 className="font-serif text-base text-on-surface font-bold">{member.name}</h3>
                <p className="text-xs text-on-surface-variant font-mono flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </p>

                <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant/70">
                  <span>Status:</span>
                  <span className={`font-semibold ${member.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {member.isActive ? '● Active' : '○ Suspended'}
                  </span>
                </div>

                {member.lastLoginAt && (
                  <p className="text-[10px] text-on-surface-variant/50 mt-1">
                    Last active: {new Date(member.lastLoginAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(member)}
                  className={`text-xs flex items-center gap-1.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                    member.isActive
                      ? 'text-red-300 hover:bg-red-500/10'
                      : 'text-green-300 hover:bg-green-500/10'
                  }`}
                >
                  {member.isActive ? (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyCredentials(`Email: ${member.email}`)}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy email"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE STAFF CREDENTIALS MODAL ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-2xl relative animate-scaleUp">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container/25 border border-primary/30 flex items-center justify-center text-primary">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-on-surface">Issue Staff Credentials</h2>
                  <p className="text-[11px] text-on-surface-variant">Create login key for restaurant staff</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {createdCredential ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary-container/20 border border-primary/40 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-on-surface">Credentials Created Successfully!</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Provide the following login credentials to the staff member:
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Role:</span>
                    <span className="text-secondary font-bold">{createdCredential.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Email:</span>
                    <span className="text-primary font-bold">{createdCredential.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Password:</span>
                    <span className="text-on-surface font-bold">{createdCredential.password}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCredentials(`Urban Maharaja Terminal Login\nPortal: http://localhost:5173/admin/login\nEmail: ${createdCredential.email}\nPassword: ${createdCredential.password}`)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreatedCredential(null);
                      setShowModal(false);
                    }}
                    className="px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                    Staff Full Name
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="e.g. Pooja Verma"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                    Staff Official Email
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="pooja@urbanmaharaja.com"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                    Terminal Key (Password)
                  </label>
                  <input
                    type="text"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs font-mono focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                    Access Clearance Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="STAFF">STAFF (Concierge Desk &amp; Stamps)</option>
                    <option value="ADMIN">ADMIN (Full Imperial Control)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {creating ? (
                      <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Issue Imperial Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
