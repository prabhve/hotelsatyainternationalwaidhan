/**
 * ============================================================================
 * CENTRAL HOTEL DATA & CONFIGURATION FILE (/src/data/hotelData.ts)
 * ============================================================================
 * HOW TO UPDATE RATES, ROOMS, MENU & POLICIES:
 * 1. Room Tariffs: Edit `ROOM_CATEGORIES` below. Each room has `singleInr` and
 *    `doubleInr` (base EP rates) plus the explicit `rates` matrix for EP/CP/MAP/AP.
 * 2. Meal Plan Add-ons: Edit `MEAL_PLANS` (`surchargePerNight`).
 * 3. Taxes, Extra Bed & WhatsApp: Edit `BOOKING_CONFIG`.
 * 4. Every item requiring final verification from hotel management is marked
 *    with `[PLACEHOLDER]` or `[CONFIRM]` and listed in `PLACEHOLDER_CHECKLIST`.
 * ============================================================================
 */

import logoImg from '../assets/hotel/logo.png';
import heroExteriorImg from '../assets/hotel/hero-exterior.jpg';
import exteriorAltImg from '../assets/hotel/exterior-alt.jpg';
import lobbyMainImg from '../assets/hotel/lobby-main.jpg';
import royalSuiteImg from '../assets/hotel/royal-suite.jpg';
import presidentialSuiteImg from '../assets/hotel/presidential-suite.webp';
import executiveSuiteImg from '../assets/hotel/executive-suite.webp';
import superiorSuiteImg from '../assets/hotel/superior-suite.webp';
import deluxeRoomImg from '../assets/hotel/deluxe-room.webp';
import superDeluxeImg from '../assets/hotel/super-deluxe.webp';
import standardAcImg from '../assets/hotel/standard-ac.webp';
import blueDiamondBarImg from '../assets/hotel/blue-diamond-bar.webp';
import shardaRestaurantImg from '../assets/hotel/sharda-restaurant.jpg';
import banquetHallImg from '../assets/hotel/banquet-hall.webp';
import poolExteriorImg from '../assets/hotel/pool-exterior.webp';
import gallery1Img from '../assets/hotel/gallery-1.webp';
import gallery2Img from '../assets/hotel/gallery-2.webp';
import gallery3Img from '../assets/hotel/gallery-3.webp';
import gallery4Img from '../assets/hotel/gallery-4.webp';
import gallery5Img from '../assets/hotel/gallery-5.webp';
import gallery6Img from '../assets/hotel/gallery-6.webp';
import gallery7Img from '../assets/hotel/gallery-7.webp';
import gallery8Img from '../assets/hotel/gallery-8.webp';
import mdDirectorImg from '../assets/hotel/md-director.jpg';
import gmManagerImg from '../assets/hotel/gm-manager.jpg';
import travelDeskImg from '../assets/hotel/travel-desk.jpg';

export type Language = 'en' | 'hi';
export type MealPlanCode = 'EP' | 'CP' | 'MAP' | 'AP';
export type OccupancyType = 'Single' | 'Double';

export interface RoomRateMatrix {
  single: Record<MealPlanCode, number>;
  double: Record<MealPlanCode, number>;
}

export interface RoomCategory {
  id: string;
  tier: 'Suite' | 'Deluxe' | 'Standard';
  title: string;
  titleHi: string;
  subtitle: string;
  singleInr: number;
  doubleInr: number;
  rates: RoomRateMatrix;
  sizeSqFt: string;
  bedType: string;
  maxGuests: number;
  image: string;
  images: string[];
  highlights: string[];
  description: string;
  isPlaceholderRate?: boolean;
}

export interface LandmarkItem {
  id: string;
  name: string;
  category: 'Power & Industry' | 'Transit' | 'Tourism';
  distanceKm: number;
  distanceLabel?: string;
  driveMinutes: number;
  lat: number;
  lng: number;
  note: string;
}

export interface PlatformReview {
  id: string;
  authorName: string;
  stayCategory: 'Business' | 'Family' | 'Wedding & Events' | 'Solo';
  roomStayed: string;
  rating: number;
  cleanlinessRating: number;
  diningRating: number;
  hospitalityRating: number;
  title: string;
  comment: string;
  sourceLabel: string;
  dateLabel: string;
  isPlaceholder?: boolean;
}

export const BOOKING_CONFIG = {
  whatsappNumber: '919009284982', // Primary WhatsApp reception desk
  primaryPhone: '+91-7805-350217',
  secondaryPhones: ['+91-7805-234793', '+91-7805-234794', '+91-7805-350186'],
  mobiles: ['+91-9009284982', '+91-8719932581', '+91-7024366637'],
  email: 'hotelsatyainternational@gmail.com',
  extraBedChargePerNight: 800, // [PLACEHOLDER: Confirm exact extra mattress/bed tariff with hotel]
  gstStandardPercent: 12, // 12% GST for room tariffs up to ₹7,500/night
  gstLuxuryPercent: 18, // 18% GST for room tariffs above ₹7,500/night
  gstThresholdInr: 7500,
  otaSavingsPercent: 15, // [CONFIGURABLE: "You save ~15% vs. OTAs"]
  upiIdPlaceholder: 'hotelsatyainternational@sbi', // [PLACEHOLDER: Replace with official merchant UPI ID]
  gstinPlaceholder: '23AAACH0000A1Z5 [PLACEHOLDER]', // [PLACEHOLDER: Replace with official MP GSTIN]
  googleRatingPlaceholder: '3.9 ★ from 420+ Google Reviews [PLACEHOLDER]',
  childPolicyNote:
    'Children up to 6 years stay complimentary sharing parents’ bed without extra mattress [CONFIRM WITH HOTEL].',
};

