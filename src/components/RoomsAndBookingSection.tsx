import { useEffect, useState } from 'react';
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
  QrCode,
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
  const [paymentMode, setPaymentMode] = useState<'hotel' | 'upi'>('hotel');
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
      ? activeModalRoom.rates.single[mealPlan]
      : activeModalRoom.rates.double[mealPlan];
  const extraBedPerNight = includeExtraBed ? BOOKING_CONFIG.extraBedChargePerNight : 0;
  const preTaxTotal = (modalNightlyRate + extraBedPerNight) * nights * roomsCount;
  const gstPercent =
    modalNightlyRate > BOOKING_CONFIG.gstThresholdInr
      ? BOOKING_CONFIG.gstLuxuryPercent
      : BOOKING_CONFIG.gstStandardPercent;
  const gstAmount = Math.round((preTaxTotal * gstPercent) / 100);
  const grandTotalInr = preTaxTotal + gstAmount;

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
        isCorporateGst ? `Corporate GST: ${companyName.trim()} (GSTIN: ${gstinNumber.trim() || 'Pending'})` : '',
        includeExtraBed ? 'Extra Bed Included' : '',
        `Rooms: ${roomsCount} | Payment: Pay at Hotel Reception upon Confirmation`,
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
            totalInr: grandTotalInr,
            specialRequests: combinedNotes.slice(0, 580),
          });
        } catch {
          // Fallback to generated enquiry refId if guest is not signed in with a verified account
        }
      }

      const summaryText = `Namaste Hotel Satya International (Waidhan Reception),\nNew Room Booking Request / Enquiry [Ref: ${refId}]:\n• Status: Pending Reception Availability Confirmation\n• Guest: ${guestName.trim()} (${guestPhone.trim()})\n• Room Requested: ${modalRoom.title} (${roomsCount} Room, ${occupancy}${includeExtraBed ? ' + Extra Bed' : ''}, ${mealPlan} Plan)\n• Check-In: ${checkInDate} (2:00 PM) → Check-Out: ${checkOutDate} (12:00 PM) (${nights} Night${nights > 1 ? 's' : ''})\n• Guests: ${adults} Adults, ${children} Children\n${isCorporateGst ? `• Corporate GST: ${companyName.trim()} | GSTIN: ${gstinNumber.trim()}\n` : ''}• Payment: Pay at Hotel Reception upon Confirmation\n• Estimated Tariff (Incl. ${gstPercent}% GST): ₹${grandTotalInr.toLocaleString('en-IN')}\n${specialRequests.trim() ? `• Special Notes: ${specialRequests.trim()}` : ''}`;

      const whatsappUrl = buildWhatsAppUrl(summaryText);
      const mailtoUrl = buildMailtoUrl(
        `Room Booking Request [${refId}] — ${modalRoom.title} (${checkInDate} to ${checkOutDate})`,
        summaryText
      );

      trackEvent('book_stay_click', {
        refId,
        room: modalRoom.title,
        totalInr: grandTotalInr,
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
    <section id="rooms" className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#FAF8F4] scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header + Global Synced Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
              Section 4 · Accommodations & Published Tariffs
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
              {t.sections.roomsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tier Filter Chips */}
            <div className="inline-flex items-center p-1 bg-[#F2EDE4] border border-[#E5DFD3] rounded-xl">
              {(['All', 'Suite', 'Deluxe', 'Standard'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    tierFilter === tier
                      ? 'bg-white text-[#1A1A1A] shadow-xs'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tier === 'All' ? 'All 7 Tiers' : `${tier}s`}
                </button>
              ))}
            </div>

            {/* Occupancy Toggle (Synced with Section 3 Booking Widget) */}
            <div className="inline-flex items-center p-1 bg-[#F2EDE4] border border-[#E5DFD3] rounded-xl">
              {(['Single', 'Double'] as const).map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => onChangeOccupancy(occ)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    occupancy === occ
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>

            {/* Meal Plan Toggle (Synced with Section 3 Booking Widget) */}
            <div className="inline-flex items-center p-1 bg-[#F2EDE4] border border-[#E5DFD3] rounded-xl">
              {MEAL_PLANS.map((m) => (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => onChangeMealPlan(m.code)}
                  title={m.note}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    mealPlan === m.code
                      ? 'bg-[#8A5A12] text-white'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {m.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* "INSPECT ROOM" BIG DETAIL VIEW + SINGLE-CTA RADIO TARIFF TABLE */}
        <div
          id="inspect-room-panel"
          className="mb-12 bg-white border border-[#DFD8CA] rounded-2xl overflow-hidden shadow-xs scroll-mt-24"
        >
          {/* 7-Room Selector Tabs */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#F2EDE4] border-b border-[#E5DFD3] flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-[#4A4A4A] whitespace-nowrap shrink-0 mr-1">
              Inspect Room:
            </span>
            {ROOM_CATEGORIES.map((r, idx) => {
              const active = r.id === spotlightRoom.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRoomId(r.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-white text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#E5DFD3]'
                  }`}
                >
                  0{idx + 1}. {lang === 'hi' ? r.titleHi : r.title}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Multi-Photo Gallery with Lightbox Trigger (Clean image, no watermark overlap) */}
            <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5DFD3] bg-[#FAF8F4]">
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#EAE4D9] border border-[#E5DFD3]">
                  <SafeImage
                    src={spotlightRoom.images[inspectPhotoIdx] || spotlightRoom.image}
                    alt={`${spotlightRoom.title} — Photo ${inspectPhotoIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxImage({
                        src: spotlightRoom.images[inspectPhotoIdx] || spotlightRoom.image,
                        title: `${spotlightRoom.title} — ${spotlightRoom.sizeSqFt}`,
                      })
                    }
                    aria-label="Open full photo in lightbox"
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Expand className="w-3.5 h-3.5" />
                    Enlarge
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 py-3 text-white">
                    <p className="text-xs font-medium">
                      {spotlightRoom.sizeSqFt} · {spotlightRoom.bedType} · Up to {spotlightRoom.maxGuests} Guests
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
                      className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                        inspectPhotoIdx === idx
                          ? 'border-[#8A5A12]'
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

              {/* Amenities Grid with Icons */}
              <div className="mt-5 pt-4 border-t border-[#E5DFD3]">
                <div className="flex items-center justify-between text-xs text-[#5A5A5A] mb-2.5">
                  <span className="font-semibold text-[#1A1A1A]">Included Suite Privileges</span>
                  <span className="price-tabular">Check-in 2:00 PM · Check-out 12:00 PM</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {spotlightRoom.highlights.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[#333333]">
                      <Check className="w-3.5 h-3.5 text-[#8A5A12] shrink-0" aria-hidden="true" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Clean Radio Tariff Table + Single CTA + Meal Plan Legend */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8A5A12] uppercase tracking-wider mb-1">
                  {spotlightRoom.tier} Category · Direct Tariff Schedule
                </p>
                <h3 className="font-display text-3xl font-semibold text-[#1A1A1A] mb-2">
                  {lang === 'hi' ? spotlightRoom.titleHi : spotlightRoom.title}
                </h3>
                <p className="text-sm text-[#454545] leading-relaxed mb-5">
                  {spotlightRoom.description}
                </p>

                {/* CLEAN TARIFF TABLE: 1 Radio per row + 1 Single CTA below */}
                <div className="border border-[#E5DFD3] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#F2EDE4] border-b border-[#E5DFD3] text-[#4A4A4A]">
                        <th className="py-3 px-3.5 font-semibold">Meal Plan</th>
                        <th className="py-3 px-3.5 font-semibold">Single Rate</th>
                        <th className="py-3 px-3.5 font-semibold">Double Rate</th>
                        <th className="py-3 px-3.5 font-semibold text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {MEAL_PLANS.map((plan) => {
                        const singleRate = spotlightRoom.rates.single[plan.code];
                        const doubleRate = spotlightRoom.rates.double[plan.code];
                        const isSelected = mealPlan === plan.code;

                        return (
                          <tr
                            key={plan.code}
                            onClick={() => onChangeMealPlan(plan.code)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#FAF8F4]' : 'hover:bg-[#FAF8F4]/60'
                            }`}
                          >
                            <td className="py-3 px-3.5">
                              <span className="font-bold text-[#1A1A1A]">{plan.label}</span>
                            </td>
                            <td
                              onClick={(e) => {
                                e.stopPropagation();
                                onChangeOccupancy('Single');
                                onChangeMealPlan(plan.code);
                              }}
                              className={`py-3 px-3.5 price-tabular font-bold ${
                                isSelected && occupancy === 'Single'
                                  ? 'text-[#8A5A12] underline decoration-2 underline-offset-4'
                                  : 'text-[#1A1A1A]'
                              }`}
                            >
                              ₹{singleRate.toLocaleString('en-IN')}
                            </td>
                            <td
                              onClick={(e) => {
                                e.stopPropagation();
                                onChangeOccupancy('Double');
                                onChangeMealPlan(plan.code);
                              }}
                              className={`py-3 px-3.5 price-tabular font-bold ${
                                isSelected && occupancy === 'Double'
                                  ? 'text-[#8A5A12] underline decoration-2 underline-offset-4'
                                  : 'text-[#1A1A1A]'
                              }`}
                            >
                              ₹{doubleRate.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <input
                                type="radio"
                                name="inspect-room-mealplan"
                                checked={isSelected}
                                onChange={() => onChangeMealPlan(plan.code)}
                                aria-label={`Select ${plan.label}`}
                                className="w-4 h-4 accent-[#8A5A12] cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Meal Plan Legend */}
                <div className="mt-4 bg-[#FAF8F4] border border-[#E5DFD3] rounded-xl p-3.5 text-xs text-[#4A4A4A] space-y-1">
                  <p className="font-semibold text-[#1A1A1A] mb-1">Meal Plan Legend:</p>
                  <p>
                    <strong>EP:</strong> Room only with complimentary Wi-Fi & swimming pool access ·{' '}
                    <strong>CP:</strong> + Morning buffet breakfast at Sharda Restaurant
                  </p>
                  <p>
                    <strong>MAP:</strong> + Breakfast & multi-cuisine dinner ·{' '}
                    <strong>AP:</strong> + Breakfast, lunch & dinner at Sharda Restaurant
                  </p>
                </div>
              </div>

              {/* Single Unified CTA for Selected Plan + Footnote */}
              <div className="mt-5 pt-4 border-t border-[#E5DFD3]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#5A5A5A]">
                      Selected: <strong>{spotlightRoom.title}</strong> · <strong>{occupancy}</strong> ·{' '}
                      <strong>{mealPlan} Plan</strong>
                    </p>
                    <p className="price-tabular text-2xl font-bold text-[#1A1A1A] mt-0.5">
                      ₹
                      {(occupancy === 'Single'
                        ? spotlightRoom.rates.single[mealPlan]
                        : spotlightRoom.rates.double[mealPlan]
                      ).toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-[#5A5A5A]">/ night + GST</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openModalForRoom(spotlightRoom)}
                    className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    Book This Plan ({mealPlan} · {occupancy})
                  </button>
                </div>

                <p className="text-[11px] text-[#666666] mt-3 leading-relaxed">
                  * Rates are per night, excluding taxes (GST {BOOKING_CONFIG.gstStandardPercent}% up to ₹7,500 / {BOOKING_CONFIG.gstLuxuryPercent}% above). Extra bed ₹{BOOKING_CONFIG.extraBedChargePerNight}/night [PLACEHOLDER]. {BOOKING_CONFIG.childPolicyNote} Rates subject to change during peak/wedding season.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Drawer (up to 3 rooms) */}
        {comparedRooms.length > 0 && (
          <div className="mb-10 bg-white border-2 border-[#8A5A12] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E5DFD3]">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#8A5A12]" aria-hidden="true" />
                <h3 className="font-display text-2xl font-semibold text-[#1A1A1A]">
                  Side-by-Side Room Comparison ({comparedRooms.length} / 3 Selected)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs font-semibold text-[#5A5A5A] hover:text-[#1A1A1A]"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E5DFD3] text-[#5A5A5A]">
                    <th className="py-2.5 pr-4 font-semibold">Feature</th>
                    {comparedRooms.map((cr) => (
                      <th key={cr.id} className="py-2.5 px-4 font-bold text-[#1A1A1A]">
                        {cr.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  <tr>
                    <td className="py-2.5 pr-4 text-[#5A5A5A]">Size & Bed Type</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 font-medium text-[#1A1A1A]">
                        {cr.sizeSqFt} · {cr.bedType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#5A5A5A]">Max Guests</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 text-[#1A1A1A]">
                        Up to {cr.maxGuests} guests
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#5A5A5A]">
                      Selected Rate ({occupancy} · {mealPlan})
                    </td>
                    {comparedRooms.map((cr) => {
                      const price =
                        occupancy === 'Single'
                          ? cr.rates.single[mealPlan]
                          : cr.rates.double[mealPlan];
                      return (
                        <td key={cr.id} className="py-2.5 px-4 price-tabular font-bold text-[#8A5A12]">
                          ₹{price.toLocaleString('en-IN')} / night
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#5A5A5A]">Top Amenities</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4 text-xs text-[#454545]">
                        {cr.highlights.join(' · ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 text-[#5A5A5A]">Action</td>
                    {comparedRooms.map((cr) => (
                      <td key={cr.id} className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => openModalForRoom(cr)}
                          className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg hover:bg-[#2E2E2E]"
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

        {/* 3-Column Room Card Grid (Clean images, image slider, no watermark overlap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredRooms.map((room) => {
            const displayPrice =
              occupancy === 'Single'
                ? room.rates.single[mealPlan]
                : room.rates.double[mealPlan];
            const isComparing = compareIds.includes(room.id);
            const currentImgIdx = cardPhotoIdx[room.id] || 0;
            const currentImg = room.images[currentImgIdx] || room.image;

            return (
              <article
                key={room.id}
                className="bg-white border border-[#E5DFD3] hover:border-[#8A5A12] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs transition-all duration-150 hover:-translate-y-0.5"
              >
                <div>
                  {/* Room Image Slider with clean bottom gradient only */}
                  <div className="aspect-[4/3] bg-[#EFEAE1] overflow-hidden relative group">
                    <SafeImage
                      src={currentImg}
                      alt={`${room.title} at Hotel Satya International, Waidhan`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                    {/* Slider Prev/Next Controls */}
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
                          className="w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80"
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
                          className="w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/80"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Clean Bottom Gradient Label Only (No overlapping watermarks) */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 py-3 flex items-center justify-between text-xs text-white">
                      <span>
                        {room.sizeSqFt} · {room.bedType}
                      </span>
                      <span>Up to {room.maxGuests} Guests</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A5A5A] mb-1.5">
                      <span>{room.tier} Category</span>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-[#4A4A4A] hover:text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={isComparing}
                          onChange={() => toggleCompare(room.id)}
                          className="accent-[#8A5A12] rounded"
                        />
                        <span>+ Compare</span>
                      </label>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#1A1A1A] mb-1.5">
                      {lang === 'hi' ? room.titleHi : room.title}
                    </h3>
                    <p className="text-sm text-[#454545] leading-relaxed mb-4">
                      {room.description}
                    </p>

                    {/* Top 4 Amenities with Check Icons */}
                    <ul className="space-y-1.5 border-t border-[#EFECE6] pt-3.5">
                      {room.highlights.slice(0, 4).map((amen) => (
                        <li key={amen} className="flex items-center gap-2 text-xs text-[#454545]">
                          <Check className="w-3.5 h-3.5 text-[#8A5A12] shrink-0" aria-hidden="true" />
                          <span>{amen}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Dual Action Footer ("View Details" + "Reserve Room") */}
                <div className="px-6 py-4 border-t border-[#E5DFD3] bg-[#FAF8F4] flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-[#5A5A5A]">From </span>
                      <span className="price-tabular text-xl font-bold text-[#1A1A1A]">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#5A5A5A]"> / night</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#8A5A12]">
                      {occupancy} · {mealPlan} Plan
                    </span>
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
                      className="px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#D8CFC0] rounded-xl hover:border-[#8A5A12] transition-colors whitespace-nowrap"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalForRoom(room)}
                      className="px-3 py-2.5 text-xs font-semibold text-white bg-[#1A1A1A] rounded-xl hover:bg-[#2E2E2E] transition-colors whitespace-nowrap"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Integrated Guest Reservations & Front-Desk Portal */}
        <div className="mt-14 bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5DFD3]">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#1A1A1A]">
                {isAdmin ? 'Front-Desk Reservation Ledger' : 'My Reservations & Check-In Status'}
              </h3>
              <p className="text-sm text-[#5A5A5A] mt-0.5">
                {user
                  ? `Signed in as ${user.displayName || user.email}${isAdmin ? ' (Front-Desk Admin)' : ''}`
                  : 'Optional: Sign in with Google to track your saved bookings online, or book directly via WhatsApp & Email.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1A1A1A] border border-[#D8CFC0] rounded-xl hover:bg-[#F2EDE4] whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#8A5A12] rounded-xl hover:bg-[#72490D] whitespace-nowrap shrink-0"
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
                  <tr className="border-b border-[#E5DFD3] text-xs text-[#5A5A5A]">
                    <th className="py-3 pr-4 font-semibold">Reference</th>
                    <th className="py-3 pr-4 font-semibold">Room & Plan</th>
                    <th className="py-3 pr-4 font-semibold">Dates</th>
                    <th className="py-3 pr-4 font-semibold">Total</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD3]">
                  {bookings.map((bk) => (
                    <tr key={bk.bookingId}>
                      <td className="py-3.5 pr-4 price-tabular text-xs font-bold text-[#1A1A1A]">
                        {bk.bookingId}
                        {isAdmin && (
                          <span className="block font-normal text-[#5A5A5A] mt-0.5">
                            {bk.guestName} · {bk.guestPhone}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-medium text-[#1A1A1A]">{bk.roomTitle}</span>
                        <span className="block text-xs text-[#5A5A5A]">
                          {bk.occupancy} · {bk.mealPlan} · {bk.nights} night(s)
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 price-tabular text-xs text-[#454545]">
                        {bk.checkInDate} → {bk.checkOutDate}
                      </td>
                      <td className="py-3.5 pr-4 price-tabular font-bold text-[#1A1A1A]">
                        ₹{bk.totalInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-semibold capitalize">
                        {bk.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[#1D4E3E]">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Confirmed
                          </span>
                        )}
                        {bk.status === 'pending' && (
                          <span className="text-[#8A5A12]">Pending Confirmation</span>
                        )}
                        {bk.status === 'cancelled' && (
                          <span className="text-[#6B6E73]">Cancelled</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                        {isAdmin && bk.status !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => adminUpdateBookingStatus(bk.bookingId, 'confirmed')}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#1D4E3E] text-white rounded-lg hover:bg-[#163D30]"
                          >
                            Confirm
                          </button>
                        )}
                        {bk.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(bk.bookingId)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] border border-[#D8CFC0] rounded-lg hover:bg-[#F2EDE4]"
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
            className="max-w-4xl w-full bg-[#FAF8F4] rounded-2xl overflow-hidden border border-[#E5DFD3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5DFD3]">
              <p className="text-sm font-semibold text-[#1A1A1A]">{lightboxImage.title}</p>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Close lightbox"
                className="p-1.5 rounded-lg hover:bg-[#F2EDE4]"
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

      {/* SECTION 4 — 6-STEP ROOM BOOKING REQUEST MODAL */}
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

            {/* 6-Step Journey Indicator */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#525854] pb-4 mb-5 border-b border-[#E9E2D5]">
              <span className="font-semibold text-[#183D32]">1. Dates & Guests</span>
              <span>→</span>
              <span className="font-semibold text-[#183D32]">2. Room Selected</span>
              <span>→</span>
              <span className="font-semibold text-[#183D32]">3. Meal Plan ({mealPlan})</span>
              <span>→</span>
              <span className={!confirmedBooking ? 'font-bold text-[#191D1B] underline' : 'font-semibold text-[#183D32]'}>
                4–5. Guest Details & Review
              </span>
              <span>→</span>
              <span className={confirmedBooking ? 'font-bold text-[#183D32] underline' : ''}>
                6. Enquiry Reference
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
                  Thank you, <strong>{guestName}</strong>. Please note this reference is a{' '}
                  <strong>booking request</strong> and not an automated room lock. To finalize room availability and receive confirmation from our 24×7 Waidhan Front Office, please send your enquiry via WhatsApp or Email below:
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
                      Occupancy
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
                        Single Occupancy (₹{modalRoom.rates.single[mealPlan].toLocaleString('en-IN')}/night)
                      </option>
                      <option value="Double">
                        Double Occupancy (₹{modalRoom.rates.double[mealPlan].toLocaleString('en-IN')}/night)
                      </option>
                      <option value="ExtraBed">
                        Double + Extra Bed (+₹{BOOKING_CONFIG.extraBedChargePerNight}/night)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Meal Plan
                    </label>
                    <select
                      value={mealPlan}
                      onChange={(e) => onChangeMealPlan(e.target.value as MealPlanCode)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E9E2D5] rounded-lg"
                    >
                      {MEAL_PLANS.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.label} (+₹{m.surchargePerNight}/night)
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
                    <span>Corporate / B2B GST Booking (Request Tax Invoice for Company)</span>
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
                          Company 15-Digit GSTIN
                        </label>
                        <input
                          type="text"
                          value={gstinNumber}
                          maxLength={15}
                          onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                          placeholder="23AAAAA0000A1Z5"
                          className="w-full px-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Transparent Payment Policy (No fabricated online payment flow) */}
                <div className="bg-white border border-[#E9E2D5] rounded-xl p-3.5 text-xs text-[#525854]">
                  <p className="font-semibold text-[#191D1B] mb-1">
                    No Advance Online Payment Required to Submit Enquiry
                  </p>
                  <p>
                    Your enquiry will be reviewed by our 24×7 Waidhan Reception. Payment is collected at the hotel upon check-in or after formal reservation confirmation (Cash, Credit/Debit Card, UPI, or Corporate NEFT).
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
                      ₹{grandTotalInr.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-[#525854] price-tabular">
                      Estimated for {nights}N × {roomsCount}R · {occupancy} · {mealPlan} · Incl. {gstPercent}% GST (₹{gstAmount.toLocaleString('en-IN')})
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
