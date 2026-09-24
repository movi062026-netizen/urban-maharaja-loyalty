import { Utensils, Flame, Leaf, Wine } from 'lucide-react';

const menuCategories = [
  {
    icon: Flame,
    title: 'Royal Starters',
    items: [
      { name: 'Maharaja Kebab Platter', desc: 'An assortment of signature kebabs from the royal kitchen', price: '₹—' },
      { name: 'Gilded Paneer Tikka', desc: 'Cottage cheese marinated in saffron and royal spices', price: '₹—' },
      { name: 'Regal Seekh Kebab', desc: 'Minced lamb infused with aromatic herbs', price: '₹—' },
    ],
  },
  {
    icon: Utensils,
    title: 'Royal Mains',
    items: [
      { name: 'Dum Biryani Maharaja', desc: 'Slow-cooked layered rice with premium spices', price: '₹—' },
      { name: 'Rogan Josh', desc: 'Tender lamb in rich Kashmiri spice gravy', price: '₹—' },
      { name: 'Paneer Lababdar', desc: 'Cottage cheese in a creamy tomato-cashew sauce', price: '₹—' },
    ],
  },
  {
    icon: Leaf,
    title: 'Royal Desserts',
    items: [
      { name: 'Gulab Jamun Royale', desc: 'Golden dumplings in rose-infused syrup', price: '₹—' },
      { name: 'Maharaja Kulfi', desc: 'Cardamom and saffron frozen dessert', price: '₹—' },
      { name: 'Royal Rabri', desc: 'Slow-reduced milk with pistachios and almonds', price: '₹—' },
    ],
  },
  {
    icon: Wine,
    title: 'Royal Beverages',
    items: [
      { name: 'Masala Chaas', desc: 'Spiced buttermilk with fresh herbs', price: '₹—' },
      { name: 'Kesar Lassi', desc: 'Saffron-infused yogurt drink', price: '₹—' },
      { name: 'Royal Thandai', desc: 'Traditional spiced milk with almonds and cardamom', price: '₹—' },
    ],
  },
];

export default function MenuPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-deep-brown py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <Utensils className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Royal Menu</h1>
          <p className="text-white/50 text-lg">A curated experience of royal Indian cuisine</p>
        </div>
      </section>

      {/* Menu */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {menuCategories.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-white rounded-2xl p-6 sm:p-8 shadow-royal">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-warm-beige">
                <Icon className="w-6 h-6 text-royal-rose" />
                <h2 className="font-serif text-2xl text-deep-brown">{title}</h2>
              </div>
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.name} className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-deep-brown">{item.name}</h3>
                      <p className="text-sm text-deep-brown/50 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-sm font-medium text-royal-gold whitespace-nowrap">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-sm text-deep-brown/40 italic">
            Prices are available at the restaurant. Menu items may vary by season.
          </p>
        </div>
      </section>
    </div>
  );
}
