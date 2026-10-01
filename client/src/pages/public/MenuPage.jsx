import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Flame, 
  Soup, 
  UtensilsCrossed, 
  Salad, 
  Award, 
  ChevronRight,
  Phone,
  Clock
} from 'lucide-react';

const MENU_LIVE_URL = 'https://urban-maharaja-premium-restaurant-menu-website-hbi32srb0.vercel.app/';

const categories = [
  'All Items',
  'Soups',
  'Indo-Chinese',
  'Starters',
  'Tandoori Sizzlers',
  'Vegetables',
  'Breads & Rice',
  'Desserts & Drinks',
];

const menuData = [
  // ── SOUPS ──
  {
    id: 's1',
    category: 'Soups',
    name: 'Tomato Basil Soup',
    price: 170,
    badge: 'Chef Recommended',
    description: 'Slow-simmered ripe plum tomatoes infused with aromatic sweet basil and toasted croutons.',
    popular: true,
  },
  {
    id: 's2',
    category: 'Soups',
    name: 'Cream of Mushroom Soup',
    price: 170,
    badge: 'Rich & Velvety',
    description: 'Finely sliced button mushrooms cooked in rich farm cream, cracked pepper, and aromatic herbs.',
  },
  {
    id: 's3',
    category: 'Soups',
    name: 'Sweet Corn Soup',
    price: 150,
    badge: 'Classic Favorite',
    description: 'Tender golden sweet corn kernels in a mildly seasoned silky vegetable broth.',
  },
  {
    id: 's4',
    category: 'Soups',
    name: 'Veg Sweet Corn Soup',
    price: 150,
    badge: 'Mild & Sweet',
    description: 'Crushed sweet corn and brunoise garden vegetables simmered to a light, comforting texture.',
  },
  {
    id: 's5',
    category: 'Soups',
    name: 'Hot & Sour Soup',
    price: 170,
    badge: 'Zesty & Tangy',
    description: 'Spicy and tangy Chinese broth laden with shredded mushrooms, tofu, bamboo shoots, and chilies.',
    popular: true,
  },
  {
    id: 's6',
    category: 'Soups',
    name: 'Manchow Soup',
    price: 170,
    badge: 'Crispy Noodle Topping',
    description: 'A spicy Indo-Chinese dark broth spiked with garlic, ginger, cilantro, and crunchy fried noodles.',
    popular: true,
  },
  {
    id: 's7',
    category: 'Soups',
    name: 'Lemon Coriander Soup',
    price: 170,
    badge: 'Refreshing Citrus',
    description: 'Clear vegetable broth revitalized with fresh squeezed lemon juice and finely chopped fresh coriander.',
  },

  // ── INDO-CHINESE ──
  {
    id: 'c1',
    category: 'Indo-Chinese',
    name: 'Veg Noodles',
    price: 299,
    badge: 'Wok Tossed',
    description: 'Long thin wheat noodles wok-tossed with julienned bell peppers, carrots, and house soy sauce.',
  },
  {
    id: 'c2',
    category: 'Indo-Chinese',
    name: 'Hakka Noodles',
    price: 279,
    badge: 'House Specialty',
    description: 'Classic Kolkata-style street Hakka noodles tossed over intense flame with scallions and cabbage.',
    popular: true,
  },
  {
    id: 'c3',
    category: 'Indo-Chinese',
    name: 'Schezwan Noodles',
    price: 320,
    badge: 'Spicy Schezwan',
    description: 'Fiery wok noodles steeped in handcrafted Sichuan chili sauce and crunchy spring vegetables.',
    popular: true,
  },
  {
    id: 'c4',
    category: 'Indo-Chinese',
    name: 'Chili Garlic Noodles',
    price: 290,
    badge: 'Roasted Garlic',
    description: 'Noodles tossed with golden roasted garlic, dry red chilies, spring onions, and toasted sesame.',
  },
  {
    id: 'c5',
    category: 'Indo-Chinese',
    name: 'Singapore Noodles',
    price: 350,
    badge: 'Mild Curry Essence',
    description: 'Thin vermicelli noodles wok-stirred with crisp vegetables, turmeric, and light Madras spices.',
  },
  {
    id: 'c6',
    category: 'Indo-Chinese',
    name: 'Veg Fried Rice',
    price: 279,
    badge: 'Fragrant Wok Rice',
    description: 'Fluffy steamed basmati tossed high over cast-iron wok with diced veggies and light soy.',
  },
  {
    id: 'c7',
    category: 'Indo-Chinese',
    name: 'Schezwan Fried Rice',
    price: 299,
    badge: 'Bold & Fiery',
    description: 'Aromatic basmati rice tossed with our fiery homemade Schezwan sauce and fresh scallions.',
  },
  {
    id: 'c8',
    category: 'Indo-Chinese',
    name: 'Veg Spring Roll',
    price: 250,
    badge: 'Crispy Hand-Rolled',
    description: 'Golden crispy fried pastry rolls filled with shredded glass noodles, cabbage, and sweet-chili dip.',
  },
  {
    id: 'c9',
    category: 'Indo-Chinese',
    name: 'Crispy Corn',
    price: 249,
    badge: 'Crispy Crunch',
    description: 'Golden fried batter-dusted corn kernels tossed with freshly cracked pepper, lime, and chilies.',
    popular: true,
  },
  {
    id: 'c10',
    category: 'Indo-Chinese',
    name: 'Chilli Paneer (Dry / Gravy)',
    price: 349,
    badge: 'Pure Veg Royal',
    description: 'Batter-crisped cottage cheese cubes tossed with bell peppers, green chilies, and tangy garlic soy.',
    popular: true,
  },
  {
    id: 'c11',
    category: 'Indo-Chinese',
    name: 'Dragon Paneer',
    price: 349,
    badge: 'Spicy Glazed',
    description: 'Fresh paneer strips tossed in a fiery sweet-chili glaze, roasted cashews, and charred scallions.',
  },

  // ── STARTERS ──
  {
    id: 'st1',
    category: 'Starters',
    name: 'Honey Chilli Potato',
    price: 299,
    badge: 'Sweet & Spicy',
    description: 'Crispy potato batons coated with sticky wildflower honey, Sichuan red chili, and sesame seeds.',
    popular: true,
  },
  {
    id: 'st2',
    category: 'Starters',
    name: 'Corn Cheese Balls',
    price: 299,
    badge: 'Melted Mozzarella',
    description: 'Crisp golden croquettes stuffed with sweet corn and melted gooey cheese, served with herb mayo.',
    popular: true,
  },
  {
    id: 'st3',
    category: 'Starters',
    name: 'Gobi Chilli',
    price: 250,
    badge: 'Crunchy Cauliflower',
    description: 'Crisp cauliflower florets wok-tossed with dark soy, sliced chilies, and fresh coriander.',
  },
  {
    id: 'st4',
    category: 'Starters',
    name: 'Mushroom Chilli',
    price: 299,
    badge: 'Button Mushrooms',
    description: 'Juicy whole button mushrooms tossed in hot garlic-soy glaze with onion and capsicum petals.',
  },
  {
    id: 'st5',
    category: 'Starters',
    name: 'Veg Salt & Pepper',
    price: 250,
    badge: 'Light & Crisp',
    description: 'Seasonal garden vegetables wok-crisped and tossed with cracked black pepper and rock sea salt.',
  },

  // ── TANDOORI SIZZLERS ──
  {
    id: 't1',
    category: 'Tandoori Sizzlers',
    name: 'Paneer Tikka',
    price: 299,
    badge: 'Clay Oven Charred',
    description: 'Spiced yogurt and Mathania chili marinated cottage cheese skewers roasted over glowing charcoal embers.',
    popular: true,
  },
  {
    id: 't2',
    category: 'Tandoori Sizzlers',
    name: 'Malai Paneer Tikka',
    price: 329,
    badge: 'Melt In Mouth',
    description: 'Velvety cottage cheese marinated with clotted cream, green cardamom, roasted mace, and cashews.',
    popular: true,
  },
  {
    id: 't3',
    category: 'Tandoori Sizzlers',
    name: 'Tandoori Soya Chaap',
    price: 299,
    badge: 'Smoky & Protein-Rich',
    description: 'Tender soya chaap steeped in Punjabi tandoori masala and charred in the clay oven with lime butter.',
  },
  {
    id: 't4',
    category: 'Tandoori Sizzlers',
    name: 'Mushroom Tikka',
    price: 319,
    badge: 'Herbed Marinade',
    description: 'Plump button mushrooms stuffed with spiced cottage cheese and roasted over embers with mint chutney.',
  },
  {
    id: 't5',
    category: 'Tandoori Sizzlers',
    name: 'Royal Sizzling Tandoori Platter',
    price: 499,
    badge: 'Grand Feast',
    description: 'An assorted royal sizzling platter of Paneer Tikka, Malai Chaap, Mushroom Tikka, and grilled vegetables.',
    popular: true,
  },

  // ── VEGETABLES (MAIN COURSE) ──
  {
    id: 'v1',
    category: 'Vegetables',
    name: 'Vegetable Kolhapuri',
    price: 340,
    badge: 'Spicy Maharashtrian',
    description: 'Seasonal vegetables cooked in a fiery, thick Kolhapuri red chili and dry coconut gravy.',
  },
  {
    id: 'v2',
    category: 'Vegetables',
    name: 'Mix Vegetable',
    price: 340,
    badge: 'Homestyle Royal',
    description: 'Harmonious medley of carrots, peas, beans, and paneer cooked in a delicately spiced tomato gravy.',
  },
  {
    id: 'v3',
    category: 'Vegetables',
    name: 'Malai Kofta',
    price: 399,
    badge: 'Silky Cashew Gravy',
    description: 'Delicate dumplings of cottage cheese and dry fruits bathed in an opulent golden cashew cream gravy.',
    popular: true,
  },
  {
    id: 'v4',
    category: 'Vegetables',
    name: 'Paneer Butter Masala',
    price: 360,
    badge: 'Crowd Favorite',
    description: 'Fresh paneer cubes simmered in a luscious buttery tomato gravy finished with kasoori methi.',
    popular: true,
  },
  {
    id: 'v5',
    category: 'Vegetables',
    name: 'Dal Maharaja (Dal Makhani)',
    price: 320,
    badge: 'Slow Cooked 24 Hours',
    description: 'Signature black urad lentils and kidney beans slow-simmered overnight with white butter and fresh cream.',
    popular: true,
  },
  {
    id: 'v6',
    category: 'Vegetables',
    name: 'Kadhai Paneer',
    price: 360,
    badge: 'Pounded Coriander & Chili',
    description: 'Cottage cheese and crisp bell peppers stir-cooked in an iron wok with freshly pounded spices.',
  },
  {
    id: 'v7',
    category: 'Vegetables',
    name: 'Shahi Paneer',
    price: 370,
    badge: 'Royal Mughlai',
    description: 'Silken cottage cheese cooked in a royal almond-cashew reduction perfumed with green cardamom.',
  },

  // ── BREADS & RICE ──
  {
    id: 'b1',
    category: 'Breads & Rice',
    name: 'Butter Naan',
    price: 65,
    badge: 'Tandoori Baked',
    description: 'Leavened flatbread freshly baked on the clay oven walls and brushed with pure butter.',
  },
  {
    id: 'b2',
    category: 'Breads & Rice',
    name: 'Garlic Naan',
    price: 80,
    badge: 'Golden Roasted Garlic',
    description: 'Tandoori baked naan generously studded with minced roasted garlic and fresh coriander.',
    popular: true,
  },
  {
    id: 'b3',
    category: 'Breads & Rice',
    name: 'Tandoori Roti',
    price: 35,
    badge: 'Whole Wheat',
    description: 'Healthy whole wheat unleavened bread baked crisp in the clay tandoor.',
  },
  {
    id: 'b4',
    category: 'Breads & Rice',
    name: 'Laccha Paratha',
    price: 70,
    badge: 'Flaky Layers',
    description: 'Multi-layered flaky whole wheat bread brushed with desi ghee.',
  },
  {
    id: 'b5',
    category: 'Breads & Rice',
    name: 'Jeera Rice',
    price: 180,
    badge: 'Roasted Cumin',
    description: 'Extra-long grain basmati rice tempered with golden roasted cumin seeds and fresh ghee.',
  },
  {
    id: 'b6',
    category: 'Breads & Rice',
    name: 'Royal Veg Dum Biryani with Raita',
    price: 299,
    badge: 'Slow Dum Clay Pot',
    description: 'Aged basmati layered with marinated garden vegetables, saffron, and mint, sealed in clay pot dum.',
    popular: true,
  },

  // ── DESSERTS & DRINKS ──
  {
    id: 'd1',
    category: 'Desserts & Drinks',
    name: 'Gulab Jamun with Rabri',
    price: 180,
    badge: 'Warm & Sweet',
    description: 'Golden khoya dumplings served warm over chilled saffron-infused rabri reduction.',
    popular: true,
  },
  {
    id: 'd2',
    category: 'Desserts & Drinks',
    name: 'Sizzling Brownie with Ice Cream',
    price: 240,
    badge: 'Sizzling Chocolate',
    description: 'Decadent warm fudge brownie served on a cast iron sizzler with vanilla ice cream and hot chocolate fudge.',
  },
  {
    id: 'd3',
    category: 'Desserts & Drinks',
    name: 'Royal Kesar Pista Kulfi',
    price: 160,
    badge: 'Hand Churned',
    description: 'Traditional slow-reduced milk kulfi enriched with Kashmiri saffron and pistachio slivers.',
  },
  {
    id: 'd4',
    category: 'Desserts & Drinks',
    name: 'Fresh Lime Soda (Sweet / Salt)',
    price: 110,
    badge: 'Crisp & Chilled',
    description: 'Sparkling mineral water with freshly squeezed lime and your choice of rock salt or cane syrup.',
  },
  {
    id: 'd5',
    category: 'Desserts & Drinks',
    name: 'Punjabi Sweet / Masala Lassi',
    price: 120,
    badge: 'Rich Village Curd',
    description: 'Creamy hand-churned yogurt beverage finished with malai and cardamom or roasted cumin spice.',
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      const matchesCategory = activeCategory === 'All Items' || item.category === activeCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full bg-[#120407] min-h-screen text-[#fbf0f2]">
      {/* ── TOP ANNOUNCEMENT BANNER FOR LIVE MENU APP ── */}
      <div className="w-full bg-gradient-to-r from-[#6e1226] via-[#911833] to-[#6e1226] border-b border-primary/40 py-2.5 px-4 text-center">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 text-amber-300 font-bold uppercase tracking-wider text-[10px] border border-amber-300/40">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" /> Live Ordering Platform
          </span>
          <span className="text-white/95 font-medium">
            Explore our complete digital menu with real-time cart &amp; instant ordering!
          </span>
          <a
            href={MENU_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider text-[11px] transition-all shadow-md hover:scale-105"
          >
            <span>Open Menu App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── HERO HEADER ── */}
      <section className="relative w-full pt-14 pb-16 overflow-hidden bg-gradient-to-b from-[#1b060b] via-[#120407] to-[#170509] text-center border-b border-outline-variant/20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-col items-center">
          {/* Pure Veg Emblem */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#240b12] border border-[#de6b90]/40 shadow-lg mb-5">
            <span className="w-4 h-4 rounded-[4px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-emerald-950/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#f5c542] font-bold">
              100% Pure Veg Fine Dine
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight leading-tight font-bold mb-4">
            Urban Maharaja <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#de6b90] via-[#f5c542] to-[#de6b90] bg-clip-text text-transparent italic font-normal">
              Imperial Dining Menu
            </span>
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
            A celebration of authentic North Indian, sizzling Tandoori specialties, and wok-fired Indo-Chinese delicacies crafted for royal palate indulgence.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <a
              href={MENU_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-bold uppercase tracking-wider text-xs shadow-[0_10px_30px_rgba(245,197,66,0.3)] hover:brightness-110 hover:scale-[1.03] transition-all flex items-center gap-2 no-underline"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/card"
              className="px-6 py-3.5 rounded-2xl bg-surface-container-high/90 hover:bg-surface-container-highest border border-primary/40 text-primary font-bold uppercase tracking-wider text-xs shadow-md hover:scale-[1.03] transition-all flex items-center gap-2 no-underline"
            >
              <Award className="w-4 h-4 text-secondary" />
              <span>Earn Loyalty Stamps</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search soups, hakka noodles, paneer tikka, dal makhani..."
              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-high/90 border border-outline-variant/40 rounded-2xl text-on-surface placeholder-on-surface-variant/40 text-xs sm:text-sm focus:outline-none focus:border-primary shadow-inner transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mt-7">
            {categories.map((cat) => {
              const count = cat === 'All Items' 
                ? menuData.length 
                : menuData.filter(i => i.category === cat).length;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-bold border-transparent shadow-lg scale-105'
                      : 'bg-surface-container/60 text-on-surface-variant border-outline-variant/30 hover:text-primary hover:border-primary/40'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE EMBED CARD ── */}
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 -mt-6 relative z-10">
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#2a0b13] via-[#1d060c] to-[#2a0b13] border border-amber-400/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">
                  Official Online Menu &amp; Ordering App
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5 truncate max-w-md sm:max-w-xl">
                {MENU_LIVE_URL}
              </p>
            </div>
          </div>

          <a
            href={MENU_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center gap-2 shrink-0 no-underline"
          >
            <span>Visit Full App ↗</span>
          </a>
        </div>
      </div>

      {/* ── DISHES GRID ── */}
      <section className="relative w-full py-12 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-bold">
                {activeCategory}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Showing {filteredItems.length} pure vegetarian fine dine specialties
              </p>
            </div>

            <a
              href={MENU_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:underline font-semibold flex items-center gap-1"
            >
              <span>Order via App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface-container/40 border border-outline-variant/30 my-8">
              <UtensilsCrossed className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
              <h3 className="font-serif text-lg text-on-surface">No delicacies match your search</h3>
              <p className="text-xs text-on-surface-variant mt-1">Try clearing your search query or selecting another category.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All Items'); }}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-container text-surface-container-lowest text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-surface-container/80 to-surface-container-lowest/90 border border-outline-variant/40 backdrop-blur-xl shadow-lg flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Header: Pure Veg Dot + Badge + Price */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {/* Indian Standard Green Veg Symbol */}
                        <span className="w-4 h-4 rounded-[4px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0" title="100% Pure Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>

                        {item.badge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 shrink-0">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Dish Name */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-on-surface-variant/80 leading-relaxed font-sans mb-5">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom: Order Button */}
                  <div className="pt-3.5 border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-secondary font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>

                    <a
                      href={MENU_LIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black text-xs font-bold flex items-center gap-1.5 shadow transition-all no-underline"
                      title="Add to cart on menu website"
                    >
                      <span className="text-sm font-bold leading-none">+</span>
                      <span>Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MAHARAJA CARD REWARD CTA FOOTER ── */}
          <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#240b12] via-[#1a060c] to-[#240b12] border border-primary/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                Dine &amp; Earn Royal Rewards
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                Earn Free Meals &amp; Royal Maharaja Seals
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xl">
                Every dining visit or bill upload earns you official seals on your Digital Maharaja Card. Unlock complimentary gourmet desserts and fine dining rewards!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/card"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-container via-[#de6b90] to-secondary text-surface-container-lowest text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all no-underline"
              >
                Open My Maharaja Card
              </Link>
              <a
                href={MENU_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center gap-1.5 no-underline"
              >
                <span>Full Online Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
