import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-deep-brown py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <MapPin className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Contact & Reservations</h1>
          <p className="text-white/50 text-lg">We look forward to welcoming you</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-royal">
              <h2 className="font-serif text-xl text-deep-brown mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-royal-rose" /> Location
              </h2>
              <p className="text-deep-brown/60 text-sm leading-relaxed">REPLACE_WITH_RESTAURANT_ADDRESS</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-royal">
              <h2 className="font-serif text-xl text-deep-brown mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-royal-rose" /> Phone
              </h2>
              <p className="text-deep-brown/60 text-sm">REPLACE_WITH_PHONE</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-royal">
              <h2 className="font-serif text-xl text-deep-brown mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-royal-rose" /> Email
              </h2>
              <p className="text-deep-brown/60 text-sm">REPLACE_WITH_EMAIL</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-royal">
              <h2 className="font-serif text-xl text-deep-brown mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-royal-rose" /> Opening Hours
              </h2>
              <p className="text-deep-brown/60 text-sm">Monday – Sunday: 12:00 PM – 11:00 PM</p>
            </div>
          </div>

          {/* Reservation */}
          <div className="bg-white rounded-2xl p-8 shadow-royal">
            <h2 className="font-serif text-2xl text-deep-brown mb-4">Make a Reservation</h2>
            <p className="text-deep-brown/60 text-sm mb-6 leading-relaxed">
              For reservations, please call us or visit our online booking page. We recommend
              booking in advance for weekend dining.
            </p>

            <div className="space-y-4">
              <a
                href="tel:REPLACE_WITH_PHONE"
                className="btn-royal w-full text-center block no-underline"
              >
                <Phone className="w-4 h-4 inline mr-2" /> Call to Reserve
              </a>
              <a
                href="REPLACE_WITH_RESERVATION_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center block no-underline"
              >
                <Globe className="w-4 h-4 inline mr-2" /> Book Online
              </a>
            </div>

            <div className="mt-8 p-4 bg-cream rounded-xl">
              <p className="text-xs text-deep-brown/40 italic">
                For large party bookings (10+ guests), please contact us directly for a customised royal dining experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
