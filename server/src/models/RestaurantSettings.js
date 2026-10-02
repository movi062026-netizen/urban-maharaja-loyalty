const mongoose = require('mongoose');

const restaurantSettingsSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      default: 'Urban Maharaja',
    },
    tagline: {
      type: String,
      default: 'A Fine Dine',
    },
    logo: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur',
    },
    phone: {
      type: String,
      default: '+91 90820 35880',
    },
    email: {
      type: String,
      default: 'concierge@urbanmaharaja.com',
    },
    openingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        monday: { open: '12:00', close: '23:30' },
        tuesday: { open: '12:00', close: '23:30' },
        wednesday: { open: '12:00', close: '23:30' },
        thursday: { open: '12:00', close: '23:30' },
        friday: { open: '12:00', close: '23:30' },
        saturday: { open: '12:00', close: '23:30' },
        sunday: { open: '12:00', close: '23:30' },
      },
    },
    googleReviewUrl: {
      type: String,
      default: 'https://search.google.com/local/writereview?placeid=ChIJMcfXSQDJbTkRFyg-4Qkdv-k',
    },
    googleMapsUrl: {
      type: String,
      default: 'https://www.google.com/maps/place/URBAN+MAHARAJA/@26.8069227,75.8578327,17z/data=!3m1!4b1!4m6!3m5!1s0x396dc90049d7c731:0xe9bd1d09e13e2817!8m2!3d26.8069227!4d75.8578327!16s%2Fg%2F11w2_b84t7',
    },
    reservationUrl: {
      type: String,
      default: 'http://localhost:5173/contact',
    },
    // Loyalty program configuration
    loyaltyConfig: {
      targetStamps: { type: Number, default: 5, min: 1 },
      isRoyalSurpriseEnabled: { type: Boolean, default: false },
      royalSurpriseOptions: {
        type: [
          {
            title: String,
            description: String,
            probability: Number, // 0-1
          },
        ],
        default: [],
      },
    },
    // Brand configuration
    brandConfig: {
      primaryColor: { type: String, default: '#D4847A' },
      secondaryColor: { type: String, default: '#3E2723' },
      accentColor: { type: String, default: '#C5A572' },
    },
    // Social media
    socialMedia: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('RestaurantSettings', restaurantSettingsSchema);
