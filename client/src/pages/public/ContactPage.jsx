import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '2026-09-25',
    time: '19:30',
    guests: '2 Royalty',
    seating: 'Main Pavilion',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please provide your name and phone number for the reservation');
      return;
    }
    setIsSubmitted(true);
    toast.success(`Royal reservation confirmed for ${formData.name}! Our concierge will contact you.`);
  };

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[18px]">room_service</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary">
              Palace Concierge & Reservations
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
            Reserve Your <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Imperial Table
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Due to our commitment to slow charcoal braising and personalized master-chef service, seating is strictly limited nightly.
          </p>
        </div>
      </section>

      {/* ── Main Booking & Concierge Grid ────────────────────────────── */}
      <section className="relative w-full py-16 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Interactive Table Reservation Form */}
            <div className="lg:col-span-7">
              <div className="p-8 lg:p-10 rounded-3xl bg-surface-container/70 border border-outline-variant/40 backdrop-blur-xl shadow-2xl">
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary mb-2 block">
                  Sovereign Booking
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
                  Confirm Your Dining Room
                </h2>

                {isSubmitted ? (
                  <div className="p-8 rounded-2xl bg-surface-container-high/90 border border-primary/40 text-center space-y-4">
                    <span className="material-symbols-outlined text-primary text-[48px]">check_circle</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Your Imperial Table is Reserved
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
                      Thank you, <span className="text-primary font-bold">{formData.name}</span>. A VIP reservation confirmation SMS has been dispatched for {formData.guests} in the {formData.seating}.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-surface-container border border-primary/30 text-primary font-label-sm uppercase tracking-wider cursor-pointer"
                    >
                      Make Another Booking
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                          Patron Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Maharaja Ankit Kumar"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-body-sm focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-body-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                          Time Slot
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="12:30">12:30 PM (Royal Lunch)</option>
                          <option value="13:30">01:30 PM (Royal Lunch)</option>
                          <option value="19:00">07:00 PM (Sunset Degustation)</option>
                          <option value="19:30">07:30 PM (Evening Banquet)</option>
                          <option value="20:30">08:30 PM (Imperial Night)</option>
                          <option value="21:30">09:30 PM (Late Repast)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                          Party Size
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="1 Guest">1 Guest</option>
                          <option value="2 Royalty">2 Royalty</option>
                          <option value="4 Royalty">4 Royalty</option>
                          <option value="6 Royalty">6 Royalty</option>
                          <option value="8+ Banquet">8+ Royal Banquet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                        Preferred Palace Pavilion
                      </label>
                      <select
                        value={formData.seating}
                        onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Main Pavilion">Main Pavilion (Grand Chandelier & Sitar Ambiance)</option>
                        <option value="Jharokha Alcove">Jharokha Alcove (Private Carved Stone Arch)</option>
                        <option value="Chef's Tasting Table">Chef’s Tasting Table (Front Row Culinary Theatre)</option>
                        <option value="Royal Terrace">Royal Terrace (Candlelit Outdoor Courtyard)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
                        Special Requests & Dietary Preferences
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Anniversaries, spice preferences, Jain/vegan requests, or pairing guidance..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-body-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-xl hover:brightness-110 transition-all cursor-pointer"
                    >
                      Confirm Imperial Reservation
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Concierge Contacts & Location */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/40 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
                    VIP Concierge
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                    Direct Palace Line
                  </h3>
                </div>

                <div className="space-y-4 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px]">call</span>
                    <div>
                      <p className="text-on-surface font-semibold">Telephone Concierge</p>
                      <p className="text-primary font-mono text-sm">+1 (800) MAHARAJA / +91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[22px]">mail</span>
                    <div>
                      <p className="text-on-surface font-semibold">Imperial Inquiries</p>
                      <p className="text-secondary font-mono text-sm">concierge@urbanmaharaja.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px]">location_on</span>
                    <div>
                      <p className="text-on-surface font-semibold">Palace Location</p>
                      <p>Heritage Palace Boulevard, Suite 700</p>
                      <p className="text-xs text-on-surface-variant/70 mt-0.5">Complimentary Valet Parking Available</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[22px]">schedule</span>
                    <div>
                      <p className="text-on-surface font-semibold">Service Hours</p>
                      <p>Lunch: 12:00 PM – 03:30 PM</p>
                      <p>Dinner: 07:00 PM – 11:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dress Code & House Rules Note */}
              <div className="p-6 rounded-3xl bg-surface-container/60 border border-primary/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-[20px]">checkroom</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                    Guest Dress Code
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  We kindly request elegant evening attire or traditional royal dress. Athletic wear, slippers, and caps are respectfully restricted to maintain imperial ambiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
