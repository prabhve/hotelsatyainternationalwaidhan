import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Globe,
  Phone,
  Sparkles,
  Users,
  UtensilsCrossed,
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

const SECTION_2_HIGHLIGHT_CARDS = [
  {
    icon: BedDouble,
    index: '01.',
    title: 'Seven Suite & Room Tiers',
    titleHi: 'सात सुइट और रूम श्रेणियां',
    detail: 'Standard A/C (₹2,000) to Royal Suite (₹9,000)',
    detailHi: 'स्टैंडर्ड एसी (₹2,000) से रॉयल सुइट (₹9,000) तक',
    href: '#rooms',
  },
  {
    icon: UtensilsCrossed,
    index: '02.',
    title: 'Sharda & Blue Diamond Bar',
    titleHi: 'शारदा रेस्टोरेंट व ब्लू डायमंड बार',
    detail: '6 cuisines, custom bakery & colonial lounge',
    detailHi: '६ व्यंजन, यूरोपियन बेकरी और कोलोनियल बार',
    href: '#dining-events',
  },
  {
    icon: Sparkles,
    index: '03.',
    title: '3,000-Pax Lawn & Banquets',
    titleHi: '३,००० मेहमानों का वेडिंग लॉन व हॉल',
    detail: 'Grand weddings, corporate seminars & galas',
    detailHi: 'भव्य विवाह, रिसेप्शन और कॉर्पोरेट सेमिनार',
    href: '#banquets',
  },
  {
    icon: Building2,
    index: '04.',
    title: 'Singrauli Power Corridor',
    titleHi: 'सिंगरौली पावर कॉरिडोर के समीप',
    detail: '4 km to NTPC VSTPP · 18 km to Reliance Sasan',
    detailHi: 'NTPC विंध्यनगर ४ किमी · रिलायंस सासन १८ किमी',
    href: '#location',
  },
];

function getDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  return {
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfter.toISOString().split('T')[0],
  };
}

