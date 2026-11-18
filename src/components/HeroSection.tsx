import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Phone,
  Users,
  X,
} from 'lucide-react';
import {
  BOOKING_CONFIG,
  HERO_CAROUSEL_SLIDES,
  HOTEL_INFO,
  Language,
  MEAL_PLANS,
  MealPlanCode,
  OccupancyType,
  ROOM_CATEGORIES,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { trackEvent } from '../lib/analytics';
import { SafeImage } from './SafeImage';

export interface QuickSearchParams {
  checkIn: string;
  checkOut: string;
  roomsCount: number;
  adults: number;
  children: number;
  roomId: string;
  occupancy: OccupancyType;
  includeExtraBed: boolean;
  mealPlan: MealPlanCode;
}

interface HeroSectionProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  selectedRoomId: string;
  onSelectRoomId: (id: string) => void;
  occupancy: OccupancyType;
  onChangeOccupancy: (occ: OccupancyType) => void;
  mealPlan: MealPlanCode;
  onChangeMealPlan: (plan: MealPlanCode) => void;
  onQuickReserve: (params: QuickSearchParams) => void;
}

function getDefaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getDefaultCheckOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

function calcNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) && diff > 0 ? Math.min(diff, 60) : 1;
}

export function HeroSection({
  lang,
  onToggleLang,
  selectedRoomId,
  onSelectRoomId,
  occupancy,
  onChangeOccupancy,
  mealPlan,
  onChangeMealPlan,
  onQuickReserve,
}: HeroSectionProps) {
  const t = UI_TRANSLATIONS[lang];

  // Top hospitality utility bar state
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Full-width cinematic hero slide state
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Booking Search Interface state
  const [checkIn, setCheckIn] = useState(getDefaultCheckIn);
  const [checkOut, setCheckOut] = useState(getDefaultCheckOut);
  const [roomsCount, setRoomsCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [includeExtraBed, setIncludeExtraBed] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_CAROUSEL_SLIDES[slideIdx] || HERO_CAROUSEL_SLIDES[0];
  const selectedRoom =
    ROOM_CATEGORIES.find((r) => r.id === selectedRoomId) || ROOM_CATEGORIES[0];

  const nights = calcNights(checkIn, checkOut);
  const perNightRate =
    occupancy === 'Single'
      ? selectedRoom.rates.single[mealPlan]
      : selectedRoom.rates.double[mealPlan];
  const extraBedPerNight = includeExtraBed ? BOOKING_CONFIG.extraBedChargePerNight : 0;
  const roomSubtotal = (perNightRate + extraBedPerNight) * nights * roomsCount;
  const gstRate =
    perNightRate > BOOKING_CONFIG.gstThresholdInr
      ? BOOKING_CONFIG.gstLuxuryPercent
      : BOOKING_CONFIG.gstStandardPercent;
  const gstAmount = Math.round((roomSubtotal * gstRate) / 100);
  const estimatedTotal = roomSubtotal + gstAmount;

  const handleCheckInChange = (val: string) => {
    setDateError(null);
    setCheckIn(val);
    if (new Date(checkOut) <= new Date(val)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (val: string) => {
    if (new Date(val) <= new Date(checkIn)) {
      setDateError(
        lang === 'hi'
          ? 'चेक-आउट की तारीख चेक-इन के बाद की होनी चाहिए।'
          : 'Check-out date must be after check-in date.'
      );
      return;
    }
    setDateError(null);
    setCheckOut(val);
  };

  const handleWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      setDateError(
        lang === 'hi'
          ? 'चेक-आउट की तारीख चेक-इन के बाद की होनी चाहिए।'
          : 'Check-out date must be after check-in date.'
      );
      return;
    }
    setDateError(null);
    trackEvent('book_stay_click', {
      source: 'hero_booking_widget',
      roomId: selectedRoom.id,
      mealPlan,
      occupancy,
    });
    onQuickReserve({
      checkIn,
      checkOut,
      roomsCount,
      adults,
      children,
      roomId: selectedRoom.id,
      occupancy,
      includeExtraBed,
      mealPlan,
    });
  };

  // Asymmetric Bento Grid Highlights (Section 3D)
  const hotelHighlights = [
    {
      id: 'rooms-highlight',
      number: '01.',
      spanClass: 'lg:col-span-7',
      title: lang === 'hi' ? 'आरामदायक रूम्स और सुइट्स' : 'Comfortable Rooms & Suites',
      kicker: lang === 'hi' ? '७ रूम व सुइट श्रेणियां · ₹2,000 से प्रारंभ' : 'Seven Room & Suite Tiers · Starting at ₹2,000',
      description:
        lang === 'hi'
          ? 'स्टैंडर्ड एसी रूम से लेकर विशाल रॉयल सुइट तक, शांत वातावरण, आधुनिक सुविधाओं और EP, CP, MAP व AP मील प्लान विकल्पों के साथ।'
          : 'Thoughtfully appointed accommodations ranging from Standard A/C Rooms to our 680 sq. ft. Royal Suite, designed for visiting corporate executives and families.',
      image: HERO_CAROUSEL_SLIDES[2].image, // Royal Suite authentic photo
      href: '#rooms',
      cta: lang === 'hi' ? 'सभी ७ रूम श्रेणियां देखें' : 'Explore Rooms & Tariffs',
    },
    {
      id: 'sharda-highlight',
      number: '02.',
      spanClass: 'lg:col-span-5',
      title:
        lang === 'hi'
          ? 'शारदा मल्टी-कुज़ीन रेस्टोरेंट'
          : 'Sharda Multi-Cuisine Restaurant',
      kicker: lang === 'hi' ? '६ पाक शैलियां और यूरोपियन बेकरी' : 'Six Cuisines & Custom Bakery',
      description:
        lang === 'hi'
          ? 'भारतीय, मुगलई, चाइनीज़ और कॉन्टिनेंटल व्यंजनों के साथ ताज़ा यूरोपियन-स्टाइल बेकरी और कस्टम सेलिब्रेशन केक।'
          : 'Savor Indian, Mughlai, Chinese, and Continental dishes alongside freshly baked breads, pastries, and custom celebration cakes.',
      image: HERO_CAROUSEL_SLIDES[4].image, // Sharda Restaurant authentic photo
      href: '#dining-events',
      cta: lang === 'hi' ? 'मेनू और डाइनिंग देखें' : 'Explore Sharda Dining',
    },
    {
      id: 'bar-highlight',
      number: '03.',
      spanClass: 'lg:col-span-5',
      title: lang === 'hi' ? 'ब्लू डायमंड बार' : 'Blue Diamond Bar',
      kicker: lang === 'hi' ? 'औपनिवेशिक शैली लाउंज · 11 AM – 11 PM' : 'Colonial-Inspired Lounge · 11 AM – 11 PM',
      description:
        lang === 'hi'
          ? 'दिन भर की कार्य बैठकों के बाद शांत और गरिमापूर्ण माहौल में प्रीमियम पेय और मॉकटेल्स का आनंद लें।'
          : 'Unwind in a classic, wood-accented lounge setting offering curated spirits, beverages, and attentive evening hospitality in Waidhan.',
      image: HERO_CAROUSEL_SLIDES[5].image, // Blue Diamond Bar authentic photo
      href: '#dining-events',
      cta: lang === 'hi' ? 'लाउंज विवरण देखें' : 'Discover Blue Diamond Bar',
    },
    {
      id: 'events-highlight',
      number: '04.',
      spanClass: 'lg:col-span-7',
      title:
        lang === 'hi'
          ? 'वेडिंग्स, बैंक्वेट और समारोह'
          : 'Weddings, Banquets & Celebrations',
      kicker: lang === 'hi' ? 'विशाल ओपन-एयर लॉन और कॉन्फ्रेंस हॉल' : 'Open-Air Lawn, Grand Banquet & Boardrooms',
      description:
        lang === 'hi'
          ? 'भव्य विवाह समारोहों, रिसेप्शन, कॉर्पोरेट सेमिनार और पारिवारिक उत्सवों के लिए सुसज्जित ओपन-एयर लॉन और इनडोर बैंक्वेट हॉल।'
          : 'Host memorable weddings, receptions, corporate conferences, and executive meetings across our expansive lawn and indoor banquet venues.',
      image: HERO_CAROUSEL_SLIDES[6].image, // Banquet Hall authentic photo
      href: '#banquets',
      cta: lang === 'hi' ? 'वेन्यू और पैकेज देखें' : 'Plan Your Event or Wedding',
    },
  ];

  return (
    <div id="top" className="bg-[#F8F6F0]">
      {/* Top Hospitality Utility Bar (Forest Green #183D32 & Champagne Gold #C6A66B) */}
      {showAnnouncement && (
        <div className="bg-[#183D32] text-[#F8F6F0] border-b border-[#C6A66B]/30 px-4 sm:px-8 py-2.5 text-xs">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold tracking-wide text-[#C6A66B]">
                {lang === 'hi' ? 'स्वागत है · अतिथि देवो भव:' : 'Atithi Devo Bhava · Est. 2011'}
              </span>
              <span className="hidden sm:inline text-[#F8F6F0]/35" aria-hidden="true">·</span>
              <span className="text-[#F8F6F0]/90">
                {lang === 'hi'
                  ? 'बेलौंजी मेन रोड, वैढ़न · नि:शुल्क वाई-फाई और स्विमिंग पूल सुविधा'
                  : 'Main Road, Belaunji, Waidhan · Complimentary Wi-Fi & Resident Swimming Pool Access'}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-auto">
              <a
                href={`tel:${HOTEL_INFO.phones[0]}`}
                onClick={() => trackEvent('call_click', { source: 'top_utility_bar' })}
                className="hidden md:inline-flex items-center gap-1.5 price-tabular font-semibold text-[#C6A66B] hover:underline whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>24×7 Reception: {HOTEL_INFO.phones[0]}</span>
              </a>

              {/* Bilingual Switcher (EN | हिन्दी) */}
              <div
                className="inline-flex items-center rounded-md border border-[#C6A66B]/40 bg-[#122E25] p-0.5 text-[11px]"
                role="group"
                aria-label="Language Switcher"
              >
                <button
                  type="button"
                  onClick={() => onToggleLang('en')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'en'
                      ? 'bg-[#C6A66B] text-[#191D1B]'
                      : 'text-[#F8F6F0]/80 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onToggleLang('hi')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'hi'
                      ? 'bg-[#C6A66B] text-[#191D1B]'
                      : 'text-[#F8F6F0]/80 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                aria-label="Dismiss announcement strip"
                className="text-[#F8F6F0]/70 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CINEMATIC FULL-WIDTH HERO SECTION (Forest Green #183D32 & Champagne Gold #C6A66B)
          ===================================================================== */}
      <section
        className="relative bg-[#191D1B] text-[#F8F6F0] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-Bleed Architectural & Property Canvas */}
        <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-end">
          {/* Animated Background Photograph */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <SafeImage
                  src={currentSlide.image}
                  alt={`${currentSlide.title} — Hotel Satya International, Waidhan, Singrauli`}
                  priority={true}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Measured Multi-Stop Forest Green & Rich Charcoal Scrim for Guaranteed WCAG Contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(95deg, rgba(18, 46, 37, 0.94) 0%, rgba(24, 61, 50, 0.80) 46%, rgba(25, 29, 27, 0.42) 100%), linear-gradient(180deg, rgba(25, 29, 27, 0.30) 0%, rgba(25, 29, 27, 0.88) 100%)',
              }}
            />
          </div>

          {/* Foreground Editorial Content Container */}
          <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-14 pb-24 lg:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              {/* Left 8 Columns: Editorial Brand Positioning, Animated Typography & Dual CTAs */}
              <div className="lg:col-span-8 space-y-6">
                {/* Brand & Location Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2"
                >
                  <div className="inline-flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#C6A66B] font-semibold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {lang === 'hi'
                        ? 'होटल सत्या इंटरनेशनल · वैढ़न, सिंगरौली, मध्य प्रदेश'
                        : 'HOTEL SATYA INTERNATIONAL · WAIDHAN, SINGRAULI'}
                    </span>
                  </div>
                  <div className="h-[1px] w-20 bg-[#C6A66B]/60" />
                </motion.div>

                {/* Animated Hero Display Headline */}
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={lang}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-white font-medium tracking-tight leading-[1.05] text-balance max-w-3xl"
                    style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.35rem)' }}
                  >
                    {lang === 'hi'
                      ? 'जहाँ आराम और उत्कृष्ट आतिथ्य का संगम होता है'
                      : 'Where Comfort Meets Exceptional Hospitality'}
                  </motion.h1>
                </AnimatePresence>

                {/* Supporting Copy */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg text-[#F8F6F0]/90 max-w-2xl leading-relaxed font-normal"
                >
                  {lang === 'hi'
                    ? 'वैढ़न, सिंगरौली के हृदय में एक स्वागतपूर्ण प्रवास, यादगार डाइनिंग और भव्य समारोहों का अनुभव करें।'
                    : 'Discover a welcoming stay, memorable dining and elegant celebrations in the heart of Waidhan, Singrauli.'}
                </motion.p>

                {/* Primary & Secondary Action Hierarchy */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  {/* Primary CTA: Explore Rooms (Champagne Gold #C6A66B) */}
                  <a
                    href="#rooms"
                    onClick={() => trackEvent('book_stay_click', { source: 'hero_explore_rooms' })}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-lg bg-[#C6A66B] hover:bg-[#d4b67c] text-[#191D1B] text-xs uppercase tracking-[0.16em] font-bold transition-colors whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <span>{lang === 'hi' ? 'रूम्स और सुइट्स देखें' : 'Explore Rooms'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  {/* Secondary CTA: Book Your Stay (Forest Green #183D32) */}
                  <a
                    href="#booking-widget"
                    onClick={() => trackEvent('book_stay_click', { source: 'hero_book_stay' })}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-[#F8F6F0] border border-[#C6A66B]/50 text-xs uppercase tracking-[0.16em] font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <Calendar className="w-4 h-4 text-[#C6A66B]" aria-hidden="true" />
                    <span>{lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}</span>
                  </a>
                </motion.div>

                {/* Unboxed Editorial Trust Line (Zero-Pill Discipline) */}
                <div className="pt-5 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#F8F6F0]/80">
                  <span className="text-[#C6A66B] font-semibold">Main Road, Belaunji, Waidhan</span>
                  <span aria-hidden="true">·</span>
                  <span className="price-tabular">4 km from NTPC Vindhyanagar</span>
                  <span aria-hidden="true">·</span>
                  <span>7 Room & Suite Tiers</span>
                  <span aria-hidden="true">·</span>
                  <span>Sharda Restaurant & Blue Diamond Bar</span>
                </div>
              </div>

              {/* Right 4 Columns: Interactive Property Perspective Switcher with Animated Caption */}
              <div className="lg:col-span-4 flex flex-col justify-end">
                <div className="bg-[#191D1B]/85 backdrop-blur-md border border-[#C6A66B]/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="price-tabular text-xs uppercase tracking-[0.18em] text-[#C6A66B] font-semibold">
                      0{slideIdx + 1} / 0{HERO_CAROUSEL_SLIDES.length} · {currentSlide.badge}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSlideIdx(
                            (prev) =>
                              (prev - 1 + HERO_CAROUSEL_SLIDES.length) %
                              HERO_CAROUSEL_SLIDES.length
                          )
                        }
                        aria-label="Previous property view"
                        className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSlideIdx((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length)
                        }
                        aria-label="Next property view"
                        className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-white hover:border-[#C6A66B] hover:text-[#C6A66B] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Animated Slide Title & Caption */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="min-h-[68px]"
                    >
                      <p className="font-display text-xl font-medium text-white leading-snug">
                        {currentSlide.title}
                      </p>
                      <p className="text-xs text-[#F8F6F0]/75 mt-1 leading-relaxed">
                        {currentSlide.caption}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Interactive Thumbnail Strip for All 7 Authentic Property Views */}
                  <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-white/10">
                    {HERO_CAROUSEL_SLIDES.map((s, idx) => {
                      const active = idx === slideIdx;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSlideIdx(idx)}
                          title={s.badge}
                          aria-label={`Preview ${s.badge}`}
                          className={`relative aspect-square rounded-md overflow-hidden border transition-all cursor-pointer ${
                            active
                              ? 'border-[#C6A66B] ring-1 ring-[#C6A66B] opacity-100'
                              : 'border-white/15 opacity-55 hover:opacity-90'
                          }`}
                        >
                          <SafeImage
                            src={s.image}
                            alt={s.badge}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            INTEGRATED BOOKING SEARCH INTERFACE (#booking-widget)
            =================================================================== */}
        <div
          id="booking-widget"
          className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-8 -mt-12 pb-14 scroll-mt-24"
        >
          <div className="bg-white text-[#191D1B] rounded-xl border border-[#E9E2D5] shadow-xl overflow-hidden">
            {/* Forest Green & Champagne Gold Header Strip */}
            <div className="bg-[#183D32] text-[#F8F6F0] px-5 sm:px-7 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#C6A66B]/30">
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#C6A66B] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-medium text-white">
                  {t.sections.bookingTitle}
                </h2>
              </div>
              <p className="text-xs text-[#F8F6F0]/80 price-tabular">
                {lang === 'hi'
                  ? 'चेक-इन 2:00 PM · चेक-आउट 12:00 PM · रिसेप्शन द्वारा उपलब्धता की पुष्टि'
                  : 'Check-In 2:00 PM · Check-Out 12:00 PM · Synchronized with Room Tariffs Below'}
              </p>
            </div>

            <form onSubmit={handleWidgetSubmit} className="p-5 sm:p-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Check-in Date */}
                <div>
                  <label
                    htmlFor="widget-checkin"
                    className="block text-xs font-semibold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'चेक-इन तारीख' : 'Check-In Date'}
                  </label>
                  <input
                    id="widget-checkin"
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium focus:outline-none focus:border-[#183D32]"
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label
                    htmlFor="widget-checkout"
                    className="block text-xs font-semibold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'चेक-आउट तारीख' : 'Check-Out Date'}
                  </label>
                  <input
                    id="widget-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium focus:outline-none focus:border-[#183D32]"
                    required
                  />
                </div>

                {/* Room Category */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="widget-room-category"
                    className="block text-xs font-semibold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'रूम / सुइट श्रेणी' : 'Room Category'}
                  </label>
                  <select
                    id="widget-room-category"
                    value={selectedRoomId}
                    onChange={(e) => onSelectRoomId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-semibold focus:outline-none focus:border-[#183D32]"
                  >
                    {ROOM_CATEGORIES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} — Single ₹{r.rates.single[mealPlan].toLocaleString('en-IN')} / Double ₹{r.rates.double[mealPlan].toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occupancy & Rooms */}
                <div>
                  <label
                    htmlFor="widget-occupancy"
                    className="block text-xs font-semibold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'ऑक्यूपेंसी और रूम' : 'Occupancy & Rooms'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      id="widget-occupancy"
                      value={occupancy}
                      onChange={(e) => onChangeOccupancy(e.target.value as OccupancyType)}
                      aria-label="Occupancy type"
                      className="w-full px-2.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium"
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                    </select>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      aria-label="Number of rooms"
                      className="w-full px-2.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Rm' : 'Rms'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Meal Plan */}
                <div>
                  <label
                    htmlFor="widget-mealplan"
                    className="block text-xs font-semibold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'मील प्लान' : 'Meal Plan'}
                  </label>
                  <select
                    id="widget-mealplan"
                    value={mealPlan}
                    onChange={(e) => onChangeMealPlan(e.target.value as MealPlanCode)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-semibold focus:outline-none focus:border-[#183D32]"
                  >
                    {MEAL_PLANS.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.shortLabel} (+₹{m.surchargePerNight})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {dateError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {dateError}
                </p>
              )}

              {/* Bottom Bar: Guests + Live Tariff Estimate + Submit Action */}
              <div className="pt-4 border-t border-[#E9E2D5] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-xs text-[#525854]">
                  <div className="inline-flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#183D32]" aria-hidden="true" />
                    <label htmlFor="widget-adults" className="font-semibold text-[#191D1B]">
                      Adults:
                    </label>
                    <select
                      id="widget-adults"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-md border border-[#E9E2D5] bg-[#F8F6F0] text-[#191D1B] font-semibold"
                    >
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <label htmlFor="widget-children" className="font-semibold text-[#191D1B]">
                      Children:
                    </label>
                    <select
                      id="widget-children"
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-md border border-[#E9E2D5] bg-[#F8F6F0] text-[#191D1B] font-semibold"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-[#191D1B]">
                    <input
                      type="checkbox"
                      checked={includeExtraBed}
                      onChange={(e) => setIncludeExtraBed(e.target.checked)}
                      className="accent-[#183D32] w-3.5 h-3.5 rounded"
                    />
                    <span>
                      Extra Mattress (+₹{BOOKING_CONFIG.extraBedChargePerNight}/night)
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span className="text-xs text-[#525854]">Estimated Stay Total:</span>
                      <span className="price-tabular text-2xl font-bold text-[#191D1B]">
                        ₹{estimatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#525854] price-tabular">
                      {nights} {nights === 1 ? 'Night' : 'Nights'} · {roomsCount}{' '}
                      {roomsCount === 1 ? 'Room' : 'Rooms'} · Incl. {gstRate}% GST (₹
                      {gstAmount.toLocaleString('en-IN')})
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-white text-xs uppercase tracking-[0.15em] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {lang === 'hi' ? 'बुकिंग अनुरोध भेजें' : 'Proceed to Booking Request'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ASYMMETRIC EDITORIAL BENTO GRID — FOUR HOTEL HIGHLIGHTS
          ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#183D32] font-semibold">
                {lang === 'hi'
                  ? 'होटल सत्या इंटरनेशनल की प्रमुख विशेषताएं'
                  : 'Curated Hospitality Experiences'}
              </p>
              <h2
                className="font-display text-[#191D1B] font-medium leading-[1.12] text-balance"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 3.1rem)' }}
              >
                {lang === 'hi'
                  ? 'प्रवास, भोजन और उत्सव का संपूर्ण संगम'
                  : 'Refined Stays, Multi-Cuisine Dining & Grand Celebrations'}
              </h2>
            </div>
            <p className="text-sm text-[#525854] max-w-md leading-relaxed">
              {lang === 'hi'
                ? 'बेलौंजी मेन रोड, वैढ़न पर स्थित हमारा परिसर सिंगरौली के औद्योगिक और पारिवारिक मेहमानों के लिए सभी आधुनिक सुविधाएं प्रदान करता है।'
                : 'Situated on Belaunji Main Road in Waidhan, our property brings together seven room categories, Sharda Restaurant & Bakery, Blue Diamond Bar, and expansive celebration venues.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {hotelHighlights.map((item) => (
              <article
                key={item.id}
                className={`${item.spanClass} group bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-300`}
              >
                <div>
                  <div className="aspect-[16/9] w-full bg-[#EFECE4] overflow-hidden relative">
                    <SafeImage
                      src={item.image}
                      alt={`${item.title} — Hotel Satya International, Waidhan`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-2.5">
                    <p className="text-xs text-[#8C6B32] font-semibold">
                      <span className="price-tabular mr-1.5">{item.number}</span>
                      <span>{item.kicker}</span>
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] leading-snug text-balance">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#525854] leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-[#E9E2D5]/70 flex items-center justify-between">
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-bold text-[#183D32] group-hover:text-[#8C6B32] transition-colors whitespace-nowrap"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