export const UI_TRANSLATIONS = {
  en: {
    welcomeBadge: ' स्वागत है · Welcome to Singrauli’s Premier Hospitality Landmark',
    announcement:
      'Best Rate Guarantee on Direct Booking • Free High-Speed Wi-Fi • Complimentary Swimming Pool Access',
    heroEyebrow:
      "Singrauli's First Classified 3-Star Luxury Hotel · Est. 2011 · Waidhan, M.P.",
    heroHeadline: 'A tradition of gracious living in the heart of Singrauli.',
    heroSubcopy:
      'Rising along Waidhan’s Belaunji Main Road, Hotel Satya International pairs seven refined room & suite categories, Sharda Multi-Cuisine Restaurant & European Bakery, the colonial Blue Diamond Bar, an outdoor swimming pool, and 3,000-guest celebration lawns—just 10 minutes from NTPC Vindhyanagar.',
    reserveDirect: 'Reserve Direct',
    compareRooms: 'Compare 7 Room Tiers',
    bookStay: 'Book Stay',
    nav: {
      home: 'Home',
      rooms: 'Suites & Rooms',
      dining: 'Dining',
      banquets: 'Banquets & Events',
      facilities: 'Facilities',
      corporate: 'Corporate',
      gallery: 'Gallery',
      reviews: 'Reviews',
      location: 'Location',
      contact: 'Contact',
    },
    sections: {
      bookingTitle: 'Direct Reservation & Instant Tariff Calculator',
      bookingSub: 'Lock in our best direct rate with transparent meal plan & GST breakdown—zero OTA commission.',
      roomsTitle: 'Seven Categories of Gracious Waidhan Comfort',
      diningTitle: 'Sharda Multi-Cuisine Restaurant, European Bakery & Blue Diamond Bar',
      banquetsTitle: '3,000-Guest Celebration Lawns, Grand Banquet & Conference Halls',
      facilitiesTitle: '16 Three-Star Hotel Facilities & Resident Privileges',
      corporateTitle: 'Preferred Corporate Partner for Singrauli’s Power & Industrial Hubs',
      galleryTitle: 'Visual Lookbook & Property Photo Archive',
      reviewsTitle: 'Guest Experience & Verified Review Dashboard',
      locationTitle: 'Prime Location on Belaunji Main Road & Industrial Distance Matrix',
      faqTitle: 'Hotel Policies, Booking Rules & Frequently Asked Questions',
      contactTitle: '24×7 Reception Desk, Direct Enquiries & Group Bookings',
    },
  },
  hi: {
    welcomeBadge: 'स्वागत है · सिंगरौली के प्रथम ३-स्टार लक्ज़री होटल में आपका हार्दिक अभिनंदन',
    announcement:
      'डायरेक्ट बुकिंग पर सर्वोत्तम रेट की गारंटी • नि:शुल्क हाई-स्पीड वाई-फाई • स्विमिंग पूल की सुविधा',
    heroEyebrow:
      'सिंगरौली का प्रथम वर्गीकृत ३-स्टार लक्ज़री होटल · स्थापना २०११ · वैढ़न, मध्य प्रदेश',
    heroHeadline: 'सिंगरौली के हृदय में भव्य आतिथ्य और गरिमापूर्ण प्रवास की परंपरा।',
    heroSubcopy:
      'वैढ़न के बेलौंजी मेन रोड पर स्थित होटल सत्या इंटरनेशनल ७ सुइट एवं रूम श्रेणियों, शारदा मल्टी-कुज़ीन रेस्टोरेंट और यूरोपियन बेकरी, ब्लू डायमंड बार, आउटडोर स्विमिंग पूल और ३,००० मेहमानों के विशाल वेडिंग लॉन के साथ NTPC विंध्यनगर से मात्र १० मिनट की दूरी पर आपकी सेवा में तत्पर है।',
    reserveDirect: 'सीधे बुक करें',
    compareRooms: '७ रूम श्रेणियां देखें',
    bookStay: 'रूम बुक करें',
    nav: {
      home: 'मुख्य पृष्ठ',
      rooms: 'सुइट्स और रूम',
      dining: 'रेस्टोरेंट व बार',
      banquets: 'बैंक्वेट व लॉन',
      facilities: 'सुविधाएं',
      corporate: 'कॉर्पोरेट',
      gallery: 'गैलरी',
      reviews: 'समीक्षाएं',
      location: 'लोकेशन',
      contact: 'संपर्क',
    },
    sections: {
      bookingTitle: 'डायरेक्ट रूम बुकिंग और लाइव टैरिफ कैलकुलेटर',
      bookingSub: 'बिना किसी अतिरिक्त कमीशन के मील प्लान और जीएसटी विवरण के साथ सीधे बुक करें।',
      roomsTitle: 'वैढ़न में आरामदायक प्रवास की सात उत्कृष्ट श्रेणियां',
      diningTitle: 'शारदा मल्टी-कुज़ीन रेस्टोरेंट, कस्टम बेकरी और ब्लू डायमंड बार',
      banquetsTitle: '३,००० मेहमानों का भव्य लॉन, बैंक्वेट हॉल और मीटिंग रूम',
      facilitiesTitle: '१६ तीन-सितारा होटल सुविधाएं और अतिथि सेवाएं',
      corporateTitle: 'सिंगरौली के पावर और औद्योगिक घरानों के लिए विशेष कॉर्पोरेट प्रवास',
      galleryTitle: 'होटल सत्या इंटरनेशनल की फोटो गैलरी',
      reviewsTitle: 'अतिथि अनुभव और समीक्षा डैशबोर्ड',
      locationTitle: 'बेलौंजी मेन रोड लोकेशन और प्रमुख स्थानों से दूरी',
      faqTitle: 'होटल नियम, नीतियां और अक्सर पूछे जाने वाले प्रश्न (FAQ)',
      contactTitle: '२४×७ रिसेप्शन डेस्क और सीधा संपर्क',
    },
  },
};

export const HOTEL_INFO = {
  name: 'Hotel Satya International',
  classification: 'Classified 3-Star Luxury Hotel · Est. 2011',
  motto: 'Atithi-Devo-Bhava · अतिथि देवो भव:',
  tagline: 'A tradition of gracious living in the heart of Singrauli.',
  address:
    'Main Road, Belaunji (Tali), Waidhan P.O., Singrauli District, Madhya Pradesh 486886, India',
  shortAddress: 'Main Road, Belaunji, Waidhan, Singrauli (M.P.) 486886',
  coordinates: { lat: 24.072285, lng: 82.6206458 },
  googleMapsHexId: '0x398f369a0ff99001:0xdb5aec929d36db90',
  knowledgeGraphId: '/g/11b6lmtf04',
  plusCode: '3JCF+W7 Waidhan, Madhya Pradesh',
  phones: ['+91-7805-350217', '+91-7805-234793', '+91-7805-234794', '+91-7805-350186'],
  mobiles: ['+91-9009284982', '+91-8719932581', '+91-7024366637'],
  barPhone: '+91-7415866637',
  email: 'hotelsatyainternational@gmail.com',
  website: 'https://hotelsatyainternational.com/',
  checkInTime: '2:00 PM',
  checkOutTime: '12:00 PM',
  logo: logoImg,
  heroImage: heroExteriorImg,
  exteriorAltImage: exteriorAltImg,
  lobbyImage: lobbyMainImg,
  poolImage: poolExteriorImg,
  travelDeskImage: travelDeskImg,
  mdImage: mdDirectorImg,
  gmImage: gmManagerImg,
};

/**
 * SECTION 1 HERO CAROUSEL SLIDES
 * Strictly matched 1-to-1 between each photograph and its exact caption:
 * (Facade, Lobby, Royal Suite, Pool, Restaurant, Bar, Lawn)
 */
export const HERO_CAROUSEL_SLIDES = [
  {
    id: 'facade',
    badge: 'Facade',
    title: 'Main Road Architectural Facade, Belaunji, Waidhan',
    caption: 'Rising prominently on Waidhan Main Road with gated car, bus & coach parking.',
    image: heroExteriorImg,
  },
  {
    id: 'lobby',
    badge: 'Lobby',
    title: 'Grand Marble Reception & 24×7 Concierge Atrium',
    caption: 'Warm Indian hospitality guided by “Atithi-Devo-Bhava” since 2011.',
    image: lobbyMainImg,
  },
  {
    id: 'royal-suite',
    badge: 'Royal Suite',
    title: 'Royal Suite — 680 sq. ft. Flagship Living & Bedroom',
    caption: 'King Posture-Care bed, private parlor lounge & 24-hour butler service.',
    image: royalSuiteImg,
  },
  {
    id: 'pool',
    badge: 'Pool',
    title: 'Outdoor Swimming Pool & Poolside Sun Deck',
    caption: 'Complimentary access for in-house guests alongside our equipped Health Club.',
    image: poolExteriorImg,
  },
  {
    id: 'restaurant',
    badge: 'Restaurant',
    title: 'Sharda Multi-Cuisine Family Restaurant & Custom Bakery',
    caption: 'Serving 6 cuisines and 100% original European-technique celebration cakes.',
    image: shardaRestaurantImg,
  },
  {
    id: 'bar',
    badge: 'Bar',
    title: 'Blue Diamond Colonial Lounge Bar',
    caption: 'Imported spirits, signature cocktails & crystal glassware (11:00 AM – 11:00 PM).',
    image: blueDiamondBarImg,
  },
  {
    id: 'lawn',
    badge: 'Lawn & Banquets',
    title: '3,000-Guest Celebration Lawn & 200-Pax Grand Banquet Hall',
    caption: 'Singrauli’s premier venue for royal weddings, receptions & corporate galas.',
    image: gallery6Img,
  },
];

