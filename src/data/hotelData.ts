/**
 * ============================================================================
 * CENTRAL HOTEL DATA & VERIFIED FACTUAL ARCHIVE (/src/data/hotelData.ts)
 * ============================================================================
 * Every hotel-specific claim, room rate, facility, distance, telephone number,
 * and event capacity in this file is strictly verified against the official
 * Hotel Satya International archive (https://hotelsatyainternational.com/ &
 * Google Maps Place ID 0x398f369a0ff99001:0xdb5aec929d36db90).
 * ============================================================================
 */

export type Language = 'en' | 'hi';
export type OccupancyType = 'Single' | 'Double';
export type MealPlanCode = 'EP' | 'CP' | 'MAP' | 'AP';

export const UI_TRANSLATIONS: Record<
  Language,
  {
    brandSub: string;
    welcome: string;
    announcement: string;
    nav: {
      home: string;
      rooms: string;
      dining: string;
      banquets: string;
      facilities: string;
      gallery: string;
      about: string;
      reviews: string;
      location: string;
      contact: string;
      bookStay: string;
    };
    hero: {
      eyebrow: string;
      headline: string;
      subcopy: string;
      checkRatesBtn: string;
      whatsappBtn: string;
      callBtn: string;
    };
    sections: {
      bookingTitle: string;
      roomsTitle: string;
      diningTitle: string;
      banquetsTitle: string;
      facilitiesTitle: string;
      corporateTitle: string;
      galleryTitle: string;
      reviewsTitle: string;
      locationTitle: string;
      faqTitle: string;
      contactTitle: string;
    };
  }
> = {
  en: {
    brandSub: 'Waidhan · Singrauli · Est. 2011',
    welcome: 'स्वागत है · Welcome to Singrauli’s First Classified 3-Star Luxury Hotel',
    announcement:
      'Direct Reservation Desk · Free Wi-Fi Connectivity · Outdoor Swimming Pool · 24-Hour Room Service',
    nav: {
      home: 'Home',
      rooms: 'Rooms & Suites',
      dining: 'Dining',
      banquets: 'Events & Banquets',
      facilities: 'Facilities',
      gallery: 'Gallery',
      about: 'About Us',
      reviews: 'Reviews',
      location: 'Location',
      contact: 'Contact',
      bookStay: 'Book Now',
    },
    hero: {
      eyebrow: 'Singrauli’s First Classified 3-Star Luxury Hotel · Est. 2011 · Waidhan, M.P.',
      headline: 'Where Comfort Meets Exceptional Hospitality.',
      subcopy:
        'Seven thoughtfully appointed room and suite categories, Sharda Multi-Cuisine Restaurant & European-technology Bakery, Blue Diamond Colonial Bar, an outdoor swimming pool, and 3,000-guest celebration lawns on Belaunji Main Road.',
      checkRatesBtn: 'Explore Rooms & Tariffs',
      whatsappBtn: 'Book on WhatsApp',
      callBtn: 'Call 24×7 Reception',
    },
    sections: {
      bookingTitle: 'Check Dates & Published Room Tariffs',
      roomsTitle: 'Seven Room & Suite Categories (₹2,000 – ₹9,000)',
      diningTitle: 'Sharda Multi-Cuisine Restaurant, Custom Bakery & Blue Diamond Bar',
      banquetsTitle: '3,000-Guest Celebration Lawn, Banquet Hall & Meeting Rooms',
      facilitiesTitle: 'Verified Three-Star Hotel Facilities & Resident Services',
      corporateTitle: 'Corporate & Executive Stays Across the Singrauli Power Corridor',
      galleryTitle: 'Authentic Property Photography Lookbook',
      reviewsTitle: 'Verified Guest Reviews & Google Maps Feedback',
      locationTitle: 'Belaunji Main Road Location & Verified Corridor Distances',
      faqTitle: 'Guest Policies, Check-In Rules & Frequently Asked Questions',
      contactTitle: '24×7 Front Office, Reservations & Direct Desk',
    },
  },
  hi: {
    brandSub: 'वैढ़न · सिंगरौली · स्थापना २०११',
    welcome: 'स्वागत है · सिंगरौली का प्रथम वर्गीकृत ३-स्टार लक्ज़री होटल',
    announcement:
      'डायरेक्ट बुकिंग सहायता · निःशुल्क वाई-फाई · आउटडोर स्विमिंग पूल · २४ घंटे रूम सर्विस',
    nav: {
      home: 'होम',
      rooms: 'सुइट्स और रूम्स',
      dining: 'डाइनिंग और बार',
      banquets: 'बैंक्वेट और इवेंट्स',
      facilities: 'सुविधाएं',
      gallery: 'गैलरी',
      about: 'हमारे बारे में',
      reviews: 'समीक्षाएं',
      location: 'लोकेशन',
      contact: 'संपर्क',
      bookStay: 'रूम बुक करें',
    },
    hero: {
      eyebrow: 'सिंगरौली का प्रथम ३-स्टार लक्ज़री होटल · स्थापना २०११ · वैढ़न, मध्य प्रदेश',
      headline: 'जहाँ आराम और उत्कृष्ट आतिथ्य का संगम होता है।',
      subcopy:
        'बेलौंजी मेन रोड, वैढ़न पर स्थित ७ सुइट और रूम श्रेणियां, शारदा मल्टी-कुज़ीन रेस्टोरेंट एवं बेकरी, ब्लू डायमंड बार, स्विमिंग पूल और ३,००० मेहमानों की क्षमता वाला भव्य लॉन।',
      checkRatesBtn: 'रूम और टैरिफ देखें',
      whatsappBtn: 'व्हाट्सएप पर बुक करें',
      callBtn: '२४×७ रिसेप्शन कॉल करें',
    },
    sections: {
      bookingTitle: 'तारीख और प्रकाशित रूम टैरिफ जांचें',
      roomsTitle: '७ सुइट्स और रूम श्रेणियां (₹2,000 – ₹9,000)',
      diningTitle: 'शारदा मल्टी-कुज़ीन रेस्टोरेंट, बेकरी और ब्लू डायमंड बार',
      banquetsTitle: '३,००० मेहमानों का वेडिंग लॉन, बैंक्वेट हॉल और मीटिंग रूम',
      facilitiesTitle: 'होटल की प्रमाणित ३-स्टार सुविधाएं और सेवाएं',
      corporateTitle: 'सिंगरौली कॉर्पोरेट और एग्जीक्यूटिव प्रवास सुविधा',
      galleryTitle: 'होटल सत्या इंटरनेशनल फोटो गैलरी',
      reviewsTitle: 'अतिथि समीक्षाएं और गूगल मैप्स फीडबैक',
      locationTitle: 'लोकेशन मैप और प्रमुख स्थानों से प्रमाणित दूरी',
      faqTitle: 'होटल नियम, चेक-इन जानकारी और सामान्य प्रश्न (FAQ)',
      contactTitle: '२४×७ रिसेप्शन और डायरेक्ट बुकिंग संपर्क',
    },
  },
};

