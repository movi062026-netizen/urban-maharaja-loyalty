import { Search, UserCheck } from 'lucide-react';

export default function StaffPatronLookup({ searchQuery, onSearchChange, onSearchSubmit, searching = false }) {
  return (
    <form onSubmit={onSearchSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Lookup patron by email or phone (e.g. patron@urbanmaharaja.com)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-secondary transition-all placeholder:text-on-surface-variant/40"
        />
      </div>
      <button
        type="submit"
        disabled={searching}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-[#c29b38] text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
      >
        {searching ? (
          <span className="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <UserCheck className="w-4 h-4" />
            <span>Search</span>
          </>
        )}
      </button>
    </form>
  );
}