export const MEAL_PLANS = [
  {
    code: 'EP' as const,
    label: 'EP · Room Only',
    shortLabel: 'EP (Room Only)',
    surchargePerNight: 0,
    note: 'Room only with complimentary high-speed Wi-Fi & swimming pool access',
  },
  {
    code: 'CP' as const,
    label: 'CP · Breakfast Included',
    shortLabel: 'CP (+Breakfast)',
    surchargePerNight: 350,
    note: 'Includes morning buffet breakfast at Sharda Multi-Cuisine Restaurant',
  },
  {
    code: 'MAP' as const,
    label: 'MAP · Breakfast & Dinner',
    shortLabel: 'MAP (+Breakfast & Dinner)',
    surchargePerNight: 850,
    note: 'Includes morning buffet breakfast & multi-cuisine dinner at Sharda',
  },
  {
    code: 'AP' as const,
    label: 'AP · All Meals Included',
    shortLabel: 'AP (+All 3 Meals)',
    surchargePerNight: 1300,
    note: 'Includes breakfast, lunch & dinner at Sharda Multi-Cuisine Restaurant',
  },
];

/**
 * SECTION 4 — SEVEN ACCOMMODATION CATEGORIES & PUBLISHED TARIFFS
 * Exact published EP single/double tariffs from hotelsatyainternational.com/rooms/
 * with calculated CP (+₹350), MAP (+₹850), and AP (+₹1,300) meal plan matrices.
 */
export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'royal-suite',
    tier: 'Suite',
    title: 'Royal Suite',
    titleHi: 'रॉयल सुइट',
    subtitle: 'Flagship multi-room sanctuary with private parlor lounge & courtyard vista',
    singleInr: 7400,
    doubleInr: 9000,
    rates: {
      single: { EP: 7400, CP: 7750, MAP: 8250, AP: 8700 },
      double: { EP: 9000, CP: 9350, MAP: 9850, AP: 10300 },
    },
    sizeSqFt: '680 sq. ft.',
    bedType: 'King Posture-Care Bed',
    maxGuests: 4,
    image: royalSuiteImg,
    images: [royalSuiteImg, gallery1Img, gallery8Img],
    highlights: [
      'Separate parlor lounge',
      'In-room minibar & tea bar',
      'Complimentary pool & health club',
      'Priority 24h butler service',
    ],
    description:
      'Our premier residential suite crafted for visiting executives, dignitaries, and wedding families seeking expansive living space and bespoke hospitality in Waidhan.',
  },
  {
    id: 'presidential-suite',
    tier: 'Suite',
    title: 'Presidential Suite',
    titleHi: 'प्रेसिडेंशियल सुइट',
    subtitle: 'Executive living salon with dining alcove and orthopedic king bedding',
    singleInr: 6500,
    doubleInr: 7450,
    rates: {
      single: { EP: 6500, CP: 6850, MAP: 7350, AP: 7800 },
      double: { EP: 7450, CP: 7800, MAP: 8300, AP: 8750 },
    },
    sizeSqFt: '590 sq. ft.',
    bedType: 'King Orthopedic Bed',
    maxGuests: 3,
    image: presidentialSuiteImg,
    images: [presidentialSuiteImg, gallery2Img, gallery7Img],
    highlights: [
      'Warm woodwork & acoustic glazing',
      'Separate entertaining quarters',
      'Dedicated executive desk & Wi-Fi',
      'Luxury bath amenities & 24h dining',
    ],
    description:
      'Designed with warm woodwork, acoustic glazing, and separate entertaining quarters ideal for corporate leadership visiting Singrauli energy hubs.',
  },
  {
    id: 'executive-suite',
    tier: 'Suite',
    title: 'Executive Suite',
    titleHi: 'एग्जीक्यूटिव सुइट',
    subtitle: 'Refined business suite balancing quiet productivity and evening comfort',
    singleInr: 5500,
    doubleInr: 6500,
    rates: {
      single: { EP: 5500, CP: 5850, MAP: 6350, AP: 6800 },
      double: { EP: 6500, CP: 6850, MAP: 7350, AP: 7800 },
    },
    sizeSqFt: '490 sq. ft.',
    bedType: 'King Bed',
    maxGuests: 3,
    image: executiveSuiteImg,
    images: [executiveSuiteImg, gallery1Img, gallery3Img],
    highlights: [
      'Workstation & ergonomic seating',
      'Satellite HD television',
      '24h hot & cold running water',
      'Complimentary daily newspaper',
    ],
    description:
      'Thoughtfully zoned for NTPC, Reliance, and Hindalco corporate travelers requiring reliable Wi-Fi, ergonomic workspaces, and restful interiors.',
  },
  {
    id: 'superior-suite',
    tier: 'Suite',
    title: 'Superior Suite',
    titleHi: 'सुपीरियर सुइट',
    subtitle: 'Spacious corner suite overlooking Belaunji Main Road [CONFIRM SQ FT & BED]',
    singleInr: 4500,
    doubleInr: 5500,
    rates: {
      single: { EP: 4500, CP: 4850, MAP: 5350, AP: 5800 },
      double: { EP: 5500, CP: 5850, MAP: 6350, AP: 6800 },
    },
    sizeSqFt: '430 sq. ft. [CONFIRM]',
    bedType: 'Queen / King Bed',
    maxGuests: 3,
    image: superiorSuiteImg,
    images: [superiorSuiteImg, gallery7Img, gallery8Img],
    highlights: [
      'Generous seating alcove',
      'Split climate-controlled A/C',
      'Wardrobe & luggage bay',
      'Express laundry & room service',
    ],
    description:
      'Bright corner proportions with soft ambient lighting, generous luggage storage, and effortless access to Sharda Restaurant and the swimming pool.',
    isPlaceholderRate: true,
  },
  {
    id: 'super-deluxe',
    tier: 'Deluxe',
    title: 'Super Deluxe Room',
    titleHi: 'सुपर डीलक्स रूम',
    subtitle: 'Upgraded contemporary guestroom with plush seating [CONFIRM SQ FT]',
    singleInr: 3500,
    doubleInr: 4500,
    rates: {
      single: { EP: 3500, CP: 3850, MAP: 4350, AP: 4800 },
      double: { EP: 4500, CP: 4850, MAP: 5350, AP: 5800 },
    },
    sizeSqFt: '340 sq. ft. [CONFIRM]',
    bedType: 'King / Twin Bed',
    maxGuests: 3,
    image: superDeluxeImg,
    images: [superDeluxeImg, gallery2Img, gallery7Img],
    highlights: [
      'Plush lounge seating corner',
      '24h hot & cold shower',
      'High-speed Wi-Fi & Satellite TV',
      'Daily housekeeping & tea maker',
    ],
    description:
      'Generously proportioned guestrooms pairing crisp linens with dedicated reading chairs and full hotel facility access.',
    isPlaceholderRate: true,
  },
  {
    id: 'deluxe-room',
    tier: 'Deluxe',
    title: 'Deluxe Room',
    titleHi: 'डीलक्स रूम',
    subtitle: 'Balanced comfort for business trips and family stopovers [CONFIRM SQ FT]',
    singleInr: 2800,
    doubleInr: 3800,
    rates: {
      single: { EP: 2800, CP: 3150, MAP: 3650, AP: 4100 },
      double: { EP: 3800, CP: 4150, MAP: 4650, AP: 5100 },
    },
    sizeSqFt: '295 sq. ft. [CONFIRM]',
    bedType: 'Queen / Twin Bed',
    maxGuests: 2,
    image: deluxeRoomImg,
    images: [deluxeRoomImg, gallery8Img, gallery2Img],
    highlights: [
      'Individual split air conditioning',
      'Executive work desk & outlets',
      'Cosmetic & bath kit',
      '24-hour in-room dining',
    ],
    description:
      'Clean, airy accommodation offering reliable comfort on Waidhan Main Road with quick access to the swimming pool and travel desk.',
    isPlaceholderRate: true,
  },
  {
    id: 'standard-ac',
    tier: 'Standard',
    title: 'Standard A/C Room',
    titleHi: 'स्टैंडर्ड एसी रूम',
    subtitle: 'Smart, value-focused air-conditioned stay with full property privileges',
    singleInr: 2000,
    doubleInr: 2700,
    rates: {
      single: { EP: 2000, CP: 2350, MAP: 2850, AP: 3300 },
      double: { EP: 2700, CP: 3050, MAP: 3550, AP: 4000 },
    },
    sizeSqFt: '240 sq. ft. [CONFIRM]',
    bedType: 'Double / Twin Bed',
    maxGuests: 2,
    image: standardAcImg,
    images: [standardAcImg, gallery7Img, gallery3Img],
    highlights: [
      'Individual climate control',
      'Free Wi-Fi & Satellite TV',
      'Secured gated parking',
      '24-hour front desk & room service',
    ],
    description:
      'Practical, spotless accommodation starting from ₹2,000/night with full access to 24-hour room service, Sharda Restaurant, and secured vehicle parking.',
    isPlaceholderRate: true,
  },
];