export const BOOKING_CONFIG = {
  whatsappNumber: '919009284982',
  primaryPhone: '+91-7805-350217',
  secondaryMobile: '+91-9009284982',
  barPhone: '+91-7415866637',
  email: 'hotelsatyainternational@gmail.com',
  checkInTime: '2:00 PM',
  checkOutTime: '12:00 PM (Noon)',
  tariffTaxNote:
    'Published room tariffs are per night and exclusive of applicable taxes. EP, CP, MAP, and AP meal plans as well as extra bed arrangements are confirmed by our 24×7 Front Office.',
  childPolicyNote:
    'Children below 6 years stay complimentary when sharing existing bedding with parents.',
};

export const HOTEL_INFO = {
  name: 'Hotel Satya International',
  legalName: 'Hotel Satya International, Waidhan',
  tagline: 'A Tradition of Gracious Living in the Heart of Singrauli',
  classification: 'First Classified 3-Star Luxury Hotel in Singrauli',
  established: 2011,
  address: 'Main Road, Belaunji, Waidhan, Singrauli, Madhya Pradesh 486886, India',
  shortAddress: 'Main Road, Belaunji, Waidhan, Singrauli (M.P.) 486886',
  plusCode: '3JFF+W7 Waidhan, Madhya Pradesh',
  coordinates: {
    lat: 24.072285,
    lng: 82.6206458,
  },
  phones: [
    '+91-7805-350217',
    '+91-9009284982',
    '+91-8719932581',
    '+91-7024366637',
  ],
  landlines: [
    '07805-350217',
    '07805-234793',
    '07805-234794',
    '07805-350186',
  ],
  barPhone: '+91-7415866637',
  whatsapp: '919009284982',
  email: 'hotelsatyainternational@gmail.com',
  website: 'https://hotelsatyainternational.com/',
  googleMapsUrl:
    'https://www.google.com/maps/place/Hotel+Satya+International/@24.0739924,82.6068803,2880m/data=!3m1!1e3!4m13!1m2!2m1!1sHotels!3m9!1s0x398f369a0ff99001:0xdb5aec929d36db90!5m2!4m1!1i2!8m2!3d24.072285!4d82.6206458!15sCgZIb3RlbHOSAQVob3RlbKoBOhABKgoiBmhvdGVscygAMh4QASIainsixGVQ51rDIRxGAWYdQunD1rZjbCyu2qAyChACIgZob3RlbHPgAQA!16s%2Fg%2F11b6lmtf04',
  checkInTime: '2:00 PM',
  checkOutTime: '12:00 PM',
  logo: 'https://hotelsatyainternational.com/img/logo.png',
  heroImage: 'https://hotelsatyainternational.com/img/slider-1.jpg',
  exteriorNightImage: 'https://hotelsatyainternational.com/img/slider-2.jpg',
  poolImage: 'https://hotelsatyainternational.com/img/pool.jpg',
};

export interface HeroSlide {
  id: string;
  title: string;
  caption: string;
  image: string;
  badge: string;
}

export const HERO_CAROUSEL_SLIDES: HeroSlide[] = [
  {
    id: 'facade-day',
    title: 'Grand Exterior & Arrival Forecourt on Belaunji Main Road',
    caption: 'Singrauli’s landmark 3-star classified hospitality destination since 2011',
    image: 'https://hotelsatyainternational.com/img/slider-1.jpg',
    badge: 'Landmark Facade',
  },
  {
    id: 'facade-evening',
    title: 'Illuminated Evening Facade & Gated Parking',
    caption: '4 Km from NTPC Vindhyanagar · 25 Km from Singrauli Railway Station',
    image: 'https://hotelsatyainternational.com/img/slider-2.jpg',
    badge: 'Evening View',
  },
  {
    id: 'royal-suite',
    title: 'Royal Suite — Flagship VIP Residence',
    caption: 'Published Tariff: Single ₹7,400 · Double ₹9,000 per night',
    image: 'https://hotelsatyainternational.com/img/suite-royal.jpg',
    badge: 'Royal Suite',
  },
  {
    id: 'pool-oasis',
    title: 'Outdoor Swimming Pool & Health Club',
    caption: 'Complimentary access for resident guests',
    image: 'https://hotelsatyainternational.com/img/pool.jpg',
    badge: 'Swimming Pool',
  },
  {
    id: 'sharda-dining',
    title: 'Sharda Multi-Cuisine Restaurant & Custom Bakery',
    caption: 'Indian, Mughlai, Chinese, Continental, Italian & Oriental cuisines',
    image: 'https://hotelsatyainternational.com/img/restaurant.jpg',
    badge: 'Sharda Dining',
  },
  {
    id: 'blue-diamond',
    title: 'Blue Diamond Colonial-Style Bar & Lounge',
    caption: 'Imported spirits, signature cocktails & mocktails (11:00 AM – 11:00 PM)',
    image: 'https://hotelsatyainternational.com/img/bar.jpg',
    badge: 'Blue Diamond Bar',
  },
  {
    id: 'banquet-lawn',
    title: 'Grand Banquet Hall & 3,000-Guest Open-Air Lawn',
    caption: 'Premier destination for Singrauli weddings, receptions & corporate conferences',
    image: 'https://hotelsatyainternational.com/img/banquet.jpg',
    badge: 'Weddings & Events',
  },
];

