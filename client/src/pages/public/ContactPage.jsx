import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full max-w-full bg-background min-h-screen text-on-surface overflow-x-hidden">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[450px] bg-primary-container/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] max-w-full h-[300px] bg-secondary-container/20 rounded-full blur-[110px]" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[18px]">room_service</span>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
              Palace Concierge & Reservations
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-on-surface max-w-4xl tracking-tight leading-[1.25] mb-6 font-bold">
            Reserve Your <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Imperial Table
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-4">
            Located in Jagatpura, Jaipur. Due to our commitment to slow charcoal braising and personalized master-chef service, seating is strictly limited nightly.
          </p>
        </div>
      </motion.section>

      {/* ── Main Booking & Concierge Grid ────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-full py-16 bg-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left: Interactive Table Reservation Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-10 rounded-3xl bg-surface-container/70 border border-outline-variant/40 backdrop-blur-xl shadow-2xl">
                <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
                  Sovereign Booking
                </span>
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-on-surface font-bold mb-6">
                  Confirm Your Dining Room
                </h2>

                {isSubmitted ? (
                  <div className="p-8 rounded-2xl bg-surface-container-high/90 border border-primary/40 text-center space-y-4">
                    <span className="material-symbols-outlined text-primary text-[48px]">check_circle</span>
                    <h3 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
                      Your Imperial Table is Reserved
                    </h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-primary font-bold">{formData.name}</span>. A VIP reservation confirmation SMS has been dispatched for {formData.guests} in the {formData.seating}.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-surface-container border border-primary/30 text-primary text-xs uppercase tracking-wider font-bold cursor-pointer hover:bg-primary hover:text-on-primary transition-all"
                    >
                      Make Another Booking
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                          Patron Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Maharaja Ankit Kumar"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                          Time Slot
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
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
                        <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                          Party Size
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
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
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                        Preferred Palace Pavilion
                      </label>
                      <select
                        value={formData.seating}
                        onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Main Pavilion">Main Pavilion (Grand Chandelier & Sitar Ambiance)</option>
                        <option value="Jharokha Alcove">Jharokha Alcove (Private Carved Stone Arch)</option>
                        <option value="Chef's Tasting Table">Chef’s Tasting Table (Front Row Culinary Theatre)</option>
                        <option value="Royal Terrace">Royal Terrace (Candlelit Outdoor Courtyard)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-2">
                        Special Requests & Dietary Preferences
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Anniversaries, spice preferences, Jain/vegan requests, or pairing guidance..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary text-white text-xs uppercase tracking-[0.16em] font-bold shadow-xl hover:brightness-110 transition-all cursor-pointer"
                    >
                      Confirm Imperial Reservation
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Concierge Contacts & Location */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/40 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold block mb-1">
                    VIP Concierge
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
                    Direct Palace Line
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-on-surface-variant">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">location_on</span>
                    <div>
                      <p className="text-on-surface font-bold mb-1">Restaurant Location</p>
                      <a
                        href="https://share.google/2nmScZz1II7jKmnKO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leading-relaxed text-primary hover:underline block"
                      >
                        AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur ↗
                      </a>
                      <p className="text-[11px] text-primary mt-1 font-semibold">Parking Available</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">call</span>
                    <div>
                      <p className="text-on-surface font-bold mb-0.5">Telephone Concierge</p>
                      <p className="text-primary font-mono text-sm">+91 98765 43210 / +1 (800) MAHARAJA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">mail</span>
                    <div>
                      <p className="text-on-surface font-bold mb-0.5">Imperial Inquiries</p>
                      <p className="text-secondary font-mono text-sm">concierge@urbanmaharaja.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">schedule</span>
                    <div>
                      <p className="text-on-surface font-bold mb-0.5">Service Hours</p>
                      <p>Lunch: 12:00 PM – 03:30 PM</p>
                      <p>Dinner: 07:00 PM – 11:30 PM</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Open All 7 Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dress Code & House Rules Note */}
              <div className="p-6 rounded-3xl bg-surface-container/60 border border-primary/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-[20px]">checkroom</span>
                  <span className="text-xs uppercase tracking-widest font-bold">
                    Guest Dress Code
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We kindly request elegant evening attire or traditional royal dress. Athletic wear, slippers, and caps are respectfully restricted to maintain imperial ambiance.
                </p>
              </div>
            </div>
          </div>

          {/* ── Interactive Google Maps Embed ─────────────────────────── */}
          <div className="mt-14 rounded-3xl overflow-hidden border border-outline-variant/40 shadow-2xl bg-surface-container/60 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-3 mb-2">
              <div className="flex items-center gap-2.5 text-primary">
                <span className="material-symbols-outlined text-[24px]">map</span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                    Urban Maharaja on Google Maps
                  </h3>
                  <p className="text-xs text-on-surface-variant font-sans">
                    AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://share.google/2nmScZz1II7jKmnKO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black text-xs uppercase tracking-wider font-bold shadow-md transition-all no-underline w-fit"
                >
                  <span>⭐ Rate on Google</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>

                <a
                  href="https://www.google.com/maps/place/URBAN+MAHARAJA/@26.8069227,75.8578327,17z/data=!3m1!4b1!4m6!3m5!1s0x396dc90049d7c731:0xe9bd1d09e13e2817!8m2!3d26.8069227!4d75.8578327!16s%2Fg%2F11w2_b84t7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-primary/30 text-primary text-xs uppercase tracking-wider font-bold hover:bg-primary hover:text-on-primary transition-all no-underline w-fit"
                >
                  <span>Get Directions</span>
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                </a>
              </div>
            </div>

            <div className="w-full h-80 sm:h-[450px] rounded-2xl overflow-hidden border border-primary/20 bg-surface-container-lowest">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.037872463936!2d75.8578327!3d26.806922699999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc90049d7c731%3A0xe9bd1d09e13e2817!2sURBAN%20MAHARAJA!5e0!3m2!1sen!2sin!4v1790270281743!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Urban Maharaja Google Maps Location"
              />
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
