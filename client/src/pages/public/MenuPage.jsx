import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  'All Creations',
  'Royal Starters',
  'Dum Biryanis & Rice',
  'Imperial Curries',
  'Heritage Tandoor',
  'Grand Desserts',
  'Cellar & Pairings',
];

const menuItems = [
  {
    id: 1,
    category: 'Imperial Curries',
    name: 'Dal Maharaja Bukhara',
    badge: '36-Hour Charcoal Embers',
    price: '₹695',
    pairing: 'Barolo Riserva 2018',
    description: 'Whole black lentils simmered continuously for 36 hours on smoldering charcoal, finished with hand-churned village butter, ripe plum tomatoes, and ginger juliennes.',
    isVegetarian: true,
    isSignature: true,
  },
  {
    id: 2,
    category: 'Dum Biryanis & Rice',
    name: 'Shahi Murgh Dum Biryani',
    badge: 'Clay Pot Sealed Dum',
    price: '₹895',
    pairing: 'Meursault Premier Cru',
    description: 'Aged Dehradun extra-long basmati steeped in Kashmiri saffron, wild rose water, and organic spring chicken, sealed under a whole wheat crust with 24k gold leaf.',
    isVegetarian: false,
    isSignature: true,
  },
  {
    id: 3,
    category: 'Royal Starters',
    name: 'Nawabi Galouti & Sheermal',
    badge: '160 Potent Spices',
    price: '₹845',
    pairing: 'Syrah Rhône Valley',
    description: 'Melt-in-the-mouth smoked baby lamb patties infused with raw papaya and pan-seared in rich clarified butter, served over warm saffron-cardamom brioche biscuits.',
    isVegetarian: false,
    isSignature: true,
  },
  {
    id: 4,
    category: 'Royal Starters',
    name: 'Gilded Malai Paneer Tikka',
    badge: 'Charcoal Smoked',
    price: '₹645',
    pairing: 'Chardonnay Napa Valley',
    description: 'Fresh farmhouse paneer marinated in condensed milk, green cardamom, roasted mace, and crushed saffron, charred over tamarind wood in the clay tandoor.',
    isVegetarian: true,
    isSignature: false,
  },
  {
    id: 5,
    category: 'Imperial Curries',
    name: 'Awadhi Nalli Nihari',
    badge: '14-Hour Slow Braise',
    price: '₹995',
    pairing: 'Brunello di Montalcino',
    description: 'Prime baby lamb shanks simmered overnight with bone marrow broth, vetiver, rose petals, and thirty-two rare spices, garnished with ginger needles and lime.',
    isVegetarian: false,
    isSignature: true,
  },
  {
    id: 6,
    category: 'Heritage Tandoor',
    name: 'Royal Bhatti Murgh Kebab',
    badge: 'Clay Oven Roasted',
    price: '₹795',
    pairing: 'Pinot Noir Burgundy',
    description: 'Boneless chicken thighs steeped in cold-pressed mustard oil, sour curd, Mathania red chilies, and black cardamom, roasted over white-hot embers.',
    isVegetarian: false,
    isSignature: false,
  },
  {
    id: 7,
    category: 'Grand Desserts',
    name: 'Kesar Shahi Tukda Gold Foil',
    badge: '24K Edible Gold',
    price: '₹495',
    pairing: 'Sauternes Bordeaux',
    description: 'Crisp ghee-fried milk bread soaked in reduced saffron rabri, garnished with Persian pistachio slivers, silver chandi, and 24-karat pure edible gold leaf.',
    isVegetarian: true,
    isSignature: true,
  },
  {
    id: 8,
    category: 'Grand Desserts',
    name: 'Royal Rose Petal Kulfi',
    badge: 'Chilled Silver Pot',
    price: '₹395',
    pairing: 'Late Harvest Riesling',
    description: 'Hand-churned condensed milk ice scented with Damask wild rose essence, falooda noodles, and crushed green cardamom seeds.',
    isVegetarian: true,
    isSignature: false,
  },
  {
    id: 9,
    category: 'Cellar & Pairings',
    name: 'Sommelier Imperial Pairing Flight',
    badge: '5 Curated Glasses',
    price: '₹2,450',
    pairing: 'Custom Degustation',
    description: 'A bespoke wine and single-malt accompaniment journey hand-selected by our head sommelier to harmonize each course of your banquet.',
    isVegetarian: true,
    isSignature: true,
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All Creations');

  const filteredItems = activeCategory === 'All Creations'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md border border-primary/30 shadow-md mb-6">
            <span className="material-symbols-outlined text-primary text-[18px]">restaurant_menu</span>
            <span className="font-label-md text-label-md uppercase tracking-[0.25em] text-primary">
              The Royal Degustation & À La Carte
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight mb-6">
            Imperial <br />
            <span className="italic bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent font-normal">
              Gastronomic Carte
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8">
            Each creation is an ode to ancient royal banquet halls, simmered in unglazed claypots, kissed by fragrant charcoal embers, and crowned with edible gold.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-[0.14em] transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-bold border-transparent shadow-lg scale-105'
                    : 'bg-surface-container-high/80 text-on-surface-variant border-outline-variant/40 hover:text-primary hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Grid ────────────────────────────────────────────────── */}
      <section className="relative w-full py-16 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl p-7 bg-surface-container/70 border border-outline-variant/30 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:bg-surface-container-high hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-primary/30 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                      {item.badge}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <span className="material-symbols-outlined text-[16px]">
                      {item.isVegetarian ? 'eco' : 'skillet'}
                    </span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest">
                      {item.isVegetarian ? 'Royal Vegetarian' : 'Imperial Non-Veg'}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-on-surface-variant/80 font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-primary text-[16px]">wine_bar</span>
                    <span>Pairing: {item.pairing}</span>
                  </div>

                  <Link
                    to="/contact"
                    className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/40 hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center text-primary no-underline"
                    title="Reserve this dish"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Table Reservation CTA */}
          <div className="mt-20 p-8 lg:p-12 rounded-3xl bg-surface-container/70 border border-primary/25 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-secondary">
                Palace Tasting Experience
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                Looking for Chef’s Secret Degustation?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-xl">
                Our 9-course Royal Khansama Feast is curated nightly for limited tables. Reserve your seat with our VIP concierge.
              </p>
            </div>

            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-label-md uppercase tracking-[0.16em] font-bold shadow-lg hover:brightness-110 transition-all no-underline shrink-0"
            >
              Book Degustation Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