export const MEAL_PLANS: {
  code: MealPlanCode;
  label: string;
  shortLabel: string;
  note: string;
}[] = [
  {
    code: 'EP',
    label: 'European Plan (EP)',
    shortLabel: 'Room Only',
    note: 'Room accommodation with complimentary Wi-Fi & swimming pool access.',
  },
  {
    code: 'CP',
    label: 'Continental Plan (CP)',
    shortLabel: 'Room + Breakfast',
    note: 'Includes room accommodation plus morning breakfast at Sharda Restaurant.',
  },
  {
    code: 'MAP',
    label: 'Modified American Plan (MAP)',
    shortLabel: 'Breakfast + Lunch/Dinner',
    note: 'Includes room accommodation, morning breakfast, and one major meal (Lunch or Dinner).',
  },
  {
    code: 'AP',
    label: 'American Plan (AP)',
    shortLabel: 'All 3 Meals Included',
    note: 'Includes room accommodation, breakfast, lunch, and dinner at Sharda Restaurant.',
  },
];

export interface RoomCategory {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  tier: 'Suite' | 'Deluxe' | 'Standard';
  categoryLabel: string;
  bedType: string;
  maxGuests: number;
  rates: {
    single: number;
    double: number;
  };
  image: string;
  images: string[];
  description: string;
  highlights: string[];
}

