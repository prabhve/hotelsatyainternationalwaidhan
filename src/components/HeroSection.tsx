import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BedDouble,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react';
import {
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
  selectedRoomId,
  onSelectRoomId,
  occupancy,
  onChangeOccupancy,
  mealPlan,
  onChangeMealPlan,
  onQuickReserve,
}: HeroSectionProps) {
  const t = UI_TRANSLATIONS[lang];

  // Top announcement bar state
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Hero visual slide state
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
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_CAROUSEL_SLIDES[slideIdx] || HERO_CAROUSEL_SLIDES[0];
  const selectedRoom =
    ROOM_CATEGORIES.find((r) => r.id === selectedRoomId) || ROOM_CATEGORIES[0];

  const nights = calcNights(checkIn, checkOut);
  const perNightRate =
    occupancy === 'Single'
      ? selectedRoom.rates.single
      : selectedRoom.rates.double;
  const baseRoomTotal = perNightRate * nights * roomsCount;

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

  // Four Hotel Highlights with authentic property photography
  const hotelHighlights = [
    {
      id: 'rooms-highlight',
      number: '01',
      title: lang === 'hi' ? 'आरामदायक रूम्स और सुइट्स' : 'Comfortable Rooms & Suites',
      subtitle: lang === 'hi' ? '७ रूम व सुइट श्रेणियां' : 'Seven Room & Suite Categories',
      description:
        lang === 'hi'
          ? 'स्टैंडर्ड एसी रूम (₹2,000) से लेकर विशाल रॉयल सुइट (₹9,000) तक, शांत वातावरण, आधुनिक सुविधाओं और EP/CP/MAP/AP मील प्लान के साथ।'
          : 'Seven verified room and suite tiers from Standard A/C Rooms (₹2,000) to our flagship Royal Suite (₹9,000), tailored for corporate and family stays.',
      image: HERO_CAROUSEL_SLIDES[2].image,
      href: '#rooms',
      cta: lang === 'hi' ? 'सभी रूम देखें' : 'Explore Rooms',
      icon: BedDouble,
    },
    {
      id: 'sharda-highlight',
      number: '02',
      title:
        lang === 'hi'
          ? 'शारदा मल्टी-कुज़ीन रेस्टोरेंट'
          : 'Sharda Multi-Cuisine Restaurant',
      subtitle: lang === 'hi' ? 'रेस्टोरेंट और यूरोपियन बेकरी' : '6 Cuisines & Custom Bakery',
      description:
        lang === 'hi'
          ? 'भारतीय, मुगलई, चाइनीज़, कॉन्टिनेंटल, इटालियन और ओरिएंटल व्यंजनों के साथ १००% ओरिजिनल यूरोपियन-टेक्नोलॉजी बेकरी।'
          : 'Savor Indian, Mughlai, Chinese, Continental, Italian, and Oriental delicacies alongside our 100% original European-technology custom bakery.',
      image: HERO_CAROUSEL_SLIDES[4].image,
      href: '#dining-events',
      cta: lang === 'hi' ? 'डाइनिंग देखें' : 'Discover Dining',
      icon: UtensilsCrossed,
    },
    {
      id: 'bar-highlight',
      number: '03',
      title: lang === 'hi' ? 'ब्लू डायमंड बार' : 'Blue Diamond Bar',
      subtitle: lang === 'hi' ? 'औपनिवेशिक शैली लाउंज' : 'Colonial-Style Executive Lounge',
      description:
        lang === 'hi'
          ? 'सुबह 11:00 बजे से रात 11:00 बजे तक आयातित पेय, कॉकटेल्स और मॉकटेल्स का शांत और गरिमापूर्ण माहौल में आनंद लें।'
          : 'Unwind in our colonial-style lounge serving imported spirits, signature cocktails with complimentary snacks, and mocktails from 11:00 AM to 11:00 PM.',
      image: HERO_CAROUSEL_SLIDES[5].image,
      href: '#dining-events',
      cta: lang === 'hi' ? 'लाउंज देखें' : 'View Lounge Details',
      icon: Wine,
    },
    {
      id: 'events-highlight',
      number: '04',
      title:
        lang === 'hi'
          ? 'वेडिंग्स, बैंक्वेट और समारोह'
          : 'Weddings, Banquets & Celebrations',
      subtitle: lang === 'hi' ? '३,००० मेहमानों का लॉन और हॉल' : '3,000-Guest Lawn & Banquet Hall',
      description:
        lang === 'hi'
          ? '३,००० मेहमानों के ओपन-एयर लॉन, २०० मेहमानों के बैंक्वेट हॉल, पार्टी रूम (४०) और मीटिंग रूम (२०) की सुविधा।'
          : 'Host grand weddings on our 3,000-guest Open-Air Lawn, conferences in our 200-guest Banquet Hall, or meetings in our Party (40) and Meeting Rooms (20).',
      image: HERO_CAROUSEL_SLIDES[6].image,
      href: '#banquets',
      cta: lang === 'hi' ? 'वेन्यू देखें' : 'Plan an Event',
      icon: Sparkles,
    },
  ];

  return (
    <div id="top" className="bg-[#F8F6F0]">
      {/* Subtle Top Hospitality Strip (Dismissible) */}
      {showAnnouncement && (
        <div className="bg-[#183D32] text-[#F8F6F0] border-b border-[#C6A66B]/25 px-4 py-2 text-xs">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold text-[#C6A66B]">
                {lang === 'hi' ? 'अतिथि देवो भव:' : 'Atithi Devo Bhava'}
              </span>
              <span className="hidden sm:inline text-[#F8F6F0]/40">·</span>
              <span className="text-[#F8F6F0]/90">{t.announcement}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a
                href={`tel:${HOTEL_INFO.phones[0]}`}
                onClick={() => trackEvent('call_click', { source: 'announcement_bar' })}
                className="hidden md:inline-flex items-center gap-1.5 price-tabular font-semibold text-[#C6A66B] hover:underline"
              >
                <Phone className="w-3 h-3" />
                <span>{HOTEL_INFO.phones[0]}</span>
              </a>
              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                aria-label="Dismiss announcement"
                className="text-[#F8F6F0]/70 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CINEMATIC HERO SECTION
          ===================================================================== */}
      <section className="relative bg-[#191D1B] text-[#F8F6F0] overflow-hidden">
        <div
          className="relative min-h-[600px] lg:min-h-[680px] flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={currentSlide.image}
              alt={`${currentSlide.title} — Hotel Satya International, Waidhan, Singrauli`}
              priority={true}
              className="w-full h-full object-cover object-center transition-all duration-700 scale-[1.01]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(25,29,27,0.92) 0%, rgba(25,29,27,0.78) 52%, rgba(25,29,27,0.45) 100%), linear-gradient(180deg, rgba(25,29,27,0.35) 0%, rgba(25,29,27,0.85) 100%)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              {/* Left 8 Columns: Editorial Typography & Primary CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="lg:col-span-8 space-y-6"
              >
                <div className="inline-flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#C6A66B] font-semibold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'hi'
                      ? 'होटल सत्या इंटरनेशनल · बेलौंजी मेन रोड, वैढ़न, सिंगरौली (म.प्र.)'
                      : 'HOTEL SATYA INTERNATIONAL · Main Road, Belaunji, Waidhan, Singrauli'}
                  </span>
                </div>

                <h1
                  className="font-display text-white font-medium tracking-tight leading-[1.06] text-balance"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                >
                  {lang === 'hi'
                    ? 'जहाँ आराम और उत्कृष्ट आतिथ्य का संगम होता है'
                    : 'Where Comfort Meets Exceptional Hospitality'}
                </h1>

                <p className="text-base sm:text-lg text-[#F8F6F0]/90 max-w-2xl leading-relaxed font-normal">
                  {lang === 'hi'
                    ? 'वैढ़न, सिंगरौली के हृदय में एक स्वागतपूर्ण प्रवास, यादगार डाइनिंग और भव्य समारोहों का अनुभव करें — ७ सुइट और रूम श्रेणियों, शारदा रेस्टोरेंट, ब्लू डायमंड बार और स्विमिंग पूल के साथ।'
                    : 'Discover a welcoming stay, memorable dining, and elegant celebrations in Singrauli’s first classified 3-star luxury hotel, established in 2011 on Waidhan Main Road.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#rooms"
                    onClick={() => trackEvent('book_stay_click', { source: 'hero_explore_rooms' })}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-lg bg-[#C6A66B] hover:bg-[#b59457] text-[#191D1B] text-xs uppercase tracking-[0.16em] font-bold transition-colors shadow-sm"
                  >
                    <span>{lang === 'hi' ? 'रूम्स और सुइट्स देखें' : 'Explore Rooms'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#booking-widget"
                    onClick={() => trackEvent('book_stay_click', { source: 'hero_book_stay' })}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-white border border-[#C6A66B]/40 text-xs uppercase tracking-[0.16em] font-semibold transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#C6A66B]" />
                    <span>{lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}</span>
                  </a>

                  <a
                    href={`tel:${HOTEL_INFO.phones[0]}`}
                    onClick={() => trackEvent('call_click', { source: 'hero_phone' })}
                    className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-semibold text-[#F8F6F0]/90 hover:text-[#C6A66B] transition-colors price-tabular"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>24×7 Desk: {HOTEL_INFO.phones[0]}</span>
                  </a>
                </div>

                {/* Key Factual Highlights Row */}
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#F8F6F0]/80">
                  <span>Est. 2011 · First Classified 3-Star Hotel in Singrauli</span>
                  <span aria-hidden="true" className="text-[#C6A66B]">·</span>
                  <span>7 Room & Suite Categories (₹2,000 – ₹9,000)</span>
                  <span aria-hidden="true" className="text-[#C6A66B]">·</span>
                  <span>Sharda Restaurant, Custom Bakery & Blue Diamond Bar</span>
                </div>
              </motion.div>

              {/* Right 4 Columns: Authentic Property Photo Caption & Slide Switcher */}
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end">
                <div className="w-full max-w-sm bg-[#191D1B]/85 backdrop-blur-md border border-white/15 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#C6A66B] font-semibold">
                      Authentic Property View · {slideIdx + 1}/{HERO_CAROUSEL_SLIDES.length}
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
                        aria-label="Previous property photograph"
                        className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSlideIdx((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length)
                        }
                        aria-label="Next property photograph"
                        className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-display text-lg font-medium text-white leading-snug">
                      {currentSlide.badge} — {currentSlide.title}
                    </p>
                    <p className="text-xs text-[#F8F6F0]/75 mt-1 leading-relaxed">
                      {currentSlide.caption}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    {HERO_CAROUSEL_SLIDES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlideIdx(idx)}
                        aria-label={`View ${s.badge} photograph`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === slideIdx
                            ? 'w-6 bg-[#C6A66B]'
                            : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
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
          className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12 scroll-mt-24"
        >
          <div className="bg-white text-[#191D1B] rounded-xl border border-[#E9E2D5] shadow-xl p-5 sm:p-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E9E2D5]">
              <div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#183D32] font-bold block">
                  {lang === 'hi'
                    ? 'डायरेक्ट बुकिंग अनुरोध और प्रकाशित रूम टैरिफ'
                    : 'Direct Stay Enquiry & Published Room Tariffs'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B]">
                  {t.sections.bookingTitle}
                </h2>
              </div>
              <p className="text-xs text-[#525854]">
                {lang === 'hi'
                  ? 'चयनित रूम और मील प्लान नीचे सभी सेक्शन में स्वतः सिंक होते हैं · चेक-इन 2:00 PM / चेक-आउट 12:00 PM'
                  : 'Selections synchronize with our room tariff table below · Check-in 2:00 PM / Check-out 12:00 PM'}
              </p>
            </div>

            <form onSubmit={handleWidgetSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
                {/* Check-in Date */}
                <div>
                  <label
                    htmlFor="widget-checkin"
                    className="block text-[11px] uppercase tracking-[0.12em] font-bold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'चेक-इन तारीख' : 'Check-In Date'}
                  </label>
                  <input
                    id="widget-checkin"
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium focus:outline-none focus:border-[#183D32]"
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label
                    htmlFor="widget-checkout"
                    className="block text-[11px] uppercase tracking-[0.12em] font-bold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'चेक-आउट तारीख' : 'Check-Out Date'}
                  </label>
                  <input
                    id="widget-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-medium focus:outline-none focus:border-[#183D32]"
                    required
                  />
                </div>

                {/* Room Category */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="widget-room-category"
                    className="block text-[11px] uppercase tracking-[0.12em] font-bold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'रूम / सुइट श्रेणी' : 'Room Category'}
                  </label>
                  <select
                    id="widget-room-category"
                    value={selectedRoomId}
                    onChange={(e) => onSelectRoomId(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-semibold focus:outline-none focus:border-[#183D32]"
                  >
                    {ROOM_CATEGORIES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} — Single ₹{r.rates.single.toLocaleString('en-IN')} / Double ₹{r.rates.double.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occupancy & Rooms */}
                <div>
                  <label
                    htmlFor="widget-occupancy"
                    className="block text-[11px] uppercase tracking-[0.12em] font-bold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'ऑक्यूपेंसी और रूम' : 'Occupancy & Rooms'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
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

                {/* Meal Plan Preference */}
                <div>
                  <label
                    htmlFor="widget-mealplan"
                    className="block text-[11px] uppercase tracking-[0.12em] font-bold text-[#525854] mb-1.5"
                  >
                    {lang === 'hi' ? 'मील प्लान' : 'Meal Plan'}
                  </label>
                  <select
                    id="widget-mealplan"
                    value={mealPlan}
                    onChange={(e) => onChangeMealPlan(e.target.value as MealPlanCode)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B] font-semibold focus:outline-none focus:border-[#183D32]"
                  >
                    {MEAL_PLANS.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.shortLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {dateError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {dateError}
                </p>
              )}

              {/* Bottom Bar: Guests + Published Room Tariff + Request Booking Button */}
              <div className="pt-3 border-t border-[#E9E2D5] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#525854]">
                  <div className="inline-flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#183D32]" />
                    <label htmlFor="widget-adults" className="font-semibold text-[#191D1B]">
                      Adults:
                    </label>
                    <select
                      id="widget-adults"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="px-2 py-1 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-[#191D1B] font-semibold"
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
                      className="px-2 py-1 rounded border border-[#E9E2D5] bg-[#F8F6F0] text-[#191D1B] font-semibold"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-[#191D1B]">
                    <input
                      type="checkbox"
                      checked={includeExtraBed}
                      onChange={(e) => setIncludeExtraBed(e.target.checked)}
                      className="accent-[#183D32] w-3.5 h-3.5 rounded"
                    />
                    <span>Request Extra Bed / Mattress</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline sm:justify-end gap-1.5">
                      <span className="text-xs text-[#525854]">Published Room Tariff:</span>
                      <span className="price-tabular text-xl sm:text-2xl font-bold text-[#191D1B]">
                        ₹{baseRoomTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#525854] price-tabular">
                      {nights} {nights === 1 ? 'Night' : 'Nights'} × {roomsCount}{' '}
                      {roomsCount === 1 ? 'Room' : 'Rooms'} ({occupancy} · ₹
                      {perNightRate.toLocaleString('en-IN')}/night + applicable taxes · {mealPlan} Plan)
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-white text-xs uppercase tracking-[0.15em] font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
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
          FOUR CURATED HOTEL HIGHLIGHTS
          ===================================================================== */}
      <section className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#183D32] font-semibold mb-2">
                {lang === 'hi'
                  ? 'होटल सत्या इंटरनेशनल की प्रमुख विशेषताएं'
                  : 'Signature Hospitality Pillars'}
              </p>
              <h2
                className="font-display text-[#191D1B] font-medium leading-[1.12]"
                style={{ fontSize: 'clamp(2rem, 3.3vw, 3rem)' }}
              >
                {lang === 'hi'
                  ? 'प्रवास, भोजन और उत्सव का संपूर्ण संगम'
                  : 'Designed for Business Stays, Fine Dining & Grand Celebrations'}
              </h2>
            </div>
            <p className="text-sm text-[#525854] max-w-md leading-relaxed">
              {lang === 'hi'
                ? 'बेलौंजी मेन रोड, वैढ़न पर स्थित हमारा परिसर सिंगरौली के औद्योगिक और पारिवारिक मेहमानों के लिए सभी आधुनिक सुविधाएं प्रदान करता है।'
                : 'Located on Belaunji Main Road in Waidhan, our property brings together comfortable suites, multi-cuisine dining, a colonial lounge bar, and expansive celebration venues.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelHighlights.map((item) => {
              const IconComp = item.icon;
              return (
                <article
                  key={item.id}
                  className="group bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="aspect-[16/10] w-full bg-[#EFECE4] overflow-hidden relative">
                      <SafeImage
                        src={item.image}
                        alt={`${item.title} — Hotel Satya International, Waidhan`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[#191D1B]/80 backdrop-blur-xs text-[#C6A66B] flex items-center justify-center">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#8C6B32] font-semibold">
                        <span className="price-tabular">{item.number}.</span>
                        <span>{item.subtitle}</span>
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-[#191D1B] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#525854] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#E9E2D5]/70">
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-bold text-[#183D32] group-hover:text-[#8C6B32] transition-colors"
                    >
                      <span>{item.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
