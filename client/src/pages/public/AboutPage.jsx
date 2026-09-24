import { Crown, Heart, Utensils } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-deep-brown py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <Crown className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Our Story</h1>
          <p className="text-white/50 text-lg">Where Heritage Meets Culinary Excellence</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 text-deep-brown/70 leading-relaxed">
            <div className="bg-white rounded-2xl p-8 shadow-royal">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-royal-rose" />
                <h2 className="font-serif text-2xl text-deep-brown">The Royal Beginning</h2>
              </div>
              <p>
                Urban Maharaja was born from a vision to bring the grandeur and warmth of royal Indian hospitality
                to the modern dining table. Every dish tells a story of centuries-old recipes refined with contemporary
                culinary artistry.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-royal">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-6 h-6 text-royal-rose" />
                <h2 className="font-serif text-2xl text-deep-brown">Our Philosophy</h2>
              </div>
              <p>
                We believe that dining is not merely about nourishment — it is an experience. From the moment you
                step through our doors, you are treated as royalty. Our chefs craft each dish with the finest
                ingredients, drawing inspiration from the kitchens of Indian palaces.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-royal">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-royal-rose" />
                <h2 className="font-serif text-2xl text-deep-brown">The Maharaja Experience</h2>
              </div>
              <p>
                Every detail at Urban Maharaja — from the decor inspired by Rajasthani jharokhas to the curated
                playlists of classical melodies — is designed to transport you to a world of regal elegance.
                Our Digital Maharaja Card extends this royal treatment beyond the dining table, rewarding your
                loyalty with exclusive privileges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
