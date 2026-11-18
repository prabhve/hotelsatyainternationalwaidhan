import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Scale,
  X,
} from 'lucide-react';
import {
  BOOKING_CONFIG,
  Language,
  MEAL_PLANS,
  MealPlanCode,
  OccupancyType,
  ROOM_CATEGORIES,
  RoomCategory,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { useFirebase } from '../contexts/FirebaseContext';
import { buildMailtoUrl, buildWhatsAppUrl, trackEvent } from '../lib/analytics';
import { QuickSearchParams } from './HeroSection';
import { SafeImage } from './SafeImage';
import { LUXURY_EASE, LUXURY_SPRING, Reveal } from './MotionPrimitives';

interface RoomsAndBookingSectionProps {
  lang: Language;
  selectedRoomId: string;
  onSelectRoomId: (id: string) => void;
  occupancy: OccupancyType;
  onChangeOccupancy: (occ: OccupancyType) => void;
  mealPlan: MealPlanCode;
  onChangeMealPlan: (plan: MealPlanCode) => void;
  bookingTrigger: QuickSearchParams | null;
  onClearTrigger: () => void;
}

function calcNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) && diff > 0 ? Math.min(diff, 60) : 1;
}

export function RoomsAndBookingSection({
  lang,
  selectedRoomId,
  onSelectRoomId,
  occupancy,
  onChangeOccupancy,
  mealPlan,
  onChangeMealPlan,
  bookingTrigger,
  onClearTrigger,
}: RoomsAndBookingSectionProps) {
  const {
    user,
    isAdmin,
    authError,
    bookings,
    signInWithGoogle,
    logout,
    createBooking,
    cancelBooking,
    adminUpdateBookingStatus,
  } = useFirebase();

  const t = UI_TRANSLATIONS[lang];

  const [tierFilter, setTierFilter] = useState<'All' | 'Suite' | 'Deluxe' | 'Standard'>('All');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [cardPhotoIdx, setCardPhotoIdx] = useState<Record<string, number>>({});
  const [inspectPhotoIdx, setInspectPhotoIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  // Booking Modal State
  const [modalRoom, setModalRoom] = useState<RoomCategory | null>(null);
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [roomsCount, setRoomsCount] = useState(1);
  const [includeExtraBed, setIncludeExtraBed] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isCorporateGst, setIsCorporateGst] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstinNumber, setGstinNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    refId: string;
    whatsappUrl: string;
    mailtoUrl: string;
    summaryText: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.displayName || '');
      if (!guestEmail) setGuestEmail(user.email || '');
    }
  }, [user, guestName, guestEmail]);

  useEffect(() => {
    setInspectPhotoIdx(0);
  }, [selectedRoomId]);

  useEffect(() => {
    if (bookingTrigger) {
      const matched =
        ROOM_CATEGORIES.find((r) => r.id === bookingTrigger.roomId) || ROOM_CATEGORIES[0];
      setModalRoom(matched);
      onSelectRoomId(matched.id);
      setCheckInDate(bookingTrigger.checkIn);
      setCheckOutDate(bookingTrigger.checkOut);
      setRoomsCount(bookingTrigger.roomsCount || 1);
      setAdults(bookingTrigger.adults);
      setChildren(bookingTrigger.children);
      onChangeOccupancy(bookingTrigger.occupancy);
      setIncludeExtraBed(Boolean(bookingTrigger.includeExtraBed));
      onChangeMealPlan(bookingTrigger.mealPlan);
      setConfirmedBooking(null);
      setSubmitError(null);
      onClearTrigger();
    }
  }, [bookingTrigger, onClearTrigger, onSelectRoomId, onChangeOccupancy, onChangeMealPlan]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const filteredRooms =
    tierFilter === 'All'
      ? ROOM_CATEGORIES
      : ROOM_CATEGORIES.filter((r) => r.tier === tierFilter);

  const spotlightRoom =
    ROOM_CATEGORIES.find((r) => r.id === selectedRoomId) || ROOM_CATEGORIES[0];

  const nights = calcNights(checkInDate, checkOutDate);
  const activeModalRoom = modalRoom || spotlightRoom;
  const modalNightlyRate =
    occupancy === 'Single'
      ? activeModalRoom.rates.single
      : activeModalRoom.rates.double;
  const baseStayTotalInr = modalNightlyRate * nights * roomsCount;

  const openModalForRoom = (room: RoomCategory) => {
    onSelectRoomId(room.id);
    setModalRoom(room);
    setConfirmedBooking(null);
    setSubmitError(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalRoom) return;
    setSubmitError(null);

    if (guestName.trim().length < 2) {
      setSubmitError('Please enter guest full name.');
      return;
    }
    if (guestPhone.trim().length < 7) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (checkOutDate <= checkInDate) {
      setSubmitError('Check-out date must be after check-in date.');
      return;
    }
    if (isCorporateGst && companyName.trim().length < 2) {
      setSubmitError('Please enter Company Name for Corporate / GST invoice.');
      return;
    }

    setSubmitting(true);
    try {
      let refId = `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const combinedNotes = [
        specialRequests.trim(),
        isCorporateGst ? `Corporate GST: ${companyName.trim()} (GSTIN: ${gstinNumber.trim() || 'To be provided at check-in'})` : '',
        includeExtraBed ? 'Extra Bed Requested' : '',
        `Rooms: ${roomsCount} | Meal Plan Preference: ${mealPlan} | Payment: Pay at Hotel Reception`,
      ]
        .filter(Boolean)
        .join(' | ');

      if (user) {
        try {
          refId = await createBooking({
            guestName: guestName.trim(),
            guestEmail: (guestEmail || user.email || 'guest@hotelsatyainternational.com').trim(),
            guestPhone: guestPhone.trim(),
            roomId: modalRoom.id,
            roomTitle: modalRoom.title,
            occupancy,
            mealPlan,
            checkInDate,
            checkOutDate,
            nights,
            adults,
            children,
            totalInr: baseStayTotalInr,
            specialRequests: combinedNotes.slice(0, 580),
          });
        } catch {
          // Non-blocking fallback when guest is not authenticated
        }
      }

      const summaryText = `Namaste Hotel Satya International (Waidhan Reception),\nNew Room Booking Request / Enquiry [Ref: ${refId}]:\n• Status: Pending Reception Availability Confirmation\n• Guest: ${guestName.trim()} (${guestPhone.trim()})\n• Room Requested: ${modalRoom.title} (${roomsCount} Room, ${occupancy}${includeExtraBed ? ' + Extra Bed Requested' : ''})\n• Meal Plan Preference: ${mealPlan}\n• Check-In: ${checkInDate} (2:00 PM) → Check-Out: ${checkOutDate} (12:00 PM) (${nights} Night${nights > 1 ? 's' : ''})\n• Guests: ${adults} Adults, ${children} Children\n${isCorporateGst ? `• Corporate Billing: ${companyName.trim()} | GSTIN: ${gstinNumber.trim() || 'Will share at check-in'}\n` : ''}• Published Room Tariff: ₹${baseStayTotalInr.toLocaleString('en-IN')} (${nights}N × ${roomsCount}R @ ₹${modalNightlyRate.toLocaleString('en-IN')}/night + applicable taxes)\n${specialRequests.trim() ? `• Special Notes: ${specialRequests.trim()}` : ''}`;

      const whatsappUrl = buildWhatsAppUrl(summaryText);
      const mailtoUrl = buildMailtoUrl(
        `Room Booking Request [${refId}] — ${modalRoom.title} (${checkInDate} to ${checkOutDate})`,
        summaryText
      );

      trackEvent('book_stay_click', {
        refId,
        room: modalRoom.title,
        totalInr: baseStayTotalInr,
      });

      setConfirmedBooking({
        refId,
        whatsappUrl,
        mailtoUrl,
        summaryText,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to process booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const comparedRooms = ROOM_CATEGORIES.filter((r) => compareIds.includes(r.id));

  return (
    <section id="rooms" className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0] scroll-mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Global Synced Controls */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                {lang === 'hi'
                  ? 'आवास और आधिकारिक प्रकाशित टैरिफ'
                  : 'Accommodations & Published Tariffs'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#191D1B] text-balance">
                {t.sections.roomsTitle}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tier Filter Chips */}
              <div className="inline-flex items-center p-1 bg-[#EFECE4] border border-[#E9E2D5] rounded-xl">
                {(['All', 'Suite', 'Deluxe', 'Standard'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setTierFilter(tier)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      tierFilter === tier
                        ? 'bg-white text-[#191D1B] shadow-xs'
                        : 'text-[#525854] hover:text-[#191D1B]'
                    }`}
                  >
                    {tier === 'All' ? 'All 7 Categories' : `${tier}s`}
                  </button>
                ))}
              </div>

              {/* Occupancy Toggle */}
              <div className="inline-flex items-center p-1 bg-[#EFECE4] border border-[#E9E2D5] rounded-xl">
                {(['Single', 'Double'] as const).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => onChangeOccupancy(occ)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      occupancy === occ
                        ? 'bg-[#191D1B] text-white'
                        : 'text-[#525854] hover:text-[#191D1B]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              {/* Meal Plan Preference Toggle */}
              <div className="inline-flex items-center p-1 bg-[#EFECE4] border border-[#E9E2D5] rounded-xl">
                {MEAL_PLANS.map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => onChangeMealPlan(m.code)}
                    title={m.note}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      mealPlan === m.code
                        ? 'bg-[#183D32] text-white'
                        : 'text-[#525854] hover:text-[#191D1B]'
                    }`}
                  >
                    {m.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* SPOTLIGHT ROOM INSPECTOR + COMPLETE 7-TIER VERIFIED TARIFF SCHEDULE */}
        <Reveal delay={0.08}>
          <div
            id="inspect-room-panel"
            className="mb-12 bg-white border border-[#E9E2D5] rounded-2xl overflow-hidden shadow-xs scroll-mt-24"
          >
            {/* 7-Room Selector Tabs */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#EFECE4] border-b border-[#E9E2D5] flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-[#525854] whitespace-nowrap shrink-0 mr-1">
                Inspect Category:
              </span>
              {ROOM_CATEGORIES.map((r, idx) => {
                const active = r.id === spotlightRoom.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRoomId(r.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#183D32] text-white shadow-xs'
                        : 'bg-white text-[#525854] hover:text-[#191D1B] border border-[#E9E2D5]'
                    }`}
                  >
                    0{idx + 1}. {lang === 'hi' ? r.titleHi : r.title}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left: Multi-Photo Gallery with Lightbox Trigger */}
              <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E9E2D5] bg-[#F8F6F0]">
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#EFECE4] border border-[#E9E2D5]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${spotlightRoom.id}-${inspectPhotoIdx}`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: LUXURY_EASE }}
                        className="w-full h-full"
                      >
                        <SafeImage
                          src={spotlightRoom.images[inspectPhotoIdx] || spotlightRoom.image}
                          alt={`${spotlightRoom.title} — Photo ${inspectPhotoIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxImage({
                          src: spotlightRoom.images[inspectPhotoIdx] || spotlightRoom.image,
                          title: `${spotlightRoom.title} (${spotlightRoom.categoryLabel})`,
                        })
                      }
                      aria-label="Open full photo in lightbox"
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Expand className="w-3.5 h-3.5" />
                      Enlarge
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 py-3 text-white">
                      <p className="text-xs font-medium">
                        {spotlightRoom.categoryLabel} · {spotlightRoom.bedType}
                      </p>
                    </div>
                  </div>

                {/* Room Gallery Thumbnails */}
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  {spotlightRoom.images.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInspectPhotoIdx(idx)}
                      className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        inspectPhotoIdx === idx
                          ? 'border-[#183D32]'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <SafeImage
                        src={imgSrc}
                        alt={`${spotlightRoom.title} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Included Amenities Grid */}
              <div className="mt-5 pt-4 border-t border-[#E9E2D5]">
                <div className="flex items-center justify-between text-xs text-[#525854] mb-2.5">
                  <span className="font-semibold text-[#191D1B]">Verified Room Privileges</span>
                  <span className="price-tabular">Check-in 2:00 PM · Check-out 12:00 PM</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {spotlightRoom.highlights.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#191D1B]">
                      <Check className="w-3.5 h-3.5 text-[#183D32] shrink-0" aria-hidden="true" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Verified 7-Category Published Tariff Schedule + Meal Plan Selector */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#183D32] uppercase tracking-wider mb-1">
                  {spotlightRoom.categoryLabel} · Official Published Tariff
                </p>
                <h3 className="font-display text-3xl font-semibold text-[#191D1B] mb-2">
                  {lang === 'hi' ? spotlightRoom.titleHi : spotlightRoom.title}
                </h3>
                <p className="text-sm text-[#525854] leading-relaxed mb-5">
                  {spotlightRoom.description}
                </p>

                {/* Complete 7-Category Official Tariff Table */}
                <div className="border border-[#E9E2D5] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#EFECE4] border-b border-[#E9E2D5] text-[#525854]">
                        <th className="py-2.5 px-3.5 font-semibold">Room Category</th>
                        <th className="py-2.5 px-3.5 font-semibold">Single Tariff</th>
                        <th className="py-2.5 px-3.5 font-semibold">Double Tariff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE4]">
                      {ROOM_CATEGORIES.map((rm) => {
                        const isCurrent = rm.id === spotlightRoom.id;
                        return (
                          <tr
                            key={rm.id}
                            onClick={() => onSelectRoomId(rm.id)}
                            className={`cursor-pointer transition-colors ${
                              isCurrent ? 'bg-[#F8F6F0]' : 'hover:bg-[#F8F6F0]/60'
                            }`}
                          >
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`font-semibold ${
                                  isCurrent ? 'text-[#183D32] font-bold' : 'text-[#191D1B]'
                                }`}
                              >
                                {rm.title}
                              </span>
                            </td>
                            <td
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRoomId(rm.id);
                                onChangeOccupancy('Single');
                              }}
                              className={`py-2.5 px-3.5 price-tabular font-bold ${
                                isCurrent && occupancy === 'Single'
                                  ? 'text-[#183D32] underline decoration-2 underline-offset-4'
                                  : 'text-[#191D1B]'
                              }`}
                            >
                              ₹{rm.rates.single.toLocaleString('en-IN')}
                            </td>
                            <td
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRoomId(rm.id);
                                onChangeOccupancy('Double');
                              }}
                              className={`py-2.5 px-3.5 price-tabular font-bold ${
                                isCurrent && occupancy === 'Double'
                                  ? 'text-[#183D32] underline decoration-2 underline-offset-4'
                                  : 'text-[#191D1B]'
                              }`}
                            >
                              ₹{rm.rates.double.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Meal Plan Preference Selector */}
                <div className="mt-4 bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl p-3.5 text-xs text-[#525854]">
                  <p className="font-semibold text-[#191D1B] mb-2">
                    Select Meal Plan Preference for Your Stay Quotation:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MEAL_PLANS.map((plan) => {
                      const active = mealPlan === plan.code;
                      return (
                        <button
                          key={plan.code}
                          type="button"
                          onClick={() => onChangeMealPlan(plan.code)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-[#183D32] text-white border-[#183D32]'
                              : 'bg-white text-[#191D1B] border-[#E9E2D5] hover:border-[#C6A66B]'
                          }`}
                        >
                          <span className="font-bold block">{plan.code}</span>
                          <span
                            className={`text-[11px] block truncate ${
                              active ? 'text-white/85' : 'text-[#525854]'
                            }`}
                          >
                            {plan.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Single Unified CTA for Selected Room + Verified Tariff Footnote */}
              <div className="mt-5 pt-4 border-t border-[#E9E2D5]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#525854]">
                      Selected: <strong>{spotlightRoom.title}</strong> · <strong>{occupancy}</strong> ·{' '}
                      <strong>{mealPlan} Preference</strong>
                    </p>
                    <p className="price-tabular text-2xl font-bold text-[#191D1B] mt-0.5">
                      ₹
                      {(occupancy === 'Single'
                        ? spotlightRoom.rates.single
                        : spotlightRoom.rates.double
                      ).toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-[#525854]">/ night + taxes</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openModalForRoom(spotlightRoom)}
                    className="btn-gold-sheen px-6 py-3.5 bg-[#183D32] hover:bg-[#122E25] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Request Booking ({occupancy} · {mealPlan})
                  </button>
                </div>

                <p className="text-[11px] text-[#525854] mt-3 leading-relaxed">
                  * {BOOKING_CONFIG.tariffTaxNote} {BOOKING_CONFIG.childPolicyNote}
                </p>
              </div>
            </div>
          </div>
          </div>
        </Reveal>

        {/* Compare Drawer (up to 3 rooms) */}
        {comparedRooms.length > 0 && (
          <div className="mb-10 bg-white border-2 border-[#C6A66B] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E9E2D5]">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#183D32]" aria-hidden="true" />
                <h3 className="font-display text-2xl font-semibold text-[#191D1B]">
                  Side-by-Side Room Comparison ({comparedRooms.length} / 3 Selected)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs font-semibold text-[#525854] hover:text-[#191D1B] cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E9E2D5] text-[#525854]">
                    <th className="py-2.5 pr-4 font-semibold">Feature</th>
                    {comparedRooms.map((cr) => (
                      <th key={cr.id} className="py-2.5 px-4 font-bold text-[#191D1B]">
                        {cr.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  <tr>
                    <td className="py-2.5 pr-4 text-[#525854]">Classification & Bed</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 font-medium text-[#191D1B]">
                        {cr.categoryLabel} · {cr.bedType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#525854]">Single Occupancy Tariff</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 price-tabular font-bold text-[#191D1B]">
                        ₹{cr.rates.single.toLocaleString('en-IN')} / night
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#525854]">Double Occupancy Tariff</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 price-tabular font-bold text-[#183D32]">
                        ₹{cr.rates.double.toLocaleString('en-IN')} / night
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#525854]">Included Privileges</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 text-xs text-[#525854]">
                        {cr.highlights.join(' · ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#525854]">Action</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => openModalForRoom(cr)}
                          className="px-4 py-2 bg-[#183D32] text-white text-xs font-semibold rounded-lg hover:bg-[#122E25] cursor-pointer"
                        >
                          Reserve {cr.title}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3-Column Room Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredRooms.map((room, idx) => {
            const isComparing = compareIds.includes(room.id);
            const currentImgIdx = cardPhotoIdx[room.id] || 0;
            const currentImg = room.images[currentImgIdx] || room.image;

            return (
              <motion.article
                key={room.id}
                layout
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                whileHover={{ y: -7, scale: 1.015 }}
                transition={{ ...LUXURY_SPRING, delay: idx * 0.06 }}
                className="bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-colors"
              >
                <div>
                  {/* Room Image Slider */}
                  <div className="aspect-[4/3] bg-[#EFECE4] overflow-hidden relative group">
                    <SafeImage
                      src={currentImg}
                      alt={`${room.title} at Hotel Satya International, Waidhan`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                    {room.images.length > 1 && (
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setCardPhotoIdx((prev) => ({
                              ...prev,
                              [room.id]:
                                ((prev[room.id] || 0) - 1 + room.images.length) %
                                room.images.length,
                            }))
                          }
                          aria-label={`Previous ${room.title} photo`}
                          className="w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCardPhotoIdx((prev) => ({
                              ...prev,
                              [room.id]: ((prev[room.id] || 0) + 1) % room.images.length,
                            }))
                          }
                          aria-label={`Next ${room.title} photo`}
                          className="w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 py-3 flex items-center justify-between text-xs text-white">
                      <span>{room.categoryLabel}</span>
                      <span>{room.bedType}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#525854] mb-1.5">
                      <span className="font-semibold text-[#183D32]">{room.tier} Category</span>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-[#525854] hover:text-[#191D1B]">
                        <input
                          type="checkbox"
                          checked={isComparing}
                          onChange={() => toggleCompare(room.id)}
                          className="accent-[#183D32] rounded"
                        />
                        <span>+ Compare</span>
                      </label>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#191D1B] mb-1.5">
                      {lang === 'hi' ? room.titleHi : room.title}
                    </h3>
                    <p className="text-sm text-[#525854] leading-relaxed mb-4">
                      {room.description}
                    </p>

                    <ul className="space-y-1.5 border-t border-[#EFECE4] pt-3.5">
                      {room.highlights.slice(0, 4).map((amen) => (
                        <li key={amen} className="flex items-center gap-2 text-xs text-[#525854]">
                          <Check className="w-3.5 h-3.5 text-[#183D32] shrink-0" aria-hidden="true" />
                          <span>{amen}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Verified Single & Double Tariffs + Dual Action Footer */}
                <div className="px-6 py-4 border-t border-[#E9E2D5] bg-[#F8F6F0] flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#525854] block">
                        Single Occupancy
                      </span>
                      <span className="price-tabular text-lg font-bold text-[#191D1B]">
                        ₹{room.rates.single.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#525854]"> / night</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-[#183D32] font-semibold block">
                        Double Occupancy
                      </span>
                      <span className="price-tabular text-lg font-bold text-[#183D32]">
                        ₹{room.rates.double.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#525854]"> / night</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRoomId(room.id);
                        document
                          .getElementById('inspect-room-panel')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-2.5 text-xs font-semibold text-[#191D1B] bg-white border border-[#E9E2D5] rounded-xl hover:border-[#C6A66B] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalForRoom(room)}
                      className="px-3 py-2.5 text-xs font-semibold text-white bg-[#183D32] rounded-xl hover:bg-[#122E25] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Integrated Guest Reservations & Front-Desk Portal */}
        <div className="mt-14 bg-white border border-[#E9E2D5] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E9E2D5]">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#191D1B]">
                {isAdmin ? 'Front-Desk Reservation Ledger' : 'My Reservations & Check-In Status'}
              </h3>
              <p className="text-sm text-[#525854] mt-0.5">
                {user
                  ? `Signed in as ${user.displayName || user.email}${isAdmin ? ' (Front-Desk Admin)' : ''}`
                  : 'Optional: Sign in with Google to save your booking requests online, or book directly via WhatsApp & Email.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#191D1B] border border-[#E9E2D5] rounded-xl hover:bg-[#EFECE4] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#183D32] rounded-xl hover:bg-[#122E25] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>

          {authError && (
            <p className="mt-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {authError}
            </p>
          )}

          {user && bookings.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E9E2D5] text-xs text-[#525854]">
                    <th className="py-3 pr-4 font-semibold">Reference</th>
                    <th className="py-3 pr-4 font-semibold">Room & Plan</th>
                    <th className="py-3 pr-4 font-semibold">Dates</th>
                    <th className="py-3 pr-4 font-semibold">Published Tariff</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E2D5]">
                  {bookings.map((bk) => (
                    <tr key={bk.bookingId}>
                      <td className="py-3.5 pr-4 price-tabular text-xs font-bold text-[#191D1B]">
                        {bk.bookingId}
                        {isAdmin && (
                          <span className="block font-normal text-[#525854] mt-0.5">
                            {bk.guestName} · {bk.guestPhone}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-medium text-[#191D1B]">{bk.roomTitle}</span>
                        <span className="block text-xs text-[#525854]">
                          {bk.occupancy} · {bk.mealPlan} · {bk.nights} night(s)
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 price-tabular text-xs text-[#525854]">
                        {bk.checkInDate} → {bk.checkOutDate}
                      </td>
                      <td className="py-3.5 pr-4 price-tabular font-bold text-[#191D1B]">
                        ₹{bk.totalInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-semibold capitalize">
                        {bk.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[#183D32]">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Confirmed
                          </span>
                        )}
                        {bk.status === 'pending' && (
                          <span className="text-[#8C6B32]">Pending Confirmation</span>
                        )}
                        {bk.status === 'cancelled' && (
                          <span className="text-[#525854]">Cancelled</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                        {isAdmin && bk.status !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => adminUpdateBookingStatus(bk.bookingId, 'confirmed')}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#183D32] text-white rounded-lg hover:bg-[#122E25] cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {bk.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(bk.bookingId)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#191D1B] border border-[#E9E2D5] rounded-lg hover:bg-[#EFECE4] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#F8F6F0] rounded-2xl overflow-hidden border border-[#E9E2D5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E9E2D5]">
              <p className="text-sm font-semibold text-[#191D1B]">{lightboxImage.title}</p>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Close lightbox"
                className="p-1.5 rounded-lg hover:bg-[#EFECE4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black max-h-[75vh] flex items-center justify-center">
              <SafeImage
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ROOM BOOKING REQUEST MODAL */}
      {modalRoom && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div className="bg-[#F8F6F0] border border-[#E9E2D5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative shadow-xl">
            <button
              type="button"
              onClick={() => setModalRoom(null)}
              aria-label="Close booking request modal"
              className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#E9E2D5] bg-white flex items-center justify-center text-[#191D1B] hover:bg-[#EFECE4] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#183D32] mb-1">
              Room Reservation Enquiry · Subject to Reception Availability Confirmation
            </p>
            <h3
              id="booking-modal-title"
              className="font-display text-3xl font-semibold text-[#191D1B] mb-3 pr-12"
            >
              {modalRoom.title}
            </h3>

            {/* Journey Indicator */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#525854] pb-4 mb-5 border-b border-[#E9E2D5]">
              <span className="font-semibold text-[#183D32]">1. Dates & Guests</span>
              <span>→</span>
              <span className="font-semibold text-[#183D32]">2. Room ({occupancy})</span>
              <span>→</span>
              <span className="font-semibold text-[#183D32]">3. Meal Plan ({mealPlan})</span>
              <span>→</span>
              <span className={!confirmedBooking ? 'font-bold text-[#191D1B] underline' : 'font-semibold text-[#183D32]'}>
                4. Guest Details
              </span>
              <span>→</span>
              <span className={confirmedBooking ? 'font-bold text-[#183D32] underline' : ''}>
                5. Enquiry Reference
              </span>
            </div>

            {confirmedBooking ? (
              <div className="bg-white border border-[#E9E2D5] rounded-xl p-6 space-y-5">
                <div className="flex items-start gap-2.5 text-[#183D32] font-bold text-base">
                  <CalendarCheck2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span>Booking Enquiry Reference: {confirmedBooking.refId}</span>
                    <span className="block text-xs font-medium text-[#8C6B32] mt-0.5">
                      Status: Enquiry Logged (Pending Front-Desk Availability Confirmation)
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#525854] leading-relaxed">
                  Thank you, <strong>{guestName}</strong>. Please send your reservation details directly to our 24×7 Waidhan Front Office via WhatsApp or Email below for immediate room availability confirmation:
                </p>

                <div className="bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl p-3.5 text-xs text-[#191D1B] whitespace-pre-wrap leading-relaxed">
                  {confirmedBooking.summaryText}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={confirmedBooking.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { source: 'booking_modal_success' })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#183D32] hover:bg-[#122E25] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Booking Request on WhatsApp
                  </a>
                  <a
                    href={confirmedBooking.mailtoUrl}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#191D1B] hover:bg-[#2E3330] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#C6A66B]" />
                    Send Request via Email
                  </a>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setModalRoom(null)}
                    className="px-5 py-2 text-xs font-semibold text-[#525854] hover:text-[#191D1B] cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Check-In (2:00 PM)
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Check-Out (12:00 PM)
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Number of Rooms
                    </label>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Room' : 'Rooms'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Published Occupancy Tariff
                    </label>
                    <select
                      value={includeExtraBed ? 'ExtraBed' : occupancy}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'ExtraBed') {
                          onChangeOccupancy('Double');
                          setIncludeExtraBed(true);
                        } else {
                          setIncludeExtraBed(false);
                          onChangeOccupancy(val as OccupancyType);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                    >
                      <option value="Single">
                        Single Occupancy (₹{modalRoom.rates.single.toLocaleString('en-IN')}/night)
                      </option>
                      <option value="Double">
                        Double Occupancy (₹{modalRoom.rates.double.toLocaleString('en-IN')}/night)
                      </option>
                      <option value="ExtraBed">
                        Double Occupancy (₹{modalRoom.rates.double.toLocaleString('en-IN')}/night) + Request Extra Bed
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Meal Plan Preference
                    </label>
                    <select
                      value={mealPlan}
                      onChange={(e) => onChangeMealPlan(e.target.value as MealPlanCode)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                    >
                      {MEAL_PLANS.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.label} — {m.shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      maxLength={100}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Full name as on ID"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      maxLength={25}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      maxLength={160}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                    />
                  </div>
                </div>

                {/* Corporate / GST Booking Checkbox */}
                <div className="bg-white border border-[#E9E2D5] rounded-xl p-3.5 space-y-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#191D1B]">
                    <input
                      type="checkbox"
                      checked={isCorporateGst}
                      onChange={(e) => setIsCorporateGst(e.target.checked)}
                      className="accent-[#183D32] w-4 h-4 rounded"
                    />
                    <span>Corporate / Business Stay (Request Tax Invoice for Company)</span>
                  </label>

                  {isCorporateGst && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#525854] mb-1">
                          Company / Organization Name *
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. NTPC Ltd. / Reliance Power"
                          className="w-full px-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
                          required={isCorporateGst}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#525854] mb-1">
                          Company 15-Digit GSTIN (Optional)
                        </label>
                        <input
                          type="text"
                          value={gstinNumber}
                          maxLength={15}
                          onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                          placeholder="Enter company GSTIN"
                          className="w-full px-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transparent Payment Policy */}
                <div className="bg-white border border-[#E9E2D5] rounded-xl p-3.5 text-xs text-[#525854]">
                  <p className="font-semibold text-[#191D1B] mb-1">
                    Direct Reservation Confirmation Policy
                  </p>
                  <p>
                    Your enquiry is reviewed directly by our 24×7 Waidhan Front Office. Payment is settled at the hotel upon check-in or after formal reservation confirmation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#525854] mb-1">
                    Special Requests (Station/Airport Pickup, Early Check-In, Dietary)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Optional: Singrauli station cab pickup, early morning check-in, extra pillows..."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div className="pt-3 border-t border-[#E9E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="price-tabular text-2xl font-bold text-[#191D1B]">
                      ₹{baseStayTotalInr.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-[#525854] price-tabular">
                      Published room tariff for {nights}N × {roomsCount}R ({occupancy}) · Exclusive of taxes · {mealPlan} Plan
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3.5 bg-[#183D32] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-lg hover:bg-[#122E25] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Booking Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
