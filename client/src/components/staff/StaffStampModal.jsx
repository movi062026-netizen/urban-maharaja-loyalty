import { useState } from 'react';
import { X, Stamp, ShieldCheck, Upload, FileText, Image as ImageIcon, IndianRupee } from 'lucide-react';

export default function StaffStampModal({ guest, isOpen, onClose, onConfirm, loading = false }) {
  const [billAmount, setBillAmount] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [billFile, setBillFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  if (!isOpen || !guest) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setBillFile(null);
    setFilePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (billFile) {
      const formData = new FormData();
      formData.append('guestId', guest._id);
      if (billAmount) formData.append('billAmount', billAmount);
      if (billNumber) formData.append('billNumber', billNumber.trim());
      if (tableNumber) formData.append('tableNumber', tableNumber.trim());
      if (notes) formData.append('notes', notes.trim());
      formData.append('bill', billFile);
      onConfirm(formData);
    } else {
      onConfirm({
        guestId: guest._id,
        billAmount: billAmount ? Number(billAmount) : undefined,
        billNumber: billNumber ? billNumber.trim() : undefined,
        tableNumber: tableNumber ? tableNumber.trim() : undefined,
        notes: notes ? notes.trim() : undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-surface-container rounded-3xl border border-secondary/40 shadow-2xl overflow-hidden animate-slideUp text-on-surface max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">Grant &amp; Verify Royal Seal</h3>
              <p className="text-xs text-on-surface-variant font-mono">Floor Concierge Desk Authorization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Patron Card Info */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-secondary block font-bold">
                Honored Patron
              </span>
              <div className="font-serif text-base font-bold text-on-surface mt-0.5">
                {guest.name}
              </div>
              <div className="text-xs text-on-surface-variant font-mono mt-0.5">
                {guest.email || guest.phone}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center font-bold text-sm">
              {(guest.name || 'G').charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Dining Bill Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Bill / Receipt Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="e.g. 1250"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Receipt / Invoice #
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="e.g. UM-8492"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Bill Photo Upload / Drag */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Customer Bill Photo / Receipt (Auto-WebP)
            </label>
            {filePreview ? (
              <div className="relative rounded-2xl border border-secondary/40 overflow-hidden bg-surface-container-lowest p-2 flex items-center gap-3">
                <img src={filePreview} alt="Receipt Preview" className="w-16 h-16 object-cover rounded-xl border border-outline-variant/30" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-on-surface truncate">{billFile?.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">{(billFile?.size / 1024).toFixed(1)} KB • Ready to upload</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest/60 hover:bg-surface-container-lowest hover:border-secondary/60 transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-secondary mb-1.5" />
                <span className="text-xs font-medium text-on-surface">Click or drag receipt photo</span>
                <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">JPEG, PNG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Table / Booth & Service Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Table / Booth (Optional)
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 14"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Service Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Family dinner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-white text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Royal Seal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