export const LEADERSHIP_PROFILES = [
  {
    id: 'md',
    name: 'Mr. S. D. Singh',
    role: 'Managing Director',
    motto: 'Atithi-Devo-Bhava',
    image: mdDirectorImg,
    quote:
      'Widely recognized as the best hotel in town with the motto "Atithi-Devo-Bhava", Waidhan is one of the top destinations for those visiting this area for business purposes. Here at Hotel Satya International, we endeavor to exceed your expectations of accommodation and dining by providing a comfortable atmosphere with a friendly approach.',
  },
  {
    id: 'gm',
    name: 'Mr. Rajan G.P.',
    role: 'General Manager',
    motto: 'Home Away From Home',
    image: gmManagerImg,
    quote:
      'When staying at Hotel Satya International you are assured of the highest quality accommodation, services, and facilities. We work alongside our dedicated staff and have instilled pride and savoir-faire aimed at guaranteeing the best possible experience from the moment you enter the hotel to the time of your departure.',
  },
];

export const SINGRAULI_HERITAGE = {
  foundingYear: 2011,
  milestoneNote:
    "Singrauli's first classified three-star hotel, established in 2011 on Main Road, Belaunji, Waidhan.",
  propertyStory:
    'Synthesizing convenience, comfort, and luxury to complement business and leisure needs, Hotel Satya International has served visiting executives, families, and grand celebrations since 2011.',
  regionalHistory:
    'Emerging as India’s Energy Capital, Singrauli—historically known as Shringavali after the sage Shringi—was ruled by the Kings of Rewa State until 1947. Following the 1962 inauguration of the Govind Ballabh Pant Sagar Dam on the River Rihand by Pt. Jawaharlal Nehru and the discovery of a 2,200 sq. km coal belt across eastern Madhya Pradesh and southern Sonebhadra, Waidhan transformed into one of India’s premier thermal power and industrial corridors.',
};

/**
 * SECTION 5 — SHARDA MULTI-CUISINE RESTAURANT, EUROPEAN BAKERY & BLUE DIAMOND BAR
 */
export const DINING_AND_BAR = {
  restaurant: {
    name: 'Sharda Multi-Cuisine Restaurant & European Bakery',
    image: shardaRestaurantImg,
    cuisines: [
      'Indian & North Indian',
      'Tandoor & Mughlai',
      'Chinese & Oriental',
      'Continental & Italian',
      'South Indian Breakfast',
      'European Bakery & Desserts',
    ],
    hours: '7:00 AM – 11:00 PM Daily [CONFIRM EXACT TIMINGS]',
    seatingCapacity: '80 Covers [PLACEHOLDER]',
    description:
      'A refined family and executive dining hall serving freshly prepared Indian, Tandoor, Mughlai, Chinese, Continental, and South Indian delicacies alongside our 100% original European-technology bakery crafting custom birthday, anniversary, and multi-tier wedding cakes.',
  },
  bar: {
    name: 'Blue Diamond Colonial Lounge Bar',
    image: blueDiamondBarImg,
    hours: '11:00 AM – 11:00 PM (Last Order 10:30 PM)',
    phone: '+91-7415866637',
    agePolicy: 'Strictly 21+ years only · Valid Government Photo ID required',
    description:
      'Waidhan’s premier colonial-style lounge bar offering imported Scotch, single malts, signature cocktails, and mocktails served in imported crystal-clear glassware with complimentary bar snacks and curated music.',
  },
};

export interface MenuItemEntry {
  name: string;
  isVeg: boolean;
  priceInr: string;
  description: string;
}

export const SHARDA_TABBED_MENU: Record<string, MenuItemEntry[]> = {
  'Indian & Tandoor': [
    {
      name: 'Paneer Tikka Multani / Malai Kebab',
      isVeg: true,
      priceInr: '₹320 [PLACEHOLDER]',
      description: 'Charcoal-roasted cottage cheese cubes marinated in hung curd and royal spices.',
    },
    {
      name: 'Dal Makhani Sharda Signature',
      isVeg: true,
      priceInr: '₹260 [PLACEHOLDER]',
      description: 'Black lentils simmered overnight on slow charcoal embers with churned butter.',
    },
    {
      name: 'Murg Musallam / Butter Chicken Royal',
      isVeg: false,
      priceInr: '₹420 [PLACEHOLDER]',
      description: 'Clay-oven roasted chicken simmered in rich tomato-cashew velvet gravy.',
    },
    {
      name: 'Mutton Rogan Josh & Saffron Dum Biryani',
      isVeg: false,
      priceInr: '₹480 [PLACEHOLDER]',
      description: 'Slow-braised tender lamb cooked with aromatic Kashmiri spices and basmati.',
    },
    {
      name: 'Assorted Tandoori Bread Basket (Naan / Lachha / Kulcha)',
      isVeg: true,
      priceInr: '₹180 [PLACEHOLDER]',
      description: 'Freshly baked clay-oven breads brushed with pure ghee or garlic butter.',
    },
  ],
  'Chinese & Oriental': [
    {
      name: 'Crispy Chilli Paneer / Honey Lotus Stem',
      isVeg: true,
      priceInr: '₹290 [PLACEHOLDER]',
      description: 'Wok-tossed cottage cheese with bell peppers, scallions, and Szechuan glaze.',
    },
    {
      name: 'Veg Hakka Noodles & Manchurian Bowl',
      isVeg: true,
      priceInr: '₹270 [PLACEHOLDER]',
      description: 'Classic Indo-Oriental wok noodles paired with vegetable dumplings.',
    },
    {
      name: 'Drums of Heaven & Kung Pao Chicken',
      isVeg: false,
      priceInr: '₹380 [PLACEHOLDER]',
      description: 'Wok-seared chicken with roasted peanuts, dry chillies, and ginger-garlic soy.',
    },
  ],
  'Continental & South Indian': [
    {
      name: 'Morning Executive Breakfast Buffet (CP Plan)',
      isVeg: true,
      priceInr: '₹350',
      description: 'Masala dosa, idli-vada sambar, stuffed parathas, cut fruits, bakery rolls & tea/coffee.',
    },
    {
      name: 'Grilled Cottage Cheese / Herb Chicken Steak',
      isVeg: false,
      priceInr: '₹390 [PLACEHOLDER]',
      description: 'Served with sautéed seasonal vegetables, mashed potatoes, and peppercorn jus.',
    },
    {
      name: 'Penne Arrabbiata / Creamy Alfredo Pasta',
      isVeg: true,
      priceInr: '₹310 [PLACEHOLDER]',
      description: 'Italian durum wheat pasta tossed with olive oil, herbs, and parmesan.',
    },
  ],
  'European Bakery & Cakes': [
    {
      name: 'Custom Celebration Cake (1 Kg · Belgian Truffle / Fresh Fruit)',
      isVeg: true,
      priceInr: '₹950 [PLACEHOLDER]',
      description: '100% original European-technique custom bakery cake for birthdays & anniversaries.',
    },
    {
      name: 'Bespoke Multi-Tier Wedding & Reception Gateau',
      isVeg: true,
      priceInr: 'Custom Quote [PLACEHOLDER]',
      description: 'Hand-crafted multi-tier designer cakes tailored for 200 to 3,000-guest celebrations.',
    },
    {
      name: 'Fresh Pastries, Tarts & Brownie Platter',
      isVeg: true,
      priceInr: '₹220 [PLACEHOLDER]',
      description: 'Daily patisserie selection prepared with fresh cream and European couverture.',
    },
  ],
};