export const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'royal-suite',
    title: 'Royal Suite',
    titleHi: 'रॉयल सुइट',
    subtitle: 'Suite Room Royal · Flagship VIP Hospitality',
    tier: 'Suite',
    categoryLabel: 'Suite Room Royal',
    bedType: 'King Bed + Private Drawing Lounge',
    maxGuests: 4,
    rates: {
      single: 7400,
      double: 9000,
    },
    image: 'https://hotelsatyainternational.com/img/suite-royal.jpg',
    images: [
      'https://hotelsatyainternational.com/img/suite-royal.jpg',
      'https://hotelsatyainternational.com/img/gallery/1.jpg',
      'https://hotelsatyainternational.com/img/gallery/2.jpg',
    ],
    description:
      'Our flagship suite crafted for visiting corporate leadership, dignitaries, and wedding families—featuring a spacious living and meeting area, plush king bedding, satellite television, and 24-hour room service.',
    highlights: [
      'Separate VIP Living & Meeting Lounge',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'presidential-suite',
    title: 'Presidential Suite',
    titleHi: 'प्रेसिडेंशियल सुइट',
    subtitle: 'Suite Room Presidential · Senior Executive Residence',
    tier: 'Suite',
    categoryLabel: 'Suite Room Presidential',
    bedType: 'King Bed + Executive Seating Area',
    maxGuests: 3,
    rates: {
      single: 6500,
      double: 7450,
    },
    image: 'https://hotelsatyainternational.com/img/suite-presidential.jpg',
    images: [
      'https://hotelsatyainternational.com/img/suite-presidential.jpg',
      'https://hotelsatyainternational.com/img/gallery/3.jpg',
      'https://hotelsatyainternational.com/img/gallery/4.jpg',
    ],
    description:
      'Designed for senior power-sector executives and long-stay directors visiting Waidhan, offering a refined seating zone, executive work desk, satellite television, and priority housekeeping.',
    highlights: [
      'Executive Seating Zone & Work Desk',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'executive-suite',
    title: 'Executive Suite',
    titleHi: 'एग्जीक्यूटिव सुइट',
    subtitle: 'Suite Room Executive · Business Suite',
    tier: 'Suite',
    categoryLabel: 'Suite Room Executive',
    bedType: 'King Bed + Lounge Seating',
    maxGuests: 3,
    rates: {
      single: 5500,
      double: 6500,
    },
    image: 'https://hotelsatyainternational.com/img/suite-executive.jpg',
    images: [
      'https://hotelsatyainternational.com/img/suite-executive.jpg',
      'https://hotelsatyainternational.com/img/gallery/5.jpg',
      'https://hotelsatyainternational.com/img/gallery/6.jpg',
    ],
    description:
      'Tailored for corporate consultants and project managers visiting NTPC, Reliance, Hindalco, and NCL, combining generous workspace with restful acoustic comfort.',
    highlights: [
      'Dedicated Work Desk & Lounge Seating',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'superior-suite',
    title: 'Superior Suite',
    titleHi: 'सुपीरियर सुइट',
    subtitle: 'Suite Room Superior · Family & Extended-Stay Suite',
    tier: 'Suite',
    categoryLabel: 'Suite Room Superior',
    bedType: 'King Bed + Sofa Seating',
    maxGuests: 3,
    rates: {
      single: 4500,
      double: 5500,
    },
    image: 'https://hotelsatyainternational.com/img/suite-superior.jpg',
    images: [
      'https://hotelsatyainternational.com/img/suite-superior.jpg',
      'https://hotelsatyainternational.com/img/gallery/7.jpg',
      'https://hotelsatyainternational.com/img/gallery/8.jpg',
    ],
    description:
      'An inviting suite category with warm wooden accents, comfortable sofa seating, and complete three-star amenities for families and extended business stays.',
    highlights: [
      'Spacious Bedroom with Sofa Seating',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'super-deluxe',
    title: 'Super Deluxe Room',
    titleHi: 'सुपर डीलक्स रूम',
    subtitle: 'Deluxe Room Super · Upgraded Corporate Comfort',
    tier: 'Deluxe',
    categoryLabel: 'Deluxe Room Super',
    bedType: 'Queen / Twin Bed Options',
    maxGuests: 3,
    rates: {
      single: 3500,
      double: 4500,
    },
    image: 'https://hotelsatyainternational.com/img/deluxe-super.jpg',
    images: [
      'https://hotelsatyainternational.com/img/deluxe-super.jpg',
      'https://hotelsatyainternational.com/img/gallery/9.jpg',
      'https://hotelsatyainternational.com/img/gallery/10.jpg',
    ],
    description:
      'Our preferred corporate deluxe room featuring climate-controlled air conditioning, ergonomic workspace, satellite TV, and 24-hour in-room dining from Sharda Restaurant.',
    highlights: [
      'Climate-Controlled A/C & Work Desk',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'deluxe-standard',
    title: 'Deluxe Room',
    titleHi: 'डीलक्स रूम',
    subtitle: 'Deluxe Room Standard · Classic Business Stay',
    tier: 'Deluxe',
    categoryLabel: 'Deluxe Room Standard',
    bedType: 'Double Bed',
    maxGuests: 2,
    rates: {
      single: 2800,
      double: 3800,
    },
    image: 'https://hotelsatyainternational.com/img/deluxe-standard.jpg',
    images: [
      'https://hotelsatyainternational.com/img/deluxe-standard.jpg',
      'https://hotelsatyainternational.com/img/gallery/11.jpg',
      'https://hotelsatyainternational.com/img/gallery/12.jpg',
    ],
    description:
      'Well-appointed air-conditioned guest room ideal for business travellers, engineering teams, and families seeking dependable three-star hospitality on Waidhan Main Road.',
    highlights: [
      'Air-Conditioned Comfort & Work Desk',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
  {
    id: 'ac-standard',
    title: 'Standard A/C Room',
    titleHi: 'स्टैंडर्ड ए/सी रूम',
    subtitle: 'AC Room Standard · Smart Value Accommodation',
    tier: 'Standard',
    categoryLabel: 'AC Room Standard',
    bedType: 'Double Bed',
    maxGuests: 2,
    rates: {
      single: 2000,
      double: 2700,
    },
    image: 'https://hotelsatyainternational.com/img/ac-standard.jpg',
    images: [
      'https://hotelsatyainternational.com/img/ac-standard.jpg',
      'https://hotelsatyainternational.com/img/gallery/13.jpg',
      'https://hotelsatyainternational.com/img/gallery/14.jpg',
    ],
    description:
      'Clean, comfortable air-conditioned room with full access to Hotel Satya International’s 24-hour room service, Wi-Fi connectivity, and resident swimming pool.',
    highlights: [
      'Air-Conditioned Room with En-Suite Bath',
      'Free High-Speed Wi-Fi Connectivity',
      'Outdoor Swimming Pool & Health Club Access',
      'Satellite Television & 24-Hour Room Service',
      'Hot & Cold Water with Bathing Supplements',
      'EP, CP, MAP & AP Meal Plans Available',
    ],
  },
];

export const DINING_AND_BAR = {
  restaurant: {
    name: 'Sharda Multi-Cuisine Restaurant & Bakery',
    tagline: 'Fine Family Dining & 100% Original European-Technology Custom Bakery',
    cuisines: ['Indian', 'Mughlai', 'Chinese', 'Continental', 'Italian', 'Oriental'],
    serviceNote: 'Family & Executive Dining · 24-Hour Room Service Available',
    image: 'https://hotelsatyainternational.com/img/restaurant.jpg',
    description:
      'Sharda Restaurant offers an extensive multi-cuisine culinary repertoire spanning authentic Indian, rich Mughlai, Chinese, Continental, Italian, and Oriental specialties. Our in-house Bakery uses 100% original European baking technologies to craft fresh breads, desserts, anniversary cakes, and custom multi-tier wedding cakes.',
  },
  bar: {
    name: 'Blue Diamond Bar',
    tagline: 'Colonial-Style Executive Lounge & Bar',
    hours: '11:00 AM – 11:00 PM (Last Order at 10:30 PM)',
    phone: '+91-7415866637',
    serviceNote: 'Imported Liquor, Signature Cocktails & Mocktails with Complimentary Snacks',
    image: 'https://hotelsatyainternational.com/img/bar.jpg',
    description:
      'Designed with classic colonial-inspired wood interiors and ambient lighting, Blue Diamond Bar serves imported spirits, signature cocktails in crystal-clear glassware accompanied by complimentary lounge snacks, and refreshing mocktails.',
  },
};

export interface CulinarySpecialtyItem {
  name: string;
  cuisineTag: string;
  description: string;
  isVeg: boolean;
}

export const SHARDA_CULINARY_SPECIALTIES: Record<string, CulinarySpecialtyItem[]> = {
  'Indian & Mughlai': [
    {
      name: 'Traditional North Indian & Mughlai Curries',
      cuisineTag: 'Indian & Mughlai',
      description: 'Rich paneer delicacies, slow-simmered dals, and aromatic Mughlai gravies prepared fresh by our master chefs.',
      isVeg: true,
    },
    {
      name: 'Clay-Oven Tandoori Kebabs & Assorted Breads',
      cuisineTag: 'Tandoor Specialties',
      description: 'Char-grilled vegetarian and non-vegetarian tikkas, seekh kebabs, stuffed kulchas, and butter naan.',
      isVeg: false,
    },
    {
      name: 'Awadhi & Hyderabadi Dum Biryanis',
      cuisineTag: 'Royal Rice Dishes',
      description: 'Fragrant basmati rice slow-cooked with whole spices, saffron, and seasonal vegetables or tender meats.',
      isVeg: true,
    },
  ],
  'Chinese & Oriental': [
    {
      name: 'Wok-Tossed Oriental Starters & Dim Sum',
      cuisineTag: 'Chinese & Oriental',
      description: 'Crispy chilli paneer, Manchurian, honey chilli starters, and classic Schezwan preparations.',
      isVeg: true,
    },
    {
      name: 'Hakka Noodles, Fried Rice & Oriental Gravies',
      cuisineTag: 'Pan-Asian Mains',
      description: 'Authentic wok-tossed noodles, aromatic fried rice, and savory Chinese main courses.',
      isVeg: true,
    },
  ],
  'Continental & Italian': [
    {
      name: 'Italian Pastas, Grills & Continental Platters',
      cuisineTag: 'Continental & Italian',
      description: 'Creamy penne pastas, continental soups, roasted seasonal vegetables, and chef’s special sizzlers.',
      isVeg: true,
    },
    {
      name: 'Executive Morning Breakfast & Corporate Buffets',
      cuisineTag: 'CP / MAP / AP Plans',
      description: 'Hot Indian and Continental breakfast spread served daily for resident corporate and family guests.',
      isVeg: true,
    },
  ],
  'European Bakery': [
    {
      name: 'Custom Birthday, Anniversary & Wedding Cakes',
      cuisineTag: '100% Original European Tech Bakery',
      description: 'Bespoke celebration cakes, Belgian chocolate truffle, fresh fruit gateaux, and multi-tier wedding cakes on pre-order.',
      isVeg: true,
    },
    {
      name: 'Artisanal Pastries, Desserts & Freshly Baked Breads',
      cuisineTag: 'In-House Patisserie',
      description: 'Prepared daily in our European-technology bakery for restaurant guests and takeaway orders.',
      isVeg: true,
    },
  ],
};

export const BANQUET_IMAGE = 'https://hotelsatyainternational.com/img/banquet.jpg';

export type VerifiedVenueName =
  | 'Open-Air Lawn (3000 Pax)'
  | 'Grand Banquet Hall (200 Pax)'
  | 'Party Room (40 Pax)'
  | 'Executive Meeting Room (20 Pax)';

export interface EventVenue {
  id: string;
  name: VerifiedVenueName;
  capacity: string;
  venueType: string;
  idealFor: string;
  description: string;
  image: string;
}

export const EVENT_VENUES: EventVenue[] = [
  {
    id: 'open-air-lawn',
    name: 'Open-Air Lawn (3000 Pax)',
    capacity: 'Up to 3,000 Guests',
    venueType: 'Expansive Outdoor Marriage & Reception Lawn',
    idealFor: 'Grand Weddings, Receptions & Cultural Galas',
    description:
      'One of Singrauli’s largest manicured open-air celebration lawns, accommodating up to 3,000 guests with custom mandap/stage setups, multi-cuisine Sharda catering, and gated parking.',
    image: 'https://hotelsatyainternational.com/img/gallery/19.jpg',
  },
  {
    id: 'grand-banquet',
    name: 'Grand Banquet Hall (200 Pax)',
    capacity: 'Up to 200 Guests',
    venueType: 'Air-Conditioned Indoor Banquet Hall',
    idealFor: 'Conferences, Seminars, Ring Ceremonies & Corporate Events',
    description:
      'Fully air-conditioned indoor banquet venue for up to 200 guests, ideal for corporate seminars, engagement ceremonies, anniversary dinners, and official gatherings.',
    image: 'https://hotelsatyainternational.com/img/banquet.jpg',
  },
  {
    id: 'party-room',
    name: 'Party Room (40 Pax)',
    capacity: 'Up to 40 Guests',
    venueType: 'Private Celebration Lounge',
    idealFor: 'Birthday Parties, Kitty Parties & Family Dinners',
    description:
      'Intimate indoor celebration space for up to 40 guests with customized buffet dining and fresh celebration cakes from our European bakery.',
    image: 'https://hotelsatyainternational.com/img/gallery/20.jpg',
  },
  {
    id: 'meeting-room',
    name: 'Executive Meeting Room (20 Pax)',
    capacity: 'Up to 20 Guests',
    venueType: 'Executive Boardroom',
    idealFor: 'Board Meetings, Vendor Reviews & Interviews',
    description:
      'Quiet, air-conditioned executive meeting room for up to 20 delegates with Wi-Fi connectivity and prompt tea, coffee, and working lunch service.',
    image: 'https://hotelsatyainternational.com/img/gallery/15.jpg',
  },
];

export const BANQUET_HIGHLIGHTS = [
  {
    id: 'weddings-receptions',
    title: 'Grand Weddings & Family Celebrations',
    subtitle: 'Open-Air Lawn (3,000 Guests) · Banquet Hall (200 Guests) · Party Room (40 Guests)',
    inclusions: [
      'Customized multi-cuisine vegetarian & non-vegetarian catering by Sharda Restaurant',
      'Bespoke multi-tier wedding & celebration cakes from our European-technology Bakery',
      '7 room & suite categories on-site for accommodating bridal & outstation family guests',
      'Dedicated Travel Desk for guest railway station & airport transfers',
      'Garage and secured on-site parking on Belaunji Main Road',
    ],
  },
  {
    id: 'corporate-conferences',
    title: 'Corporate Conferences, Seminars & Board Meetings',
    subtitle: 'Banquet Hall (200 Guests) · Executive Meeting Room (20 Guests)',
    inclusions: [
      'Flexible theatre, classroom, cluster, or boardroom seating configurations',
      'High-speed Wi-Fi connectivity for presentations and executive sessions',
      'Curated morning tea, working buffet lunch & evening high-tea packages',
      'Central Waidhan Main Road location (4 Km from NTPC Vindhyanagar)',
      'Formal tax invoicing and dedicated Front Office coordination',
    ],
  },
];

export const FACILITIES_LIST: {
  title: string;
  detail: string;
  icon: string;
}[] = [
  {
    title: '24-Hour Room Service',
    detail: 'Round-the-clock in-room dining and attentive hospitality across all seven room and suite categories.',
    icon: 'Utensils',
  },
  {
    title: 'Outdoor Swimming Pool',
    detail: 'Refreshing outdoor swimming pool on the hotel premises for registered resident guests.',
    icon: 'Waves',
  },
  {
    title: 'Health Club',
    detail: 'Dedicated on-site fitness and health club facility for daily guest workouts.',
    icon: 'Dumbbell',
  },
  {
    title: 'Free Wi-Fi Connectivity',
    detail: 'Complimentary wireless internet connectivity across guest rooms, suites, lobby, and meeting spaces.',
    icon: 'Wifi',
  },
  {
    title: 'Satellite Television',
    detail: 'In-room television with satellite channels for news, sports, and family entertainment.',
    icon: 'Tv',
  },
  {
    title: 'Hot & Cold Water Supply',
    detail: 'Continuous running hot and cold water in all en-suite bathrooms.',
    icon: 'Droplets',
  },
  {
    title: 'Cosmetic & Bathing Supplements',
    detail: 'Curated guest toiletries, fresh towels, and bathing supplements replenished by housekeeping.',
    icon: 'Sparkles',
  },
  {
    title: 'Doctor on Call',
    detail: 'Prompt medical assistance and doctor-on-call support arranged through our 24×7 Front Office.',
    icon: 'Stethoscope',
  },
  {
    title: 'Travel Desk (Transport, Rail & Air)',
    detail: 'Full-service travel desk assisting with local cab transport, railway reservations, and air ticket booking.',
    icon: 'Plane',
  },
  {
    title: 'Garage & Secured Parking',
    detail: 'On-site garage and private parking space for executive sedans, SUVs, and family vehicles.',
    icon: 'Car',
  },
  {
    title: 'Access for Disabled Guests',
    detail: 'Wheelchair-friendly ground access and attentive staff assistance for differently-abled guests.',
    icon: 'Users',
  },
  {
    title: 'Newspapers & Guest Perquisites',
    detail: 'Daily newspapers and thoughtful three-star hospitality perquisites for resident guests.',
    icon: 'FileText',
  },
];

export const POOL_AND_HEALTH_CLUB_INFO = {
  headline: 'Complimentary Access for Resident Guests',
  subtitle: 'Outdoor Swimming Pool & On-Site Health Club',
  highlights: [
    'Clean, well-maintained outdoor swimming pool located within the hotel compound',
    'On-site Health Club for morning and evening fitness routines',
    'Fresh poolside towels and changing support arranged by housekeeping',
    'Children must be accompanied by an adult guardian while using the pool area',
  ],
};

export const CORPORATE_SECTORS = [
  'NTPC Vindhyanagar (VSTPP — 04 Km)',
  'NTPC Shaktinagar (SSTPP — 12 Km)',
  'Reliance Power Plant, Sasan (18 Km)',
  'Hindalco Industries, Bargawan (25 Km)',
  'NTPC Rihand Nagar (RhSTPP — 30 Km)',
  'Coal, Power & Infrastructure Vendors Across Singrauli',
];

export const CORPORATE_BENEFITS = [
  {
    title: 'Prime Industrial Corridor Location',
    detail: 'Situated on Belaunji Main Road in Waidhan—just 4 Km from NTPC Vindhyanagar and 18 Km from Reliance Sasan.',
  },
  {
    title: 'Seven Tiers of Executive Accommodation',
    detail: 'From Standard A/C Rooms (₹2,000) to the Royal Suite (₹9,000) with dedicated work desks and lounge areas.',
  },
  {
    title: 'EP, CP, MAP & AP Meal Plans',
    detail: 'Flexible room-only or inclusive meal plans served at Sharda Multi-Cuisine Restaurant with 24-hour room service.',
  },
  {
    title: 'Dedicated Travel & Ticketing Desk',
    detail: 'In-house assistance for plant gate cab transfers, Singrauli/Varanasi railway pickups, and air ticket bookings.',
  },
  {
    title: 'On-Site Boardroom & Banquet Hall',
    detail: 'Host 20-delegate vendor reviews in our Meeting Room or 200-delegate seminars in our air-conditioned Banquet Hall.',
  },
  {
    title: '24×7 Front Office & Billing Support',
    detail: 'Round-the-clock check-in support and formal tax invoicing for corporate executives and project teams.',
  },
];

export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  motto: string;
  quote: string;
  image: string;
}

export const LEADERSHIP_PROFILES: LeadershipProfile[] = [
  {
    id: 'md-sd-singh',
    name: 'Mr. S. D. Singh',
    role: 'Managing Director',
    motto: 'Atithi Devo Bhava (अतिथि देवो भव:)',
    quote:
      'Since establishing Hotel Satya International in 2011 as Singrauli’s first classified 3-star luxury hotel, our guiding philosophy has remained Atithi Devo Bhava—welcoming every corporate leader, engineer, and family guest with genuine warmth, spotless comfort, and uncompromising care.',
    image: 'https://hotelsatyainternational.com/img/md.jpg',
  },
  {
    id: 'gm-rajan-gp',
    name: 'Mr. Rajan G.P.',
    role: 'General Manager',
    motto: 'Operational Excellence & Warm Service',
    quote:
      'Whether you are arriving in Waidhan for a power-project assignment at NTPC or Reliance, dining with family at Sharda Restaurant, or hosting a 3,000-guest celebration on our lawn, our 24×7 hospitality team is committed to making your experience effortless.',
    image: 'https://hotelsatyainternational.com/img/gm.jpg',
  },
];

export const SINGRAULI_HERITAGE = {
  foundingYear: 2011,
  milestone: 'Singrauli’s First Classified 3-Star Luxury Hotel',
  narrative:
    'Established in 2011 on Belaunji Main Road in Waidhan, Hotel Satya International pioneered three-star classified hospitality in Singrauli—India’s Energy Capital. Over the years, we have proudly hosted thousands of corporate executives, government dignitaries, and wedding celebrations.',
};

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: 'Rooms' | 'Dining' | 'Pool' | 'Bar' | 'Lawn & Events' | 'Exterior';
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-ext-1',
    src: 'https://hotelsatyainternational.com/img/slider-1.jpg',
    title: 'Hotel Satya International — Daytime Exterior',
    subtitle: 'Main Road, Belaunji, Waidhan, Singrauli',
    category: 'Exterior',
  },
  {
    id: 'gal-ext-2',
    src: 'https://hotelsatyainternational.com/img/slider-2.jpg',
    title: 'Illuminated Evening Facade',
    subtitle: 'Singrauli’s First Classified 3-Star Luxury Hotel (Est. 2011)',
    category: 'Exterior',
  },
  {
    id: 'gal-ext-3',
    src: 'https://hotelsatyainternational.com/img/slider-3.jpg',
    title: 'Arrival Forecourt & Main Entrance',
    subtitle: '24×7 Reception & Secured On-Site Parking',
    category: 'Exterior',
  },
  {
    id: 'gal-room-royal',
    src: 'https://hotelsatyainternational.com/img/suite-royal.jpg',
    title: 'Royal Suite (Suite Room Royal)',
    subtitle: 'Single ₹7,400 · Double ₹9,000 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-pres',
    src: 'https://hotelsatyainternational.com/img/suite-presidential.jpg',
    title: 'Presidential Suite (Suite Room Presidential)',
    subtitle: 'Single ₹6,500 · Double ₹7,450 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-exec',
    src: 'https://hotelsatyainternational.com/img/suite-executive.jpg',
    title: 'Executive Suite (Suite Room Executive)',
    subtitle: 'Single ₹5,500 · Double ₹6,500 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-sup',
    src: 'https://hotelsatyainternational.com/img/suite-superior.jpg',
    title: 'Superior Suite (Suite Room Superior)',
    subtitle: 'Single ₹4,500 · Double ₹5,500 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-sdeluxe',
    src: 'https://hotelsatyainternational.com/img/deluxe-super.jpg',
    title: 'Super Deluxe Room (Deluxe Room Super)',
    subtitle: 'Single ₹3,500 · Double ₹4,500 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-deluxe',
    src: 'https://hotelsatyainternational.com/img/deluxe-standard.jpg',
    title: 'Deluxe Room (Deluxe Room Standard)',
    subtitle: 'Single ₹2,800 · Double ₹3,800 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-room-ac',
    src: 'https://hotelsatyainternational.com/img/ac-standard.jpg',
    title: 'Standard A/C Room (AC Room Standard)',
    subtitle: 'Single ₹2,000 · Double ₹2,700 per night',
    category: 'Rooms',
  },
  {
    id: 'gal-dining-1',
    src: 'https://hotelsatyainternational.com/img/restaurant.jpg',
    title: 'Sharda Multi-Cuisine Restaurant & Bakery',
    subtitle: 'Indian, Mughlai, Chinese, Continental, Italian & Oriental Cuisines',
    category: 'Dining',
  },
  {
    id: 'gal-bar-1',
    src: 'https://hotelsatyainternational.com/img/bar.jpg',
    title: 'Blue Diamond Colonial-Style Bar',
    subtitle: 'Open 11:00 AM – 11:00 PM (Last Order 10:30 PM)',
    category: 'Bar',
  },
  {
    id: 'gal-pool-1',
    src: 'https://hotelsatyainternational.com/img/pool.jpg',
    title: 'Outdoor Swimming Pool & Health Club',
    subtitle: 'Resident Guest Recreation & Fitness',
    category: 'Pool',
  },
  {
    id: 'gal-banquet-1',
    src: 'https://hotelsatyainternational.com/img/banquet.jpg',
    title: 'Indoor Banquet & Conference Hall',
    subtitle: 'Accommodates Up to 200 Guests',
    category: 'Lawn & Events',
  },
  {
    id: 'gal-arch-1',
    src: 'https://hotelsatyainternational.com/img/gallery/1.jpg',
    title: 'Suite Interior & Seating Lounge',
    subtitle: 'Thoughtfully Appointed Guest Accommodations',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-2',
    src: 'https://hotelsatyainternational.com/img/gallery/2.jpg',
    title: 'Luxury Suite Bedroom View',
    subtitle: 'Plush Bedding & Climate-Controlled Comfort',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-3',
    src: 'https://hotelsatyainternational.com/img/gallery/3.jpg',
    title: 'Presidential Suite Living Space',
    subtitle: 'Executive Hospitality in Waidhan',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-4',
    src: 'https://hotelsatyainternational.com/img/gallery/4.jpg',
    title: 'Suite Furnishing & Decor',
    subtitle: 'Warm Lighting & Spacious Layout',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-5',
    src: 'https://hotelsatyainternational.com/img/gallery/5.jpg',
    title: 'Executive Suite Bedroom',
    subtitle: 'Ideal for Corporate Stays',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-6',
    src: 'https://hotelsatyainternational.com/img/gallery/6.jpg',
    title: 'Suite Lounge & Work Area',
    subtitle: 'Complimentary Wi-Fi & 24-Hour Room Service',
    category: 'Rooms',
  },
  {
    id: 'gal-arch-15',
    src: 'https://hotelsatyainternational.com/img/gallery/15.jpg',
    title: 'Conference & Executive Meeting Setup',
    subtitle: 'Corporate Seminars & Board Meetings',
    category: 'Lawn & Events',
  },
  {
    id: 'gal-arch-16',
    src: 'https://hotelsatyainternational.com/img/gallery/16.jpg',
    title: 'Sharda Restaurant Dining Hall',
    subtitle: 'Multi-Cuisine Family & Executive Dining',
    category: 'Dining',
  },
  {
    id: 'gal-arch-17',
    src: 'https://hotelsatyainternational.com/img/gallery/17.jpg',
    title: 'Blue Diamond Lounge Ambience',
    subtitle: 'Colonial-Inspired Evening Lounge',
    category: 'Bar',
  },
  {
    id: 'gal-arch-18',
    src: 'https://hotelsatyainternational.com/img/gallery/18.jpg',
    title: 'Swimming Pool Deck View',
    subtitle: 'Outdoor Pool at Hotel Satya International',
    category: 'Pool',
  },
  {
    id: 'gal-arch-19',
    src: 'https://hotelsatyainternational.com/img/gallery/19.jpg',
    title: 'Open-Air Celebration Lawn (3,000 Guests)',
    subtitle: 'Grand Weddings & Receptions in Waidhan',
    category: 'Lawn & Events',
  },
  {
    id: 'gal-arch-20',
    src: 'https://hotelsatyainternational.com/img/gallery/20.jpg',
    title: 'Banquet & Celebration Setup',
    subtitle: 'Custom Decor & Sharda Catering',
    category: 'Lawn & Events',
  },
];

export interface LandmarkItem {
  id: string;
  name: string;
  category: 'Power & Industry' | 'Transit' | 'Tourism';
  distanceKm: number;
  distanceLabel: string;
  lat: number;
  lng: number;
  note: string;
}

/**
 * Strictly verified against `famousPlacesDistances` in hotelArchiveManifest.json:
 * - NTPC Vindhyanagar (VSTPP): 04 Km
 * - NTPC Shaktinagar (SSTPP): 12 Km
 * - Reliance Power Plant: 18 Km
 * - Hindalco Bargawan: 25 Km
 * - Singrauli Railway Station: 25 Km
 * - NTPC Rihand Nagar (RhSTPP): 30 Km
 * - Mada Eco Friendly Park: 33 Km
 * - Varanasi Railway Station: 220 Km
 * - Varanasi Airport: 240 Km
 */
export const NEARBY_LANDMARKS: LandmarkItem[] = [
  {
    id: 'ntpc-vindhyanagar',
    name: 'NTPC Vindhyanagar (VSTPP)',
    category: 'Power & Industry',
    distanceKm: 4,
    distanceLabel: '04 Km',
    lat: 24.0935,
    lng: 82.6518,
    note: 'Vindhyachal Super Thermal Power Station township & main plant gates',
  },
  {
    id: 'ntpc-shaktinagar',
    name: 'NTPC Shaktinagar (SSTPP)',
    category: 'Power & Industry',
    distanceKm: 12,
    distanceLabel: '12 Km',
    lat: 24.1045,
    lng: 82.6815,
    note: 'Singrauli Super Thermal Power Station & Shaktinagar industrial belt',
  },
  {
    id: 'reliance-sasan',
    name: 'Reliance Power Plant (Sasan)',
    category: 'Power & Industry',
    distanceKm: 18,
    distanceLabel: '18 Km',
    lat: 23.9781,
    lng: 82.6267,
    note: 'Sasan Ultra Mega Power Project (UMPP) & township',
  },
  {
    id: 'hindalco-bargawan',
    name: 'Hindalco Bargawan',
    category: 'Power & Industry',
    distanceKm: 25,
    distanceLabel: '25 Km',
    lat: 24.1565,
    lng: 82.4631,
    note: 'Hindalco Mahan Aluminium smelter & Bargawan industrial area',
  },
  {
    id: 'singrauli-railway',
    name: 'Singrauli Railway Station',
    category: 'Transit',
    distanceKm: 25,
    distanceLabel: '25 Km',
    lat: 24.1972,
    lng: 82.6658,
    note: 'Major railhead connecting Bhopal, Jabalpur, Delhi, Kolkata & Varanasi',
  },
  {
    id: 'ntpc-rihand',
    name: 'NTPC Rihand Nagar (RhSTPP)',
    category: 'Power & Industry',
    distanceKm: 30,
    distanceLabel: '30 Km',
    lat: 24.0282,
    lng: 82.7915,
    note: 'Rihand Super Thermal Power Station & Rihand Dam corridor',
  },
  {
    id: 'mada-caves',
    name: 'Mada Eco Friendly Park',
    category: 'Tourism',
    distanceKm: 33,
    distanceLabel: '33 Km',
    lat: 23.8912,
    lng: 82.4951,
    note: 'Historic Mada rock-cut caves & scenic eco-tourism park in Singrauli',
  },
  {
    id: 'varanasi-railway',
    name: 'Varanasi Railway Station',
    category: 'Transit',
    distanceKm: 220,
    distanceLabel: '220 Km',
    lat: 25.327,
    lng: 82.986,
    note: 'Long-distance rail hub connected via NH-39 highway transfer',
  },
  {
    id: 'varanasi-airport',
    name: 'Varanasi Airport',
    category: 'Transit',
    distanceKm: 240,
    distanceLabel: '240 Km',
    lat: 25.4524,
    lng: 82.8593,
    note: 'Lal Bahadur Shastri International Airport — Travel Desk cab transfers available',
  },
];

export interface FaqItem {
  category: 'Rooms & Tariffs' | 'Dining & Bar' | 'Banquets & Events' | 'Location & Travel Desk';
  q: string;
  a: string;
}

export const AEO_FAQS: FaqItem[] = [
  {
    category: 'Rooms & Tariffs',
    q: 'What are the published room and suite tariffs at Hotel Satya International, Waidhan?',
    a: 'Hotel Satya International offers seven room and suite categories (per night, exclusive of taxes): Standard A/C Room (Single ₹2,000 / Double ₹2,700), Deluxe Room (Single ₹2,800 / Double ₹3,800), Super Deluxe Room (Single ₹3,500 / Double ₹4,500), Superior Suite (Single ₹4,500 / Double ₹5,500), Executive Suite (Single ₹5,500 / Double ₹6,500), Presidential Suite (Single ₹6,500 / Double ₹7,450), and Royal Suite (Single ₹7,400 / Double ₹9,000).',
  },
  {
    category: 'Rooms & Tariffs',
    q: 'What meal plans are available when booking a stay?',
    a: 'Guests may choose from four hospitality meal plans: EP (European Plan — Room Only), CP (Continental Plan — Room with Morning Breakfast), MAP (Modified American Plan — Room with Breakfast and Lunch or Dinner), and AP (American Plan — Room with Breakfast, Lunch, and Dinner at Sharda Multi-Cuisine Restaurant).',
  },
  {
    category: 'Rooms & Tariffs',
    q: 'What are the standard check-in and check-out times?',
    a: 'Standard check-in time is 2:00 PM and standard check-out time is 12:00 PM (Noon). All checking-in guests are required to present valid original Government photo identification at reception.',
  },
  {
    category: 'Rooms & Tariffs',
    q: 'What on-site facilities are included for resident guests?',
    a: 'Hotel Satya International provides 24-hour room service, an outdoor swimming pool, a health club, complimentary Wi-Fi connectivity, satellite television, continuous hot & cold water, cosmetic and bathing supplements, doctor on call, a full-service travel desk (transport, railway & air ticket booking), garage & parking, disabled guest access, and daily newspapers.',
  },
  {
    category: 'Dining & Bar',
    q: 'What cuisines are served at Sharda Restaurant & Bakery?',
    a: 'Sharda Multi-Cuisine Restaurant serves Indian, Mughlai, Chinese, Continental, Italian, and Oriental cuisines alongside 24-hour room service. Our in-house Bakery uses 100% original European technologies to prepare fresh desserts, celebration cakes, and custom wedding cakes.',
  },
  {
    category: 'Dining & Bar',
    q: 'What are the timings and contact details for Blue Diamond Bar?',
    a: 'Blue Diamond is our colonial-style lounge bar serving imported liquor, cocktails in crystal-clear glasses with complimentary snacks, and mocktails. It is open daily from 11:00 AM to 11:00 PM (last order at 10:30 PM). Direct Bar contact: +91-7415866637.',
  },
  {
    category: 'Banquets & Events',
    q: 'What are the venue capacities for weddings, receptions, and corporate meetings?',
    a: 'Hotel Satya International features four event venues: an expansive Open-Air Lawn accommodating up to 3,000 guests, an indoor air-conditioned Banquet Hall accommodating up to 200 guests, a private Party Room for up to 40 guests, and an executive Meeting Room for up to 20 guests.',
  },
  {
    category: 'Location & Travel Desk',
    q: 'How far is Hotel Satya International from NTPC Vindhyanagar, Reliance Sasan, and Singrauli Railway Station?',
    a: 'Situated on Main Road, Belaunji, Waidhan (Singrauli 486886), the hotel is 04 Km from NTPC Vindhyanagar (VSTPP), 12 Km from NTPC Shaktinagar (SSTPP), 18 Km from Reliance Power Plant (Sasan), 25 Km from Hindalco Bargawan, 25 Km from Singrauli Railway Station, 30 Km from NTPC Rihand Nagar (RhSTPP), 33 Km from Mada Eco Friendly Park, 220 Km from Varanasi Railway Station, and 240 Km from Varanasi Airport.',
  },
  {
    category: 'Location & Travel Desk',
    q: 'How can I contact the 24×7 Front Office or arrange station/airport transfers?',
    a: 'You can reach our 24×7 Front Office directly at +91-7805-350217, 07805-234793, 07805-234794, 07805-350186, or mobile/WhatsApp at +91-9009284982, +91-8719932581, and +91-7024366637, or email hotelsatyainternational@gmail.com. Our Travel Desk arranges cab pickups, railway tickets, and air ticket bookings.',
  },
];