function calcStayNights(checkIn: string, checkOut: string): number {
  const s = new Date(checkIn);
  const e = new Date(checkOut);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
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
  const defaults = getDefaultDates();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [roomsCount, setRoomsCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [includeExtraBed, setIncludeExtraBed] = useState(false);

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const t = UI_TRANSLATIONS[lang];

  // Auto-advance 7-slide carousel unless hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  // Ensure check-out is always >= 1 night after check-in
  const handleCheckInChange = (nextCheckIn: string) => {
    setCheckIn(nextCheckIn);
    if (checkOut <= nextCheckIn) {
      const d = new Date(nextCheckIn);
      d.setDate(d.getDate() + 1);
      setCheckOut(d.toISOString().split('T')[0]);
    }
  };

  const activeSlide = HERO_CAROUSEL_SLIDES[activeSlideIdx];
  const selectedRoomObj =
    ROOM_CATEGORIES.find((r) => r.id === selectedRoomId) || ROOM_CATEGORIES[0];
  const selectedPlanObj =
    MEAL_PLANS.find((m) => m.code === mealPlan) || MEAL_PLANS[0];

  const nights = calcStayNights(checkIn, checkOut);
  const baseNightlyEp =
    occupancy === 'Single' ? selectedRoomObj.singleInr : selectedRoomObj.doubleInr;
  const planAddonNightly = selectedPlanObj.surchargePerNight;
  const extraBedNightly = includeExtraBed ? BOOKING_CONFIG.extraBedChargePerNight : 0;

  const roomBaseSubtotal = baseNightlyEp * nights * roomsCount;
  const mealPlanSubtotal = planAddonNightly * nights * roomsCount;
  const extraBedSubtotal = extraBedNightly * nights * roomsCount;
  const preTaxTotal = roomBaseSubtotal + mealPlanSubtotal + extraBedSubtotal;

  const gstRatePercent =
    baseNightlyEp + planAddonNightly > BOOKING_CONFIG.gstThresholdInr
      ? BOOKING_CONFIG.gstLuxuryPercent
      : BOOKING_CONFIG.gstStandardPercent;
  const gstAmount = Math.round((preTaxTotal * gstRatePercent) / 100);
  const grandTotal = preTaxTotal + gstAmount;
  const otaEstimatedSaving = Math.round(preTaxTotal * (BOOKING_CONFIG.otaSavingsPercent / 100));

  return (
    <div id="top">
      {/* Global Element #3: Dismissible Top Announcement Strip + Language Switcher */}
      {showAnnouncement && (
        <div className="bg-[#1A1A1A] text-[#FAF8F4] px-4 py-2 text-xs border-b border-[#333333]">
          <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium tracking-wide">
              <span className="text-[#D9A74A] font-semibold mr-2">स्वागत है</span>
              {t.announcement}
            </p>
            <div className="flex items-center gap-3 ml-auto">
              {/* Bilingual EN / हिन्दी Toggle */}
              <div
                className="inline-flex items-center bg-[#2B2B2B] rounded-lg p-0.5 border border-white/15"
                role="group"
                aria-label="Language selector"
              >
                <Globe className="w-3.5 h-3.5 text-[#D9A74A] ml-2 mr-1" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => onToggleLang('en')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                    lang === 'en' ? 'bg-[#B8862B] text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onToggleLang('hi')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                    lang === 'hi' ? 'bg-[#B8862B] text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                aria-label="Dismiss announcement"
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1 — HERO */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 border-b border-[#E5DFD3] editorial-grid-bg">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Eyebrow, Headline, Sub-copy & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 flex flex-col justify-between py-1"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-[#8A5A12] tracking-wide">
                    {t.heroEyebrow}
                  </p>
                  {!showAnnouncement && (
                    <button
                      type="button"
                      onClick={() => onToggleLang(lang === 'en' ? 'hi' : 'en')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5A12] border border-[#D8CFC0] rounded-lg px-2.5 py-1 bg-white"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}
                    </button>
                  )}
                </div>

                <h1
                  className="font-display font-semibold text-[#1A1A1A] leading-[1.05] tracking-tight text-balance mb-5"
                  style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.9rem)' }}
                >
                  {t.heroHeadline}
                </h1>

                <p className="text-base sm:text-lg text-[#454545] leading-relaxed max-w-[56ch] mb-7">
                  {t.heroSubcopy}
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href="#booking-widget"
                    onClick={() => trackEvent('book_stay_click', { source: 'hero_primary' })}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2E2E2E] shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8A5A12]"
                  >
                    {t.reserveDirect}
                    <ArrowRight className="w-4 h-4 text-[#D9A74A]" aria-hidden="true" />
                  </a>

                  <a
                    href="#rooms"
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-white border border-[#D8CFC0] rounded-xl hover:border-[#8A5A12] transition-colors whitespace-nowrap shrink-0"
                  >
                    {t.compareRooms}
                  </a>

                  <a
                    href={`tel:${HOTEL_INFO.phones[0]}`}
                    onClick={() => trackEvent('call_click', { source: 'hero' })}
                    className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#8A5A12] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#8A5A12]" aria-hidden="true" />
                    <span className="price-tabular">{HOTEL_INFO.phones[0]}</span>
                  </a>
                </div>
              </div>

              {/* Trust Strip Below Hero Copy */}
              <div className="mt-8 pt-6 border-t border-[#E5DFD3]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs text-[#454545]">
                  <div>
                    <p className="font-bold text-[#1A1A1A] price-tabular">
                      {BOOKING_CONFIG.googleRatingPlaceholder}
                    </p>
                    <p className="text-[#666666]">Verified Singrauli Benchmark</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A1A]">Est. 2011 · 3-Star Classified</p>
                    <p className="text-[#666666]">Singrauli’s First 3-Star Hotel</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="font-bold text-[#1A1A1A]">Free Wi-Fi · 24h Room Service</p>
                    <p className="text-[#666666]">Swimming Pool & Health Club</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 7-Slide Auto-Playing Carousel with Arrows, Dots, Swipe & Matched Captions */}
            <div
              className="lg:col-span-6 flex flex-col"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX === null) return;
                const delta = e.changedTouches[0].clientX - touchStartX;
                if (delta > 40) {
                  setActiveSlideIdx(
                    (prev) =>
                      (prev - 1 + HERO_CAROUSEL_SLIDES.length) %
                      HERO_CAROUSEL_SLIDES.length
                  );
                } else if (delta < -40) {
                  setActiveSlideIdx(
                    (prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length
                  );
                }
                setTouchStartX(null);
              }}
            >
              <div className="relative flex-1 min-h-[340px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[#E5DFD3] bg-[#EDE8DF] shadow-sm flex flex-col justify-between">
                <SafeImage
                  src={activeSlide.image}
                  alt={`${activeSlide.badge} — ${activeSlide.title}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Top Controls: Slide Counter + Prev/Next Arrows */}
                <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-black/65 via-black/25 to-transparent">
                  <span className="text-xs font-semibold text-white tracking-wide price-tabular">
                    0{activeSlideIdx + 1} / 0{HERO_CAROUSEL_SLIDES.length} · {activeSlide.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIdx(
                          (prev) =>
                            (prev - 1 + HERO_CAROUSEL_SLIDES.length) %
                            HERO_CAROUSEL_SLIDES.length
                        )
                      }
                      aria-label="Previous slide"
                      className="w-9 h-9 rounded-xl bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors border border-white/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIdx(
                          (prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length
                        )
                      }
                      aria-label="Next slide"
                      className="w-9 h-9 rounded-xl bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors border border-white/20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Gradient Caption + Dots + Matched Thumbnail Strip */}
                <div className="relative z-10 bg-gradient-to-t from-black/90 via-black/65 to-transparent p-5 sm:p-6 pt-12">
                  <div className="flex items-end justify-between gap-4 mb-3">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                        {activeSlide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-white/85 mt-0.5">
                        {activeSlide.caption}
                      </p>
                    </div>
                    {/* Dots */}
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 pb-1">
                      {HERO_CAROUSEL_SLIDES.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveSlideIdx(idx)}
                          aria-label={`Go to ${s.badge} slide`}
                          className={`h-2 rounded-full transition-all ${
                            idx === activeSlideIdx
                              ? 'w-5 bg-[#D9A74A]'
                              : 'w-2 bg-white/45 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 7 Matched Thumbnails (Facade, Lobby, Royal Suite, Pool, Restaurant, Bar, Lawn) */}
                  <div className="grid grid-cols-7 gap-1.5 pt-3 border-t border-white/20">
                    {HERO_CAROUSEL_SLIDES.map((slide, idx) => {
                      const isCurrent = idx === activeSlideIdx;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setActiveSlideIdx(idx)}
                          className={`text-left rounded-lg overflow-hidden border transition-all p-1 ${
                            isCurrent
                              ? 'border-[#D9A74A] bg-white/20'
                              : 'border-white/15 bg-black/35 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="aspect-[16/10] rounded overflow-hidden mb-1">
                            <SafeImage
                              src={slide.image}
                              alt={slide.badge}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-white truncate text-center">
                            {slide.badge}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — QUICK HIGHLIGHT CARDS (4) */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECTION_2_HIGHLIGHT_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <motion.a
                  key={card.title}
                  href={card.href}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="group bg-white border border-[#E5DFD3] hover:border-[#8A5A12] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-[#8A5A12] price-tabular">
                      {card.index}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F4] border border-[#E5DFD3] flex items-center justify-center text-[#8A5A12] group-hover:bg-[#8A5A12] group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1A1A1A] group-hover:text-[#8A5A12] transition-colors">
                      {lang === 'hi' ? card.titleHi : card.title}
                    </h3>
                    <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed price-tabular">
                      {lang === 'hi' ? card.detailHi : card.detail}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* SECTION 3 — DIRECT BOOKING WIDGET (Full untruncated controls + live GST & OTA savings breakdown) */}
          <div
            id="booking-widget"
            className="mt-10 bg-white border border-[#DFD8CA] rounded-2xl p-5 sm:p-7 shadow-sm scroll-mt-20"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#EFECE6]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A12]">
                  Official Direct Booking Engine · Zero OTA Commission
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-0.5">
                  {t.sections.bookingTitle}
                </h2>
              </div>
              <div className="text-xs text-[#1D4E3E] font-semibold bg-[#1D4E3E]/10 px-3.5 py-2 rounded-xl border border-[#1D4E3E]/20 price-tabular">
                You save ~₹{otaEstimatedSaving.toLocaleString('en-IN')} ({BOOKING_CONFIG.otaSavingsPercent}%) vs. OTAs [CONFIGURABLE]
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                trackEvent('book_stay_click', {
                  room: selectedRoomObj.title,
                  totalInr: grandTotal,
                });
                onQuickReserve({
                  checkIn,
                  checkOut,
                  roomsCount,
                  adults,
                  children,
                  roomId: selectedRoomId,
                  occupancy,
                  includeExtraBed,
                  mealPlan,
                });
              }}
              className="space-y-5"
            >
              {/* Row 1: Untruncated Full-Width Dropdowns & Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="widget-checkin"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] mb-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#8A5A12]" aria-hidden="true" />
                    Check-In Date (2:00 PM)
                  </label>
                  <input
                    id="widget-checkin"
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#8A5A12]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="widget-checkout"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] mb-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#8A5A12]" aria-hidden="true" />
                    Check-Out Date (12:00 PM)
                  </label>
                  <input
                    id="widget-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#8A5A12]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="widget-room-category"
                    className="block text-xs font-semibold text-[#4A4A4A] mb-1.5"
                  >
                    Room / Suite Category (Synced Across Page)
                  </label>
                  <select
                    id="widget-room-category"
                    value={selectedRoomId}
                    onChange={(e) => onSelectRoomId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A] font-medium focus:outline-none focus:border-[#8A5A12]"
                  >
                    {ROOM_CATEGORIES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.sizeSqFt}) — Single ₹{r.singleInr.toLocaleString('en-IN')} / Double ₹{r.doubleInr.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Occupancy, Meal Plan, Rooms, Adults/Children & Extra Bed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="widget-occupancy"
                    className="block text-xs font-semibold text-[#4A4A4A] mb-1.5"
                  >
                    Occupancy Type
                  </label>
                  <select
                    id="widget-occupancy"
                    value={includeExtraBed ? 'ExtraBed' : occupancy}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'ExtraBed') {
                        onChangeOccupancy('Double');
                        setIncludeExtraBed(true);
                        setAdults(3);
                      } else {
                        setIncludeExtraBed(false);
                        const nextOcc = val as OccupancyType;
                        onChangeOccupancy(nextOcc);
                        setAdults(nextOcc === 'Single' ? 1 : 2);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#8A5A12]"
                  >
                    <option value="Single">
                      Single Occupancy (₹{selectedRoomObj.singleInr.toLocaleString('en-IN')}/night)
                    </option>
                    <option value="Double">
                      Double Occupancy (₹{selectedRoomObj.doubleInr.toLocaleString('en-IN')}/night)
                    </option>
                    <option value="ExtraBed">
                      Double + Extra Bed (+₹{BOOKING_CONFIG.extraBedChargePerNight}/night)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="widget-mealplan"
                    className="block text-xs font-semibold text-[#4A4A4A] mb-1.5"
                  >
                    Meal Plan Selection (EP / CP / MAP / AP)
                  </label>
                  <select
                    id="widget-mealplan"
                    value={mealPlan}
                    onChange={(e) => onChangeMealPlan(e.target.value as MealPlanCode)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#8A5A12]"
                  >
                    {MEAL_PLANS.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.label} (+₹{m.surchargePerNight}/night — {m.note})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] mb-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8A5A12]" aria-hidden="true" />
                    Rooms · Adults · Children
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      aria-label="Number of rooms"
                      className="w-full px-2 py-2.5 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Rm' : 'Rms'}
                        </option>
                      ))}
                    </select>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      aria-label="Adults"
                      className="w-full px-2 py-2.5 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                    >
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} Adt
                        </option>
                      ))}
                    </select>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      aria-label="Children"
                      className="w-full px-2 py-2.5 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} Chd
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Live Price Breakdown & Primary Submit Action */}
              <div className="bg-[#FAF8F4] border border-[#E5DFD3] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs flex-1">
                  <div>
                    <p className="text-[#666666]">
                      Base ({nights}N × {roomsCount}R)
                    </p>
                    <p className="price-tabular text-sm font-bold text-[#1A1A1A] mt-0.5">
                      ₹{roomBaseSubtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#666666]">
                      Meal Plan ({mealPlan}) {includeExtraBed ? '+ Extra Bed' : ''}
                    </p>
                    <p className="price-tabular text-sm font-bold text-[#1A1A1A] mt-0.5">
                      +₹{(mealPlanSubtotal + extraBedSubtotal).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#666666]">
                      Est. GST ({gstRatePercent}% [CONFIRM])
                    </p>
                    <p className="price-tabular text-sm font-bold text-[#1A1A1A] mt-0.5">
                      +₹{gstAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8A5A12] font-semibold">Total Payable (Incl. GST)</p>
                    <p className="price-tabular text-xl font-bold text-[#1A1A1A] mt-0.5">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#8A5A12] hover:bg-[#72490D] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
                  >
                    {t.bookStay} · ₹{grandTotal.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
