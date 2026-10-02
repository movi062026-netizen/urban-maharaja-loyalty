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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#e4d3c2] p-5 sm:p-7 shadow-[0_24px_60px_rgba(46,26,20,0.18)] text-on-surface overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eee0d2]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white shadow-md">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-secondary block font-sans">
                Dining Verification
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                Request Visit Seal
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-transparent hover:border-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 pt-4 flex-1">
          {/* Bill Photo Upload Zone */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
              Dining Bill Receipt *
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
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-[#d8c7b6] hover:border-primary/60 bg-[#fdfaf6]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e4d3c2] flex items-center justify-center mx-auto mb-3 text-primary shadow-xs">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-bold text-on-surface">
                  Click to capture or browse dining bill receipt
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </p>
                <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] text-secondary font-mono font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Cloudinary WebP Verified Receipt</span>
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl border border-primary/40 overflow-hidden bg-white shadow-xs">
                <img
                  src={preview}
                  alt="Dining Bill Preview"
                  className="w-full h-52 object-contain bg-[#fdfaf6]"
                />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="p-1.5 rounded-full bg-white/90 hover:bg-white border border-stone-200 text-on-surface shadow-xs transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 bg-white border-t border-[#eee0d2] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-secondary font-semibold truncate max-w-[200px]">
                    {file?.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-300">
                    Ready to Upload
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bill Metadata Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bill-number" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                Receipt / Invoice #
              </label>
              <input
                id="bill-number"
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                placeholder="e.g. UM-8924"
                className="w-full px-3.5 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="bill-amount" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
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
                className="w-full px-3.5 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface placeholder-on-surface-variant/40 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bill-date" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Dining Date
            </label>
            <input
              id="bill-date"
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fdfaf6] border border-[#e4d3c2] rounded-xl text-on-surface text-xs focus:outline-none focus:border-primary focus:bg-white transition-all font-mono shadow-xs"
            />
          </div>

          {/* Anti-Fraud Notice */}
          <div className="p-3.5 rounded-xl bg-[#fdfaf6] border border-[#ede0d2] flex items-start gap-2.5 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong className="text-secondary font-bold">Anti-Fraud Protection:</strong> Receipts are matched against POS logs. Duplicate bills or re-used images are automatically flagged and rejected.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-on-surface-variant text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-container via-[#d44877] to-secondary text-white text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Bill For Seal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
