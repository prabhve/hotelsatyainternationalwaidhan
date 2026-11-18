import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Cake,
  Check,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Utensils,
  Wine,
} from 'lucide-react';
import {
  BANQUET_HIGHLIGHTS,
  BANQUET_IMAGE,
  DINING_AND_BAR,
  EVENT_VENUES,
  Language,
  SHARDA_CULINARY_SPECIALTIES,
  UI_TRANSLATIONS,
  VerifiedVenueName,
} from '../data/hotelData';
import { useFirebase } from '../contexts/FirebaseContext';
import { buildMailtoUrl, buildWhatsAppUrl, trackEvent } from '../lib/analytics';
import { SafeImage } from './SafeImage';
import { LUXURY_EASE, LUXURY_SPRING, Reveal } from './MotionPrimitives';

interface DiningAndEventsSectionProps {
  lang: Language;
}

const MENU_TABS = Object.keys(SHARDA_CULINARY_SPECIALTIES);

export function DiningAndEventsSection({ lang }: DiningAndEventsSectionProps) {
  const { user, createInquiry, inquiries } = useFirebase();
  const t = UI_TRANSLATIONS[lang];

  // Dining State: Tabbed Culinary Showcase & Reserve Table / Custom Cake Form
  const [activeMenuTab, setActiveMenuTab] = useState(MENU_TABS[0]);
  const [tableGuestName, setTableGuestName] = useState('');
  const [tablePhone, setTablePhone] = useState('');
  const [tableRequestType, setTableRequestType] = useState<
    'Table at Sharda Restaurant' | 'Custom Bakery / Celebration Cake' | 'Blue Diamond Bar Lounge Table'
  >('Table at Sharda Restaurant');
  const [tableDate, setTableDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState('20:00');
  const [tableGuests, setTableGuests] = useState(4);
  const [tableNote, setTableNote] = useState('');

  // Banquet & Event Inquiry Form State
  const [contactName, setContactName] = useState(user?.displayName || '');
  const [contactPhone, setContactPhone] = useState('');
  const [eventType, setEventType] = useState<
    'Wedding & Reception' | 'Engagement / Ring Ceremony' | 'Corporate Seminar / Conference' | 'Birthday / Family Celebration'
  >('Wedding & Reception');
  const [venue, setVenue] = useState<VerifiedVenueName>(EVENT_VENUES[0].name);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState(300);
  const [cateringPreference, setCateringPreference] = useState('Multi-Cuisine Buffet (Sharda Catering)');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventConfirmation, setEventConfirmation] = useState<{
    id: string;
    whatsappUrl: string;
    mailtoUrl: string;
  } | null>(null);

  const handleReserveTableWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Namaste Hotel Satya International (Sharda Dining & Bakery),\nNew Dining / Cake Request:\n• Type: ${tableRequestType}\n• Guest Name: ${tableGuestName.trim() || 'Guest'}\n• Phone: ${tablePhone.trim()}\n• Date & Time: ${tableDate} at ${tableTime}\n• Party Size: ${tableGuests} Guests\n${tableNote.trim() ? `• Cake / Menu Note: ${tableNote.trim()}` : ''}`;
    trackEvent('table_reserve', { type: tableRequestType, guests: tableGuests });
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const handleRequestMenuWhatsApp = () => {
    const msg =
      'Namaste Hotel Satya International, please share the current Sharda Multi-Cuisine Restaurant menu and custom European Bakery cake options on WhatsApp.';
    trackEvent('whatsapp_click', { source: 'sharda_menu_request' });
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const handleEventInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalName = contactName.trim() || user?.displayName || '';
    if (finalName.length < 2) {
      setError('Please provide your contact name.');
      return;
    }
    if (contactPhone.trim().length < 7) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setSaving(true);
    try {
      let inquiryId = `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const fullNotes = `Event: ${eventType} | Catering: ${cateringPreference} | ${notes.trim()}`;

      if (user) {
        try {
          inquiryId = await createInquiry({
            contactName: finalName,
            contactPhone: contactPhone.trim(),
            venue,
            eventDate,
            guestCount,
            notes: fullNotes.slice(0, 580),
          });
        } catch {
          // Non-blocking fallback when guest is not signed into Firebase
        }
      }

      const summary = `Namaste Hotel Satya International (Banquets & Lawns),\nNew Event Enquiry [${inquiryId}]:\n• Contact: ${finalName} (${contactPhone.trim()})\n• Event Type: ${eventType}\n• Preferred Venue: ${venue}\n• Event Date: ${eventDate}\n• Expected Guests: ${guestCount} Guests\n• Catering Preference: ${cateringPreference}\n${notes.trim() ? `• Requirements: ${notes.trim()}` : ''}`;

      trackEvent('event_inquiry', { venue, guestCount });
      setEventConfirmation({
        id: inquiryId,
        whatsappUrl: buildWhatsAppUrl(summary),
        mailtoUrl: buildMailtoUrl(
          `Banquet / Lawn Enquiry [${inquiryId}] — ${eventType} on ${eventDate}`,
          summary
        ),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit inquiry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* =====================================================================
          DINING — SHARDA RESTAURANT, EUROPEAN BAKERY & BLUE DIAMOND BAR
          ===================================================================== */}
      <section
        id="dining-events"
        className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#EFECE4] scroll-mt-16"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                  {lang === 'hi'
                    ? 'पाक कला, यूरोपियन बेकरी और लाउंज बार'
                    : 'Fine Dining, European-Technology Bakery & Colonial Lounge'}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#191D1B] text-balance">
                  {t.sections.diningTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleRequestMenuWhatsApp}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-xl text-xs font-semibold text-[#191D1B] transition-colors shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#183D32] shrink-0" aria-hidden="true" />
                <span>Request Current Menu & Cake Catalogue on WhatsApp</span>
              </button>
            </div>
          </Reveal>

          {/* 2-Card Showcase: Sharda Restaurant & Blue Diamond Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Sharda Multi-Cuisine Restaurant & European Bakery */}
            <Reveal className="lg:col-span-7 flex min-w-0" delay={0.05}>
              <article className="bg-white border border-[#E9E2D5] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs w-full min-w-0">
                <div>
                  <div className="aspect-[16/9] bg-[#E9E2D5] overflow-hidden relative group">
                    <SafeImage
                      src={DINING_AND_BAR.restaurant.image}
                      alt="Sharda Multi-Cuisine Restaurant at Hotel Satya International, Waidhan"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
                      <p className="text-xs font-medium text-[#C6A66B]">
                        {DINING_AND_BAR.restaurant.serviceNote}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-0.5">
                        {DINING_AND_BAR.restaurant.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 sm:p-8">
                    <p className="text-xs font-semibold text-[#183D32] uppercase tracking-wider mb-2">
                      6 Verified Cuisines: {DINING_AND_BAR.restaurant.cuisines.join(' · ')}
                    </p>
                    <p className="text-sm sm:text-base text-[#525854] leading-relaxed mb-6">
                      {DINING_AND_BAR.restaurant.description}
                    </p>

                    {/* Interactive Culinary Repertoire Tabs */}
                    <div className="border border-[#E9E2D5] rounded-xl overflow-hidden bg-[#F8F6F0]">
                      <div className="p-2 bg-[#EFECE4] border-b border-[#E9E2D5] flex flex-wrap gap-1.5">
                        {MENU_TABS.map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveMenuTab(tab)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                              activeMenuTab === tab
                                ? 'bg-[#183D32] text-white'
                                : 'text-[#525854] hover:text-[#191D1B] bg-white/80'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeMenuTab}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: LUXURY_EASE }}
                          className="p-4 divide-y divide-[#E9E2D5]"
                        >
                          {(SHARDA_CULINARY_SPECIALTIES[activeMenuTab] || []).map((dish) => (
                            <div
                              key={dish.name}
                              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4"
                            >
                              <div className="min-w-0">
                                <div className="flex items-start gap-2">
                                  <span
                                    title={dish.isVeg ? 'Vegetarian Selection' : 'Vegetarian & Non-Vegetarian Options'}
                                    className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border mt-0.5 ${
                                      dish.isVeg ? 'border-emerald-700' : 'border-red-700'
                                    } shrink-0`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        dish.isVeg ? 'bg-emerald-700' : 'bg-red-700'
                                      }`}
                                    />
                                  </span>
                                  <p className="text-xs sm:text-sm font-bold text-[#191D1B] leading-snug">
                                    {dish.name}
                                  </p>
                                </div>
                                <p className="text-xs text-[#525854] mt-1 pl-6 leading-relaxed">
                                  {dish.description}
                                </p>
                              </div>
                              <span className="self-start ml-6 sm:ml-0 text-[11px] font-semibold text-[#183D32] bg-white px-2.5 py-1 rounded-md border border-[#E9E2D5] whitespace-nowrap shrink-0">
                                {dish.cuisineTag}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

              <div className="px-5 sm:px-6 py-4 bg-[#F8F6F0] border-t border-[#E9E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#525854]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#191D1B]">
                  <Utensils className="w-3.5 h-3.5 text-[#183D32] shrink-0" />
                  24-Hour Room Service Available
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#183D32] font-semibold">
                  <Cake className="w-3.5 h-3.5 shrink-0" />
                  100% Original European-Technology Custom Bakery
                </span>
              </div>
              </article>
            </Reveal>

            {/* Blue Diamond Colonial Bar + Reserve Table / Custom Cake WhatsApp Form */}
            <Reveal className="lg:col-span-5 flex flex-col gap-6 min-w-0" delay={0.12}>
              <article className="bg-white border border-[#E9E2D5] rounded-2xl overflow-hidden shadow-xs min-w-0">
                <div className="aspect-[16/9] bg-[#E9E2D5] overflow-hidden relative">
                  <SafeImage
                    src={DINING_AND_BAR.bar.image}
                    alt="Blue Diamond colonial-style bar at Hotel Satya International"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
                    <p className="text-xs text-[#C6A66B] font-semibold">{DINING_AND_BAR.bar.hours}</p>
                    <h3 className="font-display text-2xl font-semibold mt-0.5">
                      {DINING_AND_BAR.bar.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-[#525854] leading-relaxed">
                    {DINING_AND_BAR.bar.description}
                  </p>
                  <div className="p-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] flex items-center gap-2.5 text-xs text-[#525854]">
                    <Wine className="w-4 h-4 text-[#183D32] shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-[#191D1B]">
                      {DINING_AND_BAR.bar.serviceNote}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#EFECE4] text-xs">
                    <span className="text-[#525854]">Direct Bar Mobile:</span>
                    <a
                      href={`tel:${DINING_AND_BAR.bar.phone}`}
                      onClick={() => trackEvent('call_click', { source: 'blue_diamond_bar' })}
                      className="price-tabular font-bold text-[#191D1B] hover:text-[#183D32] inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#183D32]" />
                      {DINING_AND_BAR.bar.phone}
                    </a>
                  </div>
                </div>
              </article>

              {/* Reserve a Table / Order Custom Bakery Cake Form */}
              <form
                onSubmit={handleReserveTableWhatsApp}
                className="bg-white border border-[#E9E2D5] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs min-w-0"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#183D32]">
                    Instant Dining & Bakery Desk
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#191D1B]">
                    Reserve a Table or Order Custom Cake
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#525854] mb-1">
                    Reservation / Order Type
                  </label>
                  <select
                    value={tableRequestType}
                    onChange={(e) => setTableRequestType(e.target.value as typeof tableRequestType)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl text-[#191D1B]"
                  >
                    <option value="Table at Sharda Restaurant">
                      Reserve Table — Sharda Restaurant
                    </option>
                    <option value="Custom Bakery / Celebration Cake">
                      Pre-Order Custom Celebration Cake
                    </option>
                    <option value="Blue Diamond Bar Lounge Table">
                      Reserve Table — Blue Diamond Bar (11 AM – 11 PM)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={tableGuestName}
                      onChange={(e) => setTableGuestName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={tablePhone}
                      onChange={(e) => setTablePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-[#525854] mb-1">Date</label>
                    <input
                      type="date"
                      value={tableDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setTableDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">Time</label>
                    <input
                      type="time"
                      value={tableTime}
                      onChange={(e) => setTableTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={tableGuests}
                      onChange={(e) => setTableGuests(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl price-tabular"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={tableNote}
                    onChange={(e) => setTableNote(e.target.value)}
                    placeholder="Optional: Cake flavor/message on cake or dietary preference..."
                    className="w-full px-3 py-2.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#183D32] hover:bg-[#122E25] text-white text-xs sm:text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#C6A66B]" />
                  Reserve via WhatsApp
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BANQUETS, 3,000-GUEST LAWNS & CONFERENCES
          ===================================================================== */}
      <section
        id="banquets"
        className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0] scroll-mt-16"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                {lang === 'hi'
                  ? 'विवाह लॉन, बैंक्वेट हॉल और कॉन्फ्रेंस वेन्यू'
                  : 'Weddings, Banquets, Lawns & Conferences'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#191D1B] text-balance">
                {t.sections.banquetsTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#525854] mt-2 leading-relaxed">
                From grand 3,000-guest weddings on our expansive Open-Air Lawn to 200-guest conferences in our indoor Banquet Hall, 40-guest celebrations in our Party Room, and 20-delegate board meetings in our Meeting Room.
              </p>
            </div>
          </Reveal>

          {/* 4 Verified Venue Capacity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_VENUES.map((v, idx) => {
              const isSelected = venue === v.name;
              return (
                <motion.article
                  key={v.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: LUXURY_EASE }}
                  onClick={() => setVenue(v.name)}
                  className={`cursor-pointer bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-colors shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#183D32] ring-1 ring-[#183D32]'
                      : 'border-[#E9E2D5] hover:border-[#C6A66B]'
                  }`}
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#EFECE4] overflow-hidden relative group">
                      <SafeImage
                        src={v.image || BANQUET_IMAGE}
                        alt={v.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3.5 py-2 text-white flex items-center justify-between text-xs">
                        <span className="font-bold price-tabular text-[#C6A66B]">{v.capacity}</span>
                        <span className="text-white/85 text-[11px] truncate ml-2">{v.venueType}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-bold text-[#183D32] mb-1">
                        0{idx + 1} · {v.idealFor}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#191D1B] mb-1.5">
                        {v.name}
                      </h3>
                      <p className="text-xs text-[#525854] leading-relaxed">{v.description}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-[#F8F6F0] border-t border-[#E9E2D5] text-xs font-semibold text-[#183D32]">
                    {isSelected ? 'Selected in Enquiry Form ✓' : 'Select Venue for Enquiry →'}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Event Capabilities + Event Enquiry Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Verified Wedding & Corporate Conference Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              {BANQUET_HIGHLIGHTS.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#E9E2D5] rounded-2xl p-6 sm:p-7 shadow-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#183D32] uppercase tracking-wider">
                      Bespoke Event Hospitality
                    </span>
                    <span className="text-xs font-bold text-[#8C6B32]">
                      Tailored Quotation via Reception
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#525854] mb-4">{pkg.subtitle}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-xs text-[#191D1B]">
                        <Check className="w-3.5 h-3.5 text-[#183D32] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right: Event Enquiry Form -> WhatsApp + Email */}
            <div className="lg:col-span-5 bg-white border border-[#E9E2D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#183D32] mb-1">
                Weddings, Receptions & Conferences
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-2">
                Request Venue Availability & Quote
              </h3>
              <p className="text-xs text-[#525854] mb-5">
                Check date availability and receive a customized catering and accommodation proposal from our Banquet Desk.
              </p>

              {eventConfirmation ? (
                <div className="p-5 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] space-y-4">
                  <div className="flex items-center gap-2 text-[#183D32] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Event Enquiry Ready ({eventConfirmation.id})</span>
                  </div>
                  <p className="text-xs text-[#525854] leading-relaxed">
                    Send your event requirements directly to our Banquet Desk on WhatsApp or Email for date availability and quotation:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    <a
                      href={eventConfirmation.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#183D32] hover:bg-[#122E25] text-white text-xs font-semibold rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Event Enquiry on WhatsApp
                    </a>
                    <a
                      href={eventConfirmation.mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#191D1B] hover:bg-[#2E3330] text-white text-xs font-semibold rounded-xl"
                    >
                      <Mail className="w-4 h-4 text-[#C6A66B]" />
                      Send via Email
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEventConfirmation(null)}
                    className="text-xs font-semibold text-[#525854] hover:text-[#191D1B] cursor-pointer"
                  >
                    Submit Another Event Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEventInquiry} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as typeof eventType)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      >
                        <option value="Wedding & Reception">Wedding & Reception</option>
                        <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                        <option value="Corporate Seminar / Conference">Corporate Seminar / Conference</option>
                        <option value="Birthday / Family Celebration">Birthday / Family Celebration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Preferred Venue
                      </label>
                      <select
                        value={venue}
                        onChange={(e) => setVenue(e.target.value as VerifiedVenueName)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      >
                        {EVENT_VENUES.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Expected Guests
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={3000}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-2.5 py-2 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl price-tabular"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Catering
                      </label>
                      <select
                        value={cateringPreference}
                        onChange={(e) => setCateringPreference(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      >
                        <option value="Multi-Cuisine Buffet (Sharda Catering)">
                          Multi-Cuisine Buffet
                        </option>
                        <option value="Pure Vegetarian Feast">Pure Vegetarian Feast</option>
                        <option value="Corporate High-Tea & Working Lunch">
                          Corporate Lunch & High-Tea
                        </option>
                        <option value="Venue + Guest Rooms Package">Venue + Guest Rooms</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Guest Rooms, Custom Cake & Event Notes
                    </label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Number of guest rooms needed, custom wedding cake, seating arrangement..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 bg-[#183D32] hover:bg-[#122E25] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    {saving ? 'Preparing Proposal...' : 'Submit Event Enquiry (WhatsApp & Email)'}
                  </button>
                </form>
              )}

              {user && inquiries.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E9E2D5]">
                  <p className="text-xs font-semibold text-[#191D1B] mb-2">
                    Your Saved Event Enquiries ({inquiries.length})
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#525854]">
                    {inquiries.slice(0, 3).map((inq) => (
                      <li key={inq.inquiryId} className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {inq.venue} · {inq.eventDate} ({inq.guestCount} guests)
                        </span>
                        <span className="price-tabular font-semibold text-[#183D32] capitalize">
                          {inq.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
