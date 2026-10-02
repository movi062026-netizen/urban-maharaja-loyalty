import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

import dishPaneerTikka from '../../assets/images/dish-paneer-tikka-premium.jpg';
import dishBruschetta from '../../assets/images/dish-bruschetta-premium.jpg';
import dishRoyalDosa from '../../assets/images/dish-royal-dosa-premium.jpg';
import dishGrilledSandwich from '../../assets/images/dish-grilled-sandwich-premium.jpg';
import brandLogo from '../../assets/images/logo.png';

const MENU_LIVE_URL = 'https://urban-maharaja-premium-restaurant-menu-website-hbi32srb0.vercel.app/';

const signatureDishes = [
  {
    id: 'sig-paneer',
    name: 'Haryali Paneer Tikka Sizzler',
    category: 'Tandoori Sizzlers',
    price: 320,
    badge: 'Chef Signature',
    image: dishPaneerTikka,
    description: 'Fresh cottage cheese cubes steeped in wild mountain herbs, roasted spices, and slow-grilled in our clay tandoor with bell peppers & onions.',
  },
  {
    id: 'sig-bruschetta',
    name: 'Cheesy Garlic Herb Bruschetta',
    category: 'Starters',
    price: 240,
    badge: 'Artisan Oven',
    image: dishBruschetta,
    description: 'Crusty sourdough baguettes toasted with garlic-infused butter, roasted olives, bubbling mozzarella, and served with spiced house marinara.',
  },
  {
    id: 'sig-dosa',
    name: 'Royal Maharaja Masala Dosa Feast',
    category: 'Breads & Rice',
    price: 210,
    badge: 'House Specialty',
    image: dishRoyalDosa,
    description: 'Paper-thin crispy crepe roasted with clarified butter, filled with spiced potato mash, served with lentil sambar, fresh coconut chutney & cottage cheese.',
  },
  {
    id: 'sig-sandwich',
    name: 'Artisan Grilled Club Sandwich Platter',
    category: 'Starters',
    price: 220,
    badge: 'Gourmet Platter',
    image: dishGrilledSandwich,
    description: 'Multi-tier golden-brown grilled bread packed with shredded farm vegetables, spiced house spread, melted cheese, and fresh garden salad garnish.',
  },
];

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
    id: 'sig-bruschetta',
    category: 'Starters',
    name: 'Cheesy Garlic Herb Bruschetta',
    price: 240,
    badge: 'Artisan Wood-Fired',
    image: dishBruschetta,
    description: 'Crusty sourdough baguettes toasted with garlic-infused butter, roasted olives, bubbling mozzarella, and served with spiced house marinara.',
    popular: true,
  },
  {
    id: 'sig-sandwich',
    category: 'Starters',
    name: 'Artisan Grilled Club Sandwich Platter',
    price: 220,
    badge: 'Royal Platter',
    image: dishGrilledSandwich,
    description: 'Multi-tier golden-brown grilled bread packed with shredded farm vegetables, spiced house spread, melted cheese, and fresh garden salad garnish.',
    popular: true,
  },
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
    id: 'sig-paneer',
    category: 'Tandoori Sizzlers',
    name: 'Haryali Paneer Tikka Sizzler',
    price: 320,
    badge: 'Chef Signature Sizzler',
    image: dishPaneerTikka,
    description: 'Fresh cottage cheese cubes steeped in wild mountain herbs, roasted spices, and slow-grilled in our clay tandoor with bell peppers & onions.',
    popular: true,
  },
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
    id: 'sig-dosa',
    category: 'Breads & Rice',
    name: 'Royal Maharaja Masala Dosa Feast',
    price: 210,
    badge: 'Imperial Dosa Feast',
    image: dishRoyalDosa,
    description: 'Paper-thin crispy crepe roasted with clarified butter, filled with spiced potato mash, served with lentil sambar, fresh coconut chutney & cottage cheese.',
    popular: true,
  },
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
    <div className="w-full bg-background min-h-screen text-on-surface">
      {/* ── TOP ANNOUNCEMENT BANNER FOR LIVE MENU APP ── */}
      <div className="w-full bg-gradient-to-r from-primary-container/80 via-primary to-primary-container/80 border-b border-primary/30 py-2.5 px-4 text-center">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/30 text-white font-bold uppercase tracking-wider text-[10px] border border-white/40">
            <Sparkles className="w-3 h-3 text-white" /> Official Digital Menu
          </span>
          <span className="text-white/95 font-medium">
            Explore our complete pure vegetarian dining menu &amp; chef specials on our interactive website!
          </span>
          <a
            href={MENU_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider text-[11px] transition-all shadow-md hover:scale-105"
          >
            <span>Explore Digital Menu</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── HERO HEADER ── */}
      <section className="relative w-full pt-14 pb-16 overflow-hidden bg-gradient-to-b from-surface-container-high via-surface-container to-surface text-center border-b border-outline-variant/20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-secondary-container/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-col items-center">
          {/* Pure Veg Emblem */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/15 border border-primary/30 shadow-lg mb-5">
            <span className="w-4 h-4 rounded-[4px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-emerald-950/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-secondary font-bold">
              100% Pure Veg Fine Dine
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight leading-tight font-bold mb-4">
            Urban Maharaja <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent italic font-normal">
              Imperial Dining Menu
            </span>
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
            A celebration of authentic North Indian curries, sizzling clay-oven tandoor creations, and wok-fired Indo-Chinese delicacies crafted for royal palate indulgence.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <a
              href={MENU_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-bold uppercase tracking-wider text-xs shadow-[0_10px_30px_rgba(245,197,66,0.3)] hover:brightness-110 hover:scale-[1.03] transition-all flex items-center gap-2 no-underline"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Interactive Menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-2xl bg-surface-container-high/90 hover:bg-surface-container-highest border border-primary/40 text-primary font-bold uppercase tracking-wider text-xs shadow-md hover:scale-[1.03] transition-all flex items-center gap-2 no-underline"
            >
              <span>Reserve a Table</span>
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
                      ? 'bg-gradient-to-r from-primary-container to-secondary text-white font-bold border-transparent shadow-lg scale-105'
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
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-surface-container-high/80 via-surface-container/90 to-surface-container-high/80 border border-secondary/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-700 shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">
                  Official Interactive Digital Menu
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600 border border-green-500/30">
                  Live
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
            <span>Visit Menu Website ↗</span>
          </a>
        </div>
      </div>

      {/* ── CHEF'S SIGNATURE REAL DISHES SHOWCASE ── */}
      <section className="relative w-full max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-3 border-b border-outline-variant/30">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-secondary font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Imperial Signature Creations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-bold">
              Chef's Authentic Plated Delicacies
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Authentic royal house recipes prepared fresh with finest Himalayan herbs and pure vegetarian ghee
            </p>
          </div>
          <a
            href={MENU_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 hover:text-amber-700 font-semibold flex items-center gap-1.5"
          >
            <span>View all in live menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureDishes.map((dish) => (
            <div
              key={dish.id}
              className="group rounded-3xl overflow-hidden bg-gradient-to-b from-surface-container-lowest to-surface-container-low border border-outline-variant/40 hover:border-primary/50 shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/10" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-md text-amber-700 font-bold uppercase text-[10px] tracking-wider border border-amber-400/30">
                    {dish.badge}
                  </span>
                  <span className="absolute bottom-2.5 right-3 font-serif text-xl font-bold text-amber-700 drop-shadow">
                    ₹{dish.price}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-500 flex items-center justify-center p-0.5 bg-white shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[10px] uppercase font-mono text-secondary font-semibold tracking-wider">
                      {dish.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">
                    {dish.name}
                  </h3>

                  <p className="text-xs text-on-surface-variant/80 leading-relaxed font-sans line-clamp-3">
                    {dish.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[10px] text-amber-700/80 font-bold uppercase tracking-wider">
                  Pure Veg Specialty
                </span>
                <a
                  href={MENU_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-secondary hover:text-secondary-fixed flex items-center gap-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              <span>Full Interactive Menu</span>
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
                className="mt-4 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
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
                    {/* If item has custom photo, show it prominently */}
                    {item.image && (
                      <div className="relative h-44 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 overflow-hidden rounded-t-[22px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container/90 via-transparent to-black/20" />
                        <span className="absolute bottom-2.5 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-amber-700 border border-amber-400/30">
                          Authentic Plating
                        </span>
                      </div>
                    )}

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

                      <span className="font-serif text-lg sm:text-xl font-bold text-amber-700 shrink-0">
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

                  {/* Card Bottom: Category Tag & Detail Indicator */}
                  <div className="pt-3.5 border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-secondary font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>

                    <a
                      href={MENU_LIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-700/90 hover:text-amber-700 font-semibold flex items-center gap-1 hover:underline transition-all"
                      title="View on interactive menu"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── MAHARAJA CARD REWARD CTA FOOTER ── */}
          <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-container via-primary to-secondary text-white text-xs uppercase tracking-wider font-bold shadow-lg hover:brightness-110 transition-all no-underline"
              >
                Open My Maharaja Card
              </Link>
              <a
                href={MENU_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center gap-1.5 no-underline"
              >
                <span>Full Digital Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