export const CULINARY_HIGHLIGHTS = {
  shardaMenu: [
    {
      name: 'Royal Mughlai Handi & Tandoor Platter',
      category: 'Mughlai & Indian',
      note: 'Slow-simmered gravies, saffron pulao, and clay-oven breads prepared fresh to order.',
    },
    {
      name: 'Szechuan & Oriental Wok Signatures',
      category: 'Chinese & Oriental',
      note: 'Crisp seasonal vegetables, aromatic ginger-garlic glazes, and hand-tossed noodles.',
    },
    {
      name: 'Continental & Wood-Fired Italian Classics',
      category: 'Continental & Italian',
      note: 'Herb-roasted entrees, artisanal pastas, and executive business lunch platters.',
    },
    {
      name: 'Morning Executive Breakfast Buffet (CP/MAP/AP)',
      category: '7:00 AM – 10:30 AM',
      note: 'South & North Indian hot selections, seasonal fruits, fresh bakes, and estate tea/coffee.',
    },
  ],
  bakerySpecialties: [
    {
      name: 'Bespoke Multi-Tier Wedding & Reception Cakes',
      category: '100% Original Custom Bakery',
      note: 'Crafted using European confectionery techniques and fresh dairy cream for lawn & banquet galas.',
    },
    {
      name: 'Artisanal Pastries, Truffles & Celebration Gateaux',
      category: 'Daily Fresh Patisserie',
      note: 'Custom milestone birthday, anniversary, and corporate felicitation cakes on pre-order.',
    },
  ],
  barSignatures: [
    {
      name: 'Single Malts, Aged Scotch & Imported Spirits',
      category: 'Crystal Glassware Service',
      note: 'Curated international labels poured in imported crystal-clear glassware with complimentary snacks.',
    },
    {
      name: 'Blue Diamond Signature Cocktails & Mocktails',
      category: '11:00 AM – 11:00 PM',
      note: 'Hand-shaken botanicals, citrus infusions, and non-alcoholic craft mocktails in a colonial lounge.',
    },
  ],
};

/**
 * SECTION 6 — BANQUETS, LAWNS & EVENTS
 */
export const EVENT_VENUES = [
  {
    id: 'lawn',
    name: 'Open-Air Lawn (3000 Pax)',
    capacity: 'Up to 3,000 Guests',
    areaSqFt: '35,000+ sq. ft. [CONFIRM]',
    idealFor: 'Grand Weddings, Receptions,baraat Welcomes & Cultural Galas',
    description:
      'Expansive manicured grounds on Waidhan Main Road with dedicated gated parking for cars, buses, and coaches, heavy-duty DG power backup, custom stage lighting, and Sharda multi-cuisine catering.',
    image: gallery6Img,
  },
  {
    id: 'banquet',
    name: 'Grand Banquet Hall (200 Pax)',
    capacity: 'Up to 200 Guests',
    areaSqFt: '3,200 sq. ft. [CONFIRM]',
    idealFor: 'Corporate Seminars, Ring Ceremonies, Engagements & Milestone Dinners',
    description:
      'Pillarless climate-controlled indoor banquet hall with modular theatre/cluster seating, projector & PA audio-visual support, and adjacent pre-function buffet foyer.',
    image: banquetHallImg,
  },
  {
    id: 'party',
    name: 'Party Room (40 Pax)',
    capacity: 'Up to 40 Guests',
    areaSqFt: '900 sq. ft. [CONFIRM]',
    idealFor: 'Private Birthdays, Kitty Parties, Family Gatherings & Team Dinners',
    description:
      'Intimate celebration lounge paired with custom cakes from Sharda European Bakery and personalized steward service.',
    image: gallery5Img,
  },
  {
    id: 'meeting',
    name: 'Executive Meeting Room (20 Pax)',
    capacity: 'Up to 20 Guests',
    areaSqFt: '550 sq. ft. [CONFIRM]',
    idealFor: 'Board Briefings, NTPC / Reliance / Hindalco Vendor Reviews & Interviews',
    description:
      'Quiet air-conditioned boardroom with high-speed Wi-Fi, presentation display, whiteboards, and continuous tea/coffee & working lunch service.',
    image: gallery3Img,
  },
];

export const BANQUET_PACKAGES = [
  {
    id: 'wedding-pkg',
    title: 'Royal Singrauli Wedding & Reception Package',
    subtitle: 'For 300 to 3,000 Guests · Lawn + Banquet Hall + Guestroom Block',
    priceNote: 'Custom Per-Plate & Venue Package [REQUEST QUOTE]',
    inclusions: [
      'Exclusive access to 3,000-Pax Open-Air Lawn & indoor 200-Pax Banquet Hall',
      'Royal Suite / Presidential Suite bridal & groom dressing quarters',
      'Custom multi-cuisine buffet by Sharda Restaurant + Live Chaat & Tandoor counters',
      'Bespoke multi-tier Wedding Cake from our European-technology Bakery',
      'Panelled decorator, floral mandap/stage lighting & 100% DG power backup',
      'Gated security & valet parking for cars, family buses, and outstation coaches',
    ],
  },
  {
    id: 'corporate-pkg',
    title: 'Corporate Seminar, AGM & Vendor Meet Package',
    subtitle: 'For 15 to 200 Delegates · Full-Day / Half-Day Conference Plan',
    priceNote: 'From ₹850 / Delegate [PLACEHOLDER — CONFIRM WITH HOTEL]',
    inclusions: [
      'Air-conditioned Hall or Boardroom in Theatre, Classroom, or U-Shape layout',
      'HD Projector, projection screen, wireless microphones, podium & stationery',
      'Dedicated high-speed Wi-Fi & uninterrupted generator backup',
      'Morning & afternoon high-tea with bakery cookies + Executive Buffet Lunch',
      'GST-compliant corporate tax invoice & preferential group room rates',
    ],
  },
];

export const BANQUET_IMAGE = banquetHallImg;

/**
 * SECTION 7 — 16 HOTEL FACILITIES & AMENITIES + POOL RULES
 */
