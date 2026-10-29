/**
 * Hindi wording for push notifications (the in-app copy is localized in the client).
 * English push text uses the title/message the event was raised with.
 */
const HI = {
  STAMP_REQUESTED: ['नई स्टैम्प रिक्वेस्ट', '{guestName} ने डाइनिंग स्टैम्प की रिक्वेस्ट भेजी है।'],
  STAMP_APPROVED: ['स्टैम्प अप्रूव हो गया', 'आपका स्टैम्प अप्रूव हो गया। {targetStamps} में से {currentStamps} स्टैम्प जमा हुए।'],
  STAMP_REJECTED: ['स्टैम्प रिक्वेस्ट रिजेक्ट हुई', 'आपकी स्टैम्प रिक्वेस्ट रिजेक्ट हो गई। कारण: {reason}'],
  REWARD_UNLOCKED: ['रिवॉर्ड अनलॉक हो गया!', 'बधाई हो! आपको {rewardTitle} मिला है — वाउचर {code} तैयार है।'],
  CARD_COMPLETED: ['कार्ड पूरा हुआ!', 'सभी {targetStamps} स्टैम्प पूरे हुए! आपका रिवॉर्ड वाउचर जल्द ही दिखेगा।'],
  REWARD_CLAIMED: ['वाउचर तैयार है', 'आपका {rewardTitle} वाउचर इस्तेमाल के लिए तैयार है।'],
  REWARD_REDEEMED: ['रिवॉर्ड रिडीम हो गया', '{rewardTitle} रिडीम हो गया। खाने का आनंद लें!'],
  BOOKING_CREATED: ['नई टेबल बुकिंग', '{name} ने {date} को {time} बजे {guests} के लिए टेबल बुक की है।'],
  BOOKING_PENDING: ['बुकिंग रिक्वेस्ट मिल गई', '{date} को {time} बजे {guests} के लिए आपकी टेबल कन्फ़र्मेशन का इंतज़ार कर रही है।'],
  BOOKING_CONFIRMED: ['टेबल कन्फ़र्म हो गई!', '{date} को {time} बजे {guests} के लिए आपकी टेबल कन्फ़र्म हो गई है।'],
  BOOKING_CANCELLED: ['बुकिंग रद्द हुई', '{date} को {time} बजे की आपकी टेबल बुकिंग रद्द कर दी गई है।'],
  BOOKING_COMPLETED: ['आने के लिए धन्यवाद', 'उम्मीद है {date} को आपको खाना पसंद आया। फिर मिलेंगे!'],
  BOOKING_UPDATED: ['बुकिंग अपडेट हुई', '{actorName} ने {name} की बुकिंग ({date}, {time}) अपडेट की।'],
  BOOKING_CANCELLED_BY_GUEST: ['मेहमान ने बुकिंग रद्द की', '{name} ने {date} को {time} बजे की टेबल रद्द कर दी।'],
  STAMP_APPROVED_BY_STAFF: ['स्टैम्प अप्रूव हुआ', '{actorName} ने {guestName} का स्टैम्प अप्रूव किया ({currentStamps}/{targetStamps})।'],
  STAMP_REJECTED_BY_STAFF: ['स्टैम्प रिजेक्ट हुआ', '{actorName} ने {guestName} की स्टैम्प रिक्वेस्ट रिजेक्ट की।'],
  REWARD_ISSUED: ['रिवॉर्ड दिया गया', '{guestName} को {rewardTitle} मिला ({code})।'],
  VOUCHER_REDEEMED: ['वाउचर रिडीम हुआ', '{guestName} का {rewardTitle} रिडीम हुआ।'],
  NEW_MEMBER: ['नया मेंबर जुड़ा', '{guestName} महाराजा कार्ड प्रोग्राम से जुड़े।'],
};

const fill = (template, data = {}) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (data[key] ?? '').toString());

const pushText = (notification, lang) => {
  const hi = lang === 'hi' && HI[notification.type];
  if (hi) return { title: fill(hi[0], notification.data), body: fill(hi[1], notification.data) };
  return { title: notification.title || 'Urban Maharaja', body: notification.message || '' };
};

module.exports = { pushText };
