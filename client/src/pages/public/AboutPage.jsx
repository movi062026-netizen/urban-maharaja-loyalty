import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const googleMapsUrl = 'https://share.google/2nmScZz1II7jKmnKO';

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface-container/90 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary font-bold">
              About Urban Maharaja
            </span>
          </div>

          <h1 className="font-display-lg text-3xl sm:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight leading-tight mb-6 font-bold">
            Good food, good company, <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              and a place to enjoy it all.
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-4 text-base sm:text-lg text-on-surface-variant leading-relaxed">
            <p className="font-medium text-on-surface">
              Urban Maharaja welcomes you to enjoy a variety of comforting flavours, from Indian favourites and tandoori dishes to snacks, beverages and more.
            </p>
            <p>
              Visit us in Jagatpura, Jaipur, and make your next meal a little more rewarding.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-md uppercase tracking-[0.14em] font-bold shadow-lg hover:brightness-110 transition-all no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span>Find Us on Google Maps</span>
              <span className="text-xs">↗</span>
            </a>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-md uppercase tracking-[0.14em] font-bold border border-outline-variant/60 hover:border-primary/40 transition-all no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Explore Menu</span>
            </Link>
            <Link
              to="/loyalty"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-md uppercase tracking-[0.14em] font-bold border border-outline-variant/60 hover:border-primary/40 transition-all no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">loyalty</span>
              <span>Rewards Program</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── What We Welcome You With ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full py-14 sm:py-20 bg-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Feature Showcase Grid */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary font-bold mb-2 block">
              What Awaits You
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-4xl text-on-surface font-bold mb-4">
              A Warm, Comforting Dining Experience
            </h2>
            <div className="w-16 h-1 bg-primary-container mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {/* Card 1 */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-surface-container/80 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Indian Favourites</h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Wholesome curries, slow-simmered gravies, rich dal makhani, and fragrant biryanis prepared with authentic spices and genuine hospitality.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/30 text-primary font-label-sm text-xs font-bold uppercase tracking-wider">
                Fresh &amp; Hearty
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-surface-container/80 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Tandoori Dishes</h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Freshly baked naans and rotis, alongside smoky paneer tikkas, soya chaaps, and sizzling platters straight from our traditional clay tandoor.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/30 text-secondary font-label-sm text-xs font-bold uppercase tracking-wider">
                Clay Oven Speciality
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-surface-container/80 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">local_cafe</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Snacks &amp; Beverages</h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Crispy starters, delicious appetizers, handcrafted mocktails, artisanal shakes, and freshly brewed hot beverages for every gathering.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/30 text-primary font-label-sm text-xs font-bold uppercase tracking-wider">
                Refreshing &amp; Crisp
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-surface-container/80 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">military_tech</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Rewarding Visits</h3>
                <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                  Every visit counts with our digital loyalty stamp card. Collect stamps with your meals and redeem delicious rewards right at your table.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-outline-variant/30 text-secondary font-label-sm text-xs font-bold uppercase tracking-wider">
                Loyalty Per Meal
              </div>
            </div>
          </div>

          {/* ── Location Card with Google Maps Link ─────────────────────── */}
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 bg-surface-container/90 border border-outline-variant/50 shadow-xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  <span>Restaurant Location</span>
                </div>

                <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold">
                  Visit Us in Jagatpura, Jaipur
                </h2>

                <div className="p-5 rounded-2xl bg-surface-container-high/80 border border-outline-variant/40 space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">location_on</span>
                    <div>
                      <p className="font-bold text-on-surface text-base">Location:</p>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-container font-medium text-base underline decoration-primary/40 underline-offset-4 transition-colors block"
                      >
                        AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur
                      </a>
                      <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs sm:text-sm font-mono font-bold text-secondary">
                        <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                        <a href="tel:+919414644988" className="hover:text-primary transition-colors no-underline">+91 94146 44988</a>
                        <span>•</span>
                        <a href="tel:+919082035880" className="hover:text-primary transition-colors no-underline">+91 90820 35880</a>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Conveniently situated in Central Spine, Jagatpura with parking available. Whether you are dropping in for a casual family lunch, dinner with friends, or celebrating a special occasion, our team is excited to host you.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all no-underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    <span>Open in Google Maps</span>
                    <span className="text-xs">↗</span>
                  </a>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-high border border-outline-variant/60 text-on-surface hover:text-primary font-bold text-xs uppercase tracking-wider transition-all no-underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span>Reserve a Table</span>
                  </Link>
                </div>
              </div>

              {/* Map embed / Interactive View */}
              <div className="lg:col-span-6">
                <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-outline-variant/40 shadow-inner bg-surface-container-lowest relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.037872463936!2d75.8578327!3d26.806922699999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc90049d7c731%3A0xe9bd1d09e13e2817!2sURBAN%20MAHARAJA!5e0!3m2!1sen!2sin!4v1790270281743!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Urban Maharaja Location Map"
                  />
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-surface-container/95 backdrop-blur-sm border border-outline-variant/40 text-xs font-bold text-on-surface hover:text-primary shadow flex items-center gap-1.5 no-underline"
                  >
                    <span>View Larger Map</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Call To Action ─────────────────────────────────── */}
          <div className="rounded-3xl p-8 lg:p-12 bg-gradient-to-r from-surface-container-lowest via-surface-container-high to-surface-container-lowest border border-outline-variant/40 shadow-lg text-center">
            <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
              Make Your Next Meal Rewarding
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold mb-4">
              Join Us at Urban Maharaja
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              We look forward to serving you genuine flavours, hearty meals, and warm hospitality every day of the week.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/loyalty"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-md uppercase tracking-[0.14em] font-bold shadow-lg hover:brightness-110 transition-all no-underline"
              >
                Join Rewards Program
              </Link>
              <Link
                to="/menu"
                className="px-8 py-3.5 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-md uppercase tracking-[0.14em] font-bold border border-outline-variant/60 hover:border-primary/40 transition-all no-underline"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