export const FACILITIES_LIST = [
  { icon: 'Waves', title: 'Outdoor Swimming Pool', detail: 'Crystal-clear leisure pool for morning laps & evening relaxation' },
  { icon: 'Dumbbell', title: 'Health Club & Gym', detail: 'Fitness centre with cardio & strength equipment for resident guests' },
  { icon: 'Wifi', title: 'Free High-Speed Wi-Fi', detail: 'Dedicated broadband across all 7 room tiers, lobby & conference halls' },
  { icon: 'Utensils', title: '24-Hour Room Service', detail: 'Round-the-clock in-room dining from Sharda Restaurant kitchen' },
  { icon: 'Zap', title: '100% Power Backup / DG', detail: 'Heavy-duty silent generators ensuring uninterrupted A/C & elevators' },
  { icon: 'Car', title: 'Gated Car, Bus & Coach Parking', detail: 'Spacious on-site garage and secured compound on Belaunji Main Road' },
  { icon: 'Compass', title: 'Travel Desk & Cab Service', detail: 'Railway/airport transfers, plant commute sedans & air/rail ticketing' },
  { icon: 'Shirt', title: 'Express Laundry & Pressing', detail: 'Same-day wash, dry-cleaning & executive suit pressing service' },
  { icon: 'Stethoscope', title: 'Doctor on Call (24×7)', detail: 'Immediate medical assistance & wheelchair-accessible ground entry' },
  { icon: 'ShieldCheck', title: '24×7 CCTV & Gated Security', detail: 'Full perimeter surveillance, fire safety & 24-hour security guards' },
  { icon: 'Briefcase', title: 'Business Centre & Printing', detail: 'E-mail, scanning, photocopying & secretarial support at reception' },
  { icon: 'Users', title: 'Conference & Boardroom', detail: '20-pax Meeting Room & 200-pax Banquet Hall with AV equipment' },
  { icon: 'ArrowUpDown', title: 'Passenger Elevator / Lift', detail: 'Convenient lift access across guestroom and banquet floors' },
  { icon: 'CreditCard', title: 'All Cards, UPI & ATM Nearby', detail: 'Visa/MasterCard/RuPay, UPI & major bank ATMs within 200m [CONFIRM]' },
  { icon: 'Plane', title: 'Station & Airport Pickup', detail: 'Pre-booked sedans for Singrauli Station (25 km) & Varanasi [CONFIRM]' },
  { icon: 'Info', title: 'Pet & Accessibility Policy', detail: 'Disabled-friendly access; pets subject to prior management approval [CONFIRM]' },
];

export const POOL_TIMINGS_AND_RULES = {
  hours: '7:00 AM – 7:00 PM Daily [CONFIRM SEASONAL HOURS]',
  access: 'Complimentary for registered in-house guests across all 7 room tiers',
  rules: [
    'Proper nylon/lycra swimwear is mandatory before entering the pool.',
    'Children under 12 years must be accompanied by an adult guardian at all times.',
    'Shower before entering; food and glassware are strictly prohibited on the pool deck.',
  ],
};

/**
 * SECTION 8 — CORPORATE & LONG-STAY PROGRAMME
 */
export const CORPORATE_SECTORS = [
  'NTPC Vindhyanagar (VSTPP — 4 km)',
  'NTPC Shaktinagar & Rihand',
  'Reliance Sasan Ultra Mega Power (18 km)',
  'Hindalco Mahan Aluminium (Bargawan)',
  'Northern Coalfields Limited (NCL / Coal India)',
  'Essar Power, L&T, BHEL & EPC Vendors',
];

export const CORPORATE_BENEFITS = [
  {
    title: 'Compliant B2B GST Invoicing',
    detail: 'Instant tax invoices with company GSTIN, SAC codes, and direct corporate ledger billing.',
  },
  {
    title: 'Contracted Annual & Monthly Tariffs',
    detail: 'Special long-stay rates for project engineers, auditors, and rotational plant executives.',
  },
  {
    title: '6:00 AM Early Shift Breakfast Packs',
    detail: 'Packed hot breakfasts & flask tea/coffee ready before early morning gate shifts.',
  },
  {
    title: 'Dedicated Plant & Station Transfers',
    detail: 'Punctual monthly/daily Bolero, Innova & sedan cab arrangements via our Travel Desk.',
  },
  {
    title: 'Express Daily Laundry Quota',
    detail: 'Bundled daily laundry & uniform pressing included in long-stay corporate MAP/AP plans.',
  },
  {
    title: 'Complimentary Boardroom Hours',
    detail: 'Priority access to our 20-pax Executive Meeting Room for vendor reviews and interviews.',
  },
];

/**
 * SECTION 9 — GALLERY ITEMS
 */
export const GALLERY_ITEMS = [
  { src: heroExteriorImg, title: 'Main Road Architectural Facade', category: 'Exterior', subtitle: 'Rising along Belaunji Main Road in Waidhan, Singrauli' },
  { src: exteriorAltImg, title: 'Illuminated Evening Courtyard & Parking', category: 'Exterior', subtitle: 'Secured gated car, bus, and coach parking compound' },
  { src: lobbyMainImg, title: 'Grand Reception & Marble Atrium', category: 'Exterior', subtitle: '24-hour front desk hospitality guided by Atithi-Devo-Bhava' },
  { src: travelDeskImg, title: 'Dedicated Travel & Concierge Desk', category: 'Exterior', subtitle: 'Railway & air ticketing, airport transfers & car rentals' },
  { src: royalSuiteImg, title: 'Royal Suite Living Quarters', category: 'Rooms', subtitle: '680 sq. ft. flagship suite with private parlor lounge (EP ₹7,400 / ₹9,000)' },
  { src: presidentialSuiteImg, title: 'Presidential Suite Bedroom', category: 'Rooms', subtitle: '590 sq. ft. executive suite with orthopedic king bed (EP ₹6,500 / ₹7,450)' },
  { src: executiveSuiteImg, title: 'Executive Business Suite', category: 'Rooms', subtitle: '490 sq. ft. quiet workspace & lounge for corporate leaders (EP ₹5,500 / ₹6,500)' },
  { src: superiorSuiteImg, title: 'Superior Corner Suite', category: 'Rooms', subtitle: '430 sq. ft. bright corner suite overlooking Belaunji Main Road (EP ₹4,500 / ₹5,500)' },
  { src: superDeluxeImg, title: 'Super Deluxe Guestroom', category: 'Rooms', subtitle: '340 sq. ft. contemporary room with plush seating (EP ₹3,500 / ₹4,500)' },
  { src: deluxeRoomImg, title: 'Deluxe Comfort Room', category: 'Rooms', subtitle: '295 sq. ft. climate-controlled business & family room (EP ₹2,800 / ₹3,800)' },
  { src: standardAcImg, title: 'Standard A/C Guestroom', category: 'Rooms', subtitle: '240 sq. ft. smart value stay with full property privileges (EP ₹2,000 / ₹2,700)' },
  { src: gallery1Img, title: 'Suite Parlor & Seating Alcove', category: 'Rooms', subtitle: 'Warm timber finishes and bespoke upholstery' },
  { src: gallery2Img, title: 'Guestroom Work Desk & Seating', category: 'Rooms', subtitle: 'High-speed Wi-Fi, satellite HD television & 24h room service' },
  { src: gallery7Img, title: 'Orthopedic Bedding & Ambient Lighting', category: 'Rooms', subtitle: 'Posture-care mattresses and 24-hour hot & cold water' },
  { src: gallery8Img, title: 'Suite Hospitality & Bath Finishing', category: 'Rooms', subtitle: 'Cosmetic & bath supplements with express laundry access' },
  { src: shardaRestaurantImg, title: 'Sharda Multi-Cuisine Restaurant', category: 'Dining', subtitle: 'Indian, Tandoor, Chinese, Continental, South Indian & Custom Bakery' },
  { src: gallery4Img, title: 'Fine Dining Table Setting at Sharda', category: 'Dining', subtitle: 'Multi-cuisine family & executive dining from 7:00 AM to 11:00 PM' },
  { src: blueDiamondBarImg, title: 'Blue Diamond Colonial Lounge Bar', category: 'Bar', subtitle: 'Imported spirits, cocktails & crystal glassware (11:00 AM – 11:00 PM)' },
  { src: poolExteriorImg, title: 'Outdoor Swimming Pool & Deck', category: 'Pool', subtitle: 'Sparkling leisure pool and health club for resident guests' },
  { src: banquetHallImg, title: 'Grand Banquet & Celebration Hall (200 Pax)', category: 'Lawn & Events', subtitle: 'Climate-controlled indoor hall for seminars, engagements & galas' },
  { src: gallery5Img, title: 'Banquet Reception Stage Arrangement', category: 'Lawn & Events', subtitle: 'Custom floral, stage lighting, and audio-visual conferencing' },
  { src: gallery6Img, title: '3,000-Guest Open-Air Lawn Gala', category: 'Lawn & Events', subtitle: 'Singrauli’s premier outdoor wedding and reception destination' },
  { src: gallery3Img, title: 'Executive Corridor & Conference Foyer', category: 'Lawn & Events', subtitle: 'Pristine housekeeping and acoustic tranquility' },
];

