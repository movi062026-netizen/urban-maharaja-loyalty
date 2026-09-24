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
      default: 'REPLACE_WITH_RESTAURANT_ADDRESS',
    },
    phone: {
      type: String,
      default: 'REPLACE_WITH_PHONE',
    },
    email: {
      type: String,
      default: 'REPLACE_WITH_EMAIL',
    },
    openingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        monday: { open: '12:00', close: '23:00' },
        tuesday: { open: '12:00', close: '23:00' },
        wednesday: { open: '12:00', close: '23:00' },
        thursday: { open: '12:00', close: '23:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '12:00', close: '23:00' },
      },
    },
    googleReviewUrl: {
      type: String,
      default: 'REPLACE_WITH_GOOGLE_REVIEW_URL',
    },
    googleMapsUrl: {
      type: String,
      default: 'REPLACE_WITH_GOOGLE_MAPS_URL',
    },
    reservationUrl: {
      type: String,
      default: 'REPLACE_WITH_RESERVATION_URL',
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
