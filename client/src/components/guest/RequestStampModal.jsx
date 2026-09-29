import { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestStampModal({ isOpen, onClose, onSubmit, submitting }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [billNumber, setBillNumber] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, or WEBP)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size cannot exceed 10 MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please attach a clear photo of your dining bill receipt');
      return;
    }

    const formData = new FormData();
    formData.append('bill', file);
    if (billNumber.trim()) formData.append('billNumber', billNumber.trim());
    if (billAmount) formData.append('billAmount', billAmount);
    if (billDate) formData.append('billDate', billDate);

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container/95 border border-primary/30 p-5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.9)] text-on-surface overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                Request Visit Seal
              </h2>
              <p className="text-[11px] text-on-surface-variant font-sans">
                Upload your dining bill for concierge verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 pt-4 flex-1">
          {/* Bill Photo Upload Zone */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
              Dining Bill Receipt (Converted to WebP format) *
            </label>

            {!preview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : 'border-outline-variant/40 hover:border-primary/60 bg-surface-container-high/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3 text-primary">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-on-surface">
                  Click to capture or browse dining bill
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </p>
                <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 text-[10px] text-secondary font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-transcoded to WebP on Cloudinary</span>
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-primary/40 overflow-hidden bg-surface-container-lowest">
                <img
                  src={preview}
                  alt="Dining Bill Preview"
                  className="w-full h-52 object-contain bg-black/60"
                />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="p-1.5 rounded-full bg-surface-container/80 hover:bg-surface-container border border-outline-variant/40 text-on-surface transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2.5 bg-surface-container-high/90 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-secondary truncate max-w-[200px]">
                    {file?.name}
                  </span>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    Ready for Cloudinary WebP
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bill Metadata Details (Assists with Anti-Fraud Validation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bill-number" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                Receipt / Invoice #
              </label>
              <input
                id="bill-number"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="e.g. UM-8924"
                className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>

            <div>
              <label htmlFor="bill-amount" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                Total Bill Amount (₹)
              </label>
              <input
                id="bill-amount"
                type="number"
                min="0"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="e.g. 1450"
                className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bill-date" className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Dining Date
            </label>
            <input
              id="bill-date"
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface text-xs focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          {/* Anti-Fraud Notice */}
          <div className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-2.5 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Imperial Anti-Fraud Guarantee:</strong> Receipts are verified against restaurant POS logs. Duplicate bills or re-used receipt images are automatically detected and rejected.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !file}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#e882a3] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Bill &amp; Request Seal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