/**
 * SECTION 10 — PLACEHOLDER REVIEWS (Clearly labeled [PLACEHOLDER REVIEW] as requested)
 */
export const HISTORICAL_BENCHMARK_REVIEWS: PlatformReview[] = [
  {
    id: 'bench-1',
    authorName: '[PLACEHOLDER REVIEW — Corporate Guest]',
    stayCategory: 'Business',
    roomStayed: 'Executive Suite',
    rating: 4.5,
    cleanlinessRating: 4.5,
    diningRating: 4.5,
    hospitalityRating: 5.0,
    title: '[PLACEHOLDER] Convenient executive stay 10 mins from NTPC Vindhyanagar',
    comment:
      '[PLACEHOLDER REVIEW — Replace with verified Google Review text] Located right on Belaunji Main Road just 4 km from NTPC VSTPP. Spacious suite, reliable Wi-Fi, prompt GST billing, and courteous front-desk team.',
    sourceLabel: 'Google Review [PLACEHOLDER]',
    dateLabel: 'Sample Entry',
    isPlaceholder: true,
  },
  {
    id: 'bench-2',
    authorName: '[PLACEHOLDER REVIEW — Wedding Host Family]',
    stayCategory: 'Wedding & Events',
    roomStayed: 'Royal Suite & Open-Air Lawn',
    rating: 4.5,
    cleanlinessRating: 4.5,
    diningRating: 5.0,
    hospitalityRating: 4.5,
    title: '[PLACEHOLDER] Grand 3,000-capacity wedding lawn & Sharda Bakery cake',
    comment:
      '[PLACEHOLDER REVIEW — Replace with verified MakeMyTrip/Google Review text] Hosted our family reception on the open-air lawn with outstation guest rooms. Ample bus parking and delicious multi-cuisine catering.',
    sourceLabel: 'MakeMyTrip [PLACEHOLDER]',
    dateLabel: 'Sample Entry',
    isPlaceholder: true,
  },
  {
    id: 'bench-3',
    authorName: '[PLACEHOLDER REVIEW — Family Traveller]',
    stayCategory: 'Family',
    roomStayed: 'Super Deluxe Room',
    rating: 4.0,
    cleanlinessRating: 4.0,
    diningRating: 4.5,
    hospitalityRating: 4.5,
    title: '[PLACEHOLDER] Clean swimming pool, family dining & colonial lounge bar',
    comment:
      '[PLACEHOLDER REVIEW — Replace with verified Goibibo/Booking.com Review text] Great stopover in Waidhan with a clean swimming pool, attentive 24h room service, and fresh North Indian & Chinese dinner at Sharda Restaurant.',
    sourceLabel: 'Goibibo [PLACEHOLDER]',
    dateLabel: 'Sample Entry',
    isPlaceholder: true,
  },
  {
    id: 'bench-4',
    authorName: '[PLACEHOLDER REVIEW — Industrial Consultant]',
    stayCategory: 'Solo',
    roomStayed: 'Deluxe Room',
    rating: 4.0,
    cleanlinessRating: 4.5,
    diningRating: 4.0,
    hospitalityRating: 4.5,
    title: '[PLACEHOLDER] Smooth station pickup & early morning breakfast pack',
    comment:
      '[PLACEHOLDER REVIEW — Replace with verified Booking.com Review text] Travel desk arranged a punctual cab from Singrauli Railway Station and reception prepared an early breakfast pack before my Sasan plant visit.',
    sourceLabel: 'Booking.com [PLACEHOLDER]',
    dateLabel: 'Sample Entry',
    isPlaceholder: true,
  },
];

/**
 * SECTION 11 — LOCATION & NEARBY DISTANCE TABLE
 */
export const NEARBY_LANDMARKS: LandmarkItem[] = [
  {
    id: 'waidhan-bus-stand',
    name: 'Waidhan Inter-State Bus Stand',
    category: 'Transit',
    distanceKm: 2.5,
    distanceLabel: '2.5 km [CONFIRM]',
    driveMinutes: 6,
    lat: 24.0665,
    lng: 82.6152,
    note: 'Central Waidhan town transit hub on Main Road.',
  },
  {
    id: 'ntpc-vindhyanagar',
    name: 'NTPC Vindhyanagar Super Thermal Power Station (VSTPP)',
    category: 'Power & Industry',
    distanceKm: 4,
    distanceLabel: '4 km',
    driveMinutes: 10,
    lat: 24.0886,
    lng: 82.6512,
    note: 'Closest major thermal power hub; 10-minute drive from hotel gate.',
  },
  {
    id: 'ntpc-shaktinagar',
    name: 'NTPC Shaktinagar (Singrauli Super Thermal Power Station)',
    category: 'Power & Industry',
    distanceKm: 12,
    distanceLabel: '12 km',
    driveMinutes: 22,
    lat: 24.1178,
    lng: 82.7073,
    note: 'Direct highway access via Main Road Waidhan.',
  },
  {
    id: 'singrauli-airstrip',
    name: 'Singrauli Airstrip (Waidhan) / Rewa / Varanasi Airports',
    category: 'Transit',
    distanceKm: 14,
    distanceLabel: '14 km (Airstrip) · 240 km (VNS Airport) [CONFIRM]',
    driveMinutes: 25,
    lat: 24.0412,
    lng: 82.5891,
    note: 'Varanasi Airport (240 km) & Rewa Airport (~145 km [CONFIRM]) transfers via Travel Desk.',
  },
  {
    id: 'reliance-sasan',
    name: 'Reliance Sasan Ultra Mega Power Plant',
    category: 'Power & Industry',
    distanceKm: 18,
    distanceLabel: '18 km',
    driveMinutes: 30,
    lat: 23.9781,
    lng: 82.6258,
    note: 'Primary corporate stay corridor for Sasan engineering consultants.',
  },
  {
    id: 'singrauli-railway',
    name: 'Singrauli Railway Station (SGRL) / Bargawan Station',
    category: 'Transit',
    distanceKm: 25,
    distanceLabel: '25 km [CONFIRM]',
    driveMinutes: 40,
    lat: 24.1984,
    lng: 82.6656,
    note: '24×7 Travel Desk arranges pre-booked sedan & SUV station pickups.',
  },
  {
    id: 'hindalco-bargawan',
    name: 'Hindalco Mahan Aluminium (Bargawan) & Renukoot Corridor',
    category: 'Power & Industry',
    distanceKm: 25,
    distanceLabel: '25 km (Bargawan) · 65 km (Renukoot) [CONFIRM]',
    driveMinutes: 42,
    lat: 24.1856,
    lng: 82.4312,
    note: 'Major aluminum & power industrial belt.',
  },
  {
    id: 'ntpc-rihand',
    name: 'NTPC Rihand Nagar & Govind Ballabh Pant Sagar (Rihand Dam)',
    category: 'Tourism',
    distanceKm: 30,
    distanceLabel: '30 km',
    driveMinutes: 50,
    lat: 24.0352,
    lng: 82.7905,
    note: 'Historic 1962 reservoir & Rihand Super Thermal Power Station.',
  },
  {
    id: 'mada-eco-park',
    name: 'Mada Eco-Friendly Park & Ancient Rock-Cut Caves',
    category: 'Tourism',
    distanceKm: 33,
    distanceLabel: '33 km',
    driveMinutes: 55,
    lat: 23.9245,
    lng: 82.7615,
    note: '7th–8th century rock-cut caves & scenic forest excursion.',
  },
];

