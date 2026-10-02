import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[18px]">history_edu</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary">
              Imperial Chronicles & Provenance
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
            The Legend of <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Urban Maharaja
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Resurrecting the lost culinary scrolls of Rajputana palaces and Awadh royal dastarkhāns, crafted for modern patrons of fine gastronomy.
          </p>
        </div>
      </motion.section>

      {/* ── Main Heritage Narrative ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full py-20 bg-surface-container-lowest overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Chapter 1: The Royal Origin */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-outline-variant/40 shadow-[0_24px_50px_rgba(46,26,20,0.12)] bg-surface-container-high">
                <img
                  className="w-full h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                  alt="Historic Indian Palace Dining"
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-surface-container/90 border border-primary/20 backdrop-blur-lg">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
                    Jaipur Heritage Archives • Circa 1928
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-surface italic mt-1">
                    “A repast is not measured in minutes, but in centuries of patience.”
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="font-label-lg text-label-lg uppercase tracking-[0.2em] text-primary">
                Chapter I • The Khansama Lineage
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Heirloom Recipes Passed Through Generations
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Urban Maharaja was established to honor the sacred culinary rituals of the royal palaces. In ancient courtyards, master Khansamas prepared meals as offerings of devotion, measuring herbs by the celestial calendar and slow-roasting gravies inside sealed copper deghs buried under hot charcoal embers.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Today, our executive culinary team guards these very handwritten parchment manuscripts. We hand-pound our masalas in stone sil-battas and procure Kashmiri saffron filaments directly from family orchards in Pampore.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <p className="font-display-lg text-headline-lg text-primary font-bold">98 yrs</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Archived Recipes</p>
                </div>
                <div className="w-px h-12 bg-outline-variant/40" />
                <div>
                  <p className="font-display-lg text-headline-lg text-secondary font-bold">160+</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Rare Spices & Herbs</p>
                </div>
                <div className="w-px h-12 bg-outline-variant/40" />
                <div>
                  <p className="font-display-lg text-headline-lg text-primary font-bold">24K</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Edible Gold Vark</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter 2: The Three Pillars of Royal Gastronomy */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-secondary mb-2 block">
                The Sacred Tenets
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Three Pillars of the Royal Dastarkhān
              </h2>
              <div className="w-16 h-0.5 bg-primary-container mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Dhungar & Dum Cooking</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Claypots and hand-forged brass cauldrons are sealed with whole wheat dough, slowly braised over low smoldering embers to infuse every morsel with fragrant wood smoke.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/30 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                  14–36 Hour Slow Simmer
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-secondary/40 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">stars</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Purity of Ingredients</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Single-estate extra virgin mustard oils, churned A2 cultured ghee, and whole wild spices toasted fresh every morning on cast iron griddles without artificial substitutes.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase tracking-widest">
                  Zero Preservatives
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/25 border border-primary/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">shield_with_heart</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Transcendent Atithi Seva</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    In Rajasthan, the guest is revered as the divine. We welcome every diner with warm rosewater towels, complimentary digestive mukhwas, and bespoke royal hospitality.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/30 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                  Sovereign Hospitality
                </div>
              </div>
            </div>
          </div>

          {/* Accolades & CTA Banner */}
          <div className="rounded-3xl p-8 lg:p-14 bg-gradient-to-r from-surface-container-lowest via-surface-container-high to-surface-container-lowest border border-outline-variant/40 shadow-2xl text-center">
            <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-secondary mb-2 block">
              Experience The Grandeur
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
              Begin Your Royal Repast Tonight
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-white font-label-md uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all no-underline"
              >
                Reserve A Sovereign Table
              </Link>
              <Link
                to="/menu"
                className="px-8 py-3.5 rounded-full bg-surface-container-high text-on-surface hover:text-primary font-label-md uppercase tracking-[0.16em] border border-outline-variant/50 hover:border-primary/40 transition-all no-underline"
              >
                Explore The Royal Carte
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