/**
 * SECTION 12 — 14 COMPREHENSIVE POLICIES & FAQS
 */
export const AEO_FAQS = [
  {
    category: 'Timings & ID',
    q: '1. What are the standard check-in and check-out timings at Hotel Satya International?',
    a: 'Standard check-in time is 2:00 PM (14:00 IST) and check-out time is 12:00 PM (Noon).',
  },
  {
    category: 'Timings & ID',
    q: '2. What government ID proofs are mandatory at check-in?',
    a: 'All adult guests must present a valid original Government Photo ID (Aadhaar Card, Passport, Driving Licence, or Voter ID) upon arrival. PAN cards are not accepted as address/identity proof.',
  },
  {
    category: 'Booking & Cancellation',
    q: '3. What is your cancellation and refund policy for direct bookings?',
    a: 'Free cancellation up to 48 hours prior to check-in date for standard individual bookings; cancellations within 24–48 hours may attract a 1-night retention charge [CONFIRM EXACT CANCELLATION WINDOW WITH HOTEL]. Peak wedding dates and bulk room blocks follow contracted terms.',
  },
  {
    category: 'Guests & Extra Bed',
    q: '4. What is the child and extra-bed policy?',
    a: 'Children up to 6 years stay complimentary when sharing existing bedding. An extra bed/mattress is available at ₹800 per night (EP) [PLACEHOLDER — CONFIRM EXTRA BED RATE].',
  },
  {
    category: 'Timings & ID',
    q: '5. What is your policy for unmarried couples and local ID guests?',
    a: 'Married and unmarried couples aged 21+ with valid individual Government Photo IDs are welcome, subject to standard management verification [CONFIRM LOCAL ID POLICY WITH HOTEL].',
  },
  {
    category: 'Billing & Payment',
    q: '6. Which payment modes are accepted at the reception?',
    a: 'We accept all major Credit & Debit Cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm, BHIM), NEFT/RTGS corporate bank transfers, and cash at the front desk.',
  },
  {
    category: 'Billing & Payment',
    q: '7. Do you provide B2B GST tax invoices for corporate travellers?',
    a: 'Yes. Simply check "Corporate / GST Booking" during reservation and provide your Company Name and 15-digit GSTIN. GST is charged as per government slabs (12% for tariffs up to ₹7,500/night; 18% above ₹7,500/night).',
  },
  {
    category: 'Timings & ID',
    q: '8. Can I request early check-in or late check-out (for early morning train arrivals)?',
    a: 'Subject to room availability, complimentary early check-in up to 2 hours may be extended for direct corporate bookings. Half-day tariffs apply for guaranteed early morning (6:00 AM–10:00 AM) check-in or late evening check-out [CONFIRM].',
  },
  {
    category: 'Facilities',
    q: '9. Is secured parking available for cars, SUVs, and wedding/corporate buses?',
    a: 'Yes. We provide a gated, CCTV-monitored on-site garage and parking compound capable of accommodating private cars, corporate fleets, and large wedding buses/coaches free of charge.',
  },
  {
    category: 'Facilities',
    q: '10. How do I arrange Singrauli Railway Station or Varanasi Airport pickup?',
    a: 'Our 24×7 Travel Desk arranges dedicated A/C sedans and SUVs for Singrauli Railway Station (25 km), Bargawan Station (25 km), and Varanasi Airport (240 km). Select "Station/Airport Pickup" in special requests or message us on WhatsApp.',
  },
  {
    category: 'Facilities',
    q: '11. Are pets allowed at Hotel Satya International?',
    a: 'Pets are generally not permitted inside indoor suites and dining areas; please contact reception in advance for special assistance [CONFIRM PET POLICY WITH HOTEL].',
  },
  {
    category: 'Dining & Bar',
    q: '12. What is the alcohol and age policy at Blue Diamond Bar?',
    a: 'Blue Diamond Bar is open from 11:00 AM to 11:00 PM (Last Order 10:30 PM). Entry and liquor service are strictly restricted to guests aged 21 years and above with valid photo ID.',
  },
  {
    category: 'Events',
    q: '13. What advance payment is required to block the 3,000-Guest Wedding Lawn or Banquet Hall?',
    a: 'A 25%–50% booking advance is required to lock event dates for the Open-Air Lawn (3,000 Pax) or Grand Banquet Hall (200 Pax), with the balance settled prior to the event [CONFIRM ADVANCE TERMS].',
  },
  {
    category: 'Facilities',
    q: '14. Does the hotel have 24-hour power backup, Wi-Fi, and hot water?',
    a: 'Yes. The property operates heavy-duty silent DG sets for 100% power backup, free high-speed Wi-Fi across all floors, passenger lift, and 24-hour running hot & cold water.',
  },
];

/**
 * DELIVERABLE CHECKLIST OF EVERY [PLACEHOLDER] / [CONFIRM] ITEM FOR THE HOTEL OWNER
 */
export const PLACEHOLDER_CHECKLIST = [
  {
    item: 'Official GSTIN Number',
    location: 'BOOKING_CONFIG.gstinPlaceholder & Footer',
    currentValue: '23AAACH0000A1Z5 [PLACEHOLDER]',
    action: 'Replace with Hotel Satya International’s registered 15-digit Madhya Pradesh GSTIN.',
  },
  {
    item: 'Merchant UPI ID & QR Code Image',
    location: 'BOOKING_CONFIG.upiIdPlaceholder & Booking Confirmation Modal',
    currentValue: 'hotelsatyainternational@sbi [PLACEHOLDER]',
    action: 'Replace with active hotel current-account UPI ID and official QR code image.',
  },
  {
    item: 'Extra Bed / Mattress Nightly Charge',
    location: 'BOOKING_CONFIG.extraBedChargePerNight',
    currentValue: '₹800 / night [PLACEHOLDER]',
    action: 'Confirm exact extra bed/mattress rate for EP, CP, MAP, and AP plans.',
  },
  {
    item: 'Exact Room Square Footage (Superior, Super Deluxe, Deluxe, Standard A/C)',
    location: 'ROOM_CATEGORIES[3..6].sizeSqFt',
    currentValue: '430 / 340 / 295 / 240 sq. ft. [CONFIRM]',
    action: 'Verify exact carpet area and bed configurations for tiers 4–7 (EP tariffs ₹4,500, ₹3,500, ₹2,800, ₹2,000 are already verified from official website).',
  },
  {
    item: 'Sharda Restaurant Dish Prices & Seating Capacity',
    location: 'SHARDA_TABBED_MENU & DINING_AND_BAR.restaurant.seatingCapacity',
    currentValue: '80 Covers & Dish Prices [PLACEHOLDER]',
    action: 'Update individual à-la-carte menu item prices from current printed Sharda menu.',
  },
  {
    item: 'Swimming Pool Timings & Pet / Couple / Cancellation Policies',
    location: 'POOL_TIMINGS_AND_RULES & AEO_FAQS',
    currentValue: '7:00 AM – 7:00 PM & 48h Cancellation [CONFIRM]',
    action: 'Confirm seasonal pool hours, pet policy, local ID policy, and cancellation window.',
  },
  {
    item: 'Customer Review Cards',
    location: 'HISTORICAL_BENCHMARK_REVIEWS',
    currentValue: 'Marked as [PLACEHOLDER REVIEW]',
    action: 'Paste verbatim Google Maps / MakeMyTrip guest reviews or collect live reviews via the built-in Firestore guest review form.',
  },
  {
    item: 'GA4 Measurement ID & Meta Pixel ID',
    location: 'src/lib/analytics.ts',
    currentValue: 'G-XXXXXXXXXX / 000000000000000 [PLACEHOLDER]',
    action: 'Insert live Google Analytics 4 and Meta Pixel IDs for conversion tracking.',
  },
];
