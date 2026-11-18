import { useState } from 'react';
import {
  Cake,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  ShieldAlert,
  Utensils,
} from 'lucide-react';
import {
  BANQUET_IMAGE,
  BANQUET_PACKAGES,
  DINING_AND_BAR,
  EVENT_VENUES,
  Language,
  SHARDA_TABBED_MENU,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { useFirebase } from '../contexts/FirebaseContext';
import { buildMailtoUrl, buildWhatsAppUrl, trackEvent } from '../lib/analytics';
import { SafeImage } from './SafeImage';

interface DiningAndEventsSectionProps {
  lang: Language;
}

const MENU_TABS = Object.keys(SHARDA_TABBED_MENU);

export function DiningAndEventsSection({ lang }: DiningAndEventsSectionProps) {
  const { user, createInquiry, inquiries } = useFirebase();
  const t = UI_TRANSLATIONS[lang];

  // Section 5 State: Tabbed Menu & Reserve Table / Custom Cake Mini-Form
  const [activeMenuTab, setActiveMenuTab] = useState(MENU_TABS[0]);
  const [tableGuestName, setTableGuestName] = useState('');
  const [tablePhone, setTablePhone] = useState('');
  const [tableRequestType, setTableRequestType] = useState<
    'Table at Sharda Restaurant' | 'Custom Bakery / Anniversary Cake' | 'Blue Diamond Bar Lounge Table'
  >('Table at Sharda Restaurant');
  const [tableDate, setTableDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState('20:00');
  const [tableGuests, setTableGuests] = useState(4);
  const [tableNote, setTableNote] = useState('');

  // Section 6 State: Banquet & Event Inquiry Form
  const [contactName, setContactName] = useState(user?.displayName || '');
  const [contactPhone, setContactPhone] = useState('');
  const [eventType, setEventType] = useState<
    'Wedding & Reception' | 'Engagement / Ring Ceremony' | 'Corporate Seminar / AGM' | 'Birthday / Private Gala'
  >('Wedding & Reception');
  const [venue, setVenue] = useState<
    | 'Open-Air Lawn (3000 Pax)'
    | 'Grand Banquet Hall (200 Pax)'
    | 'Party Room (40 Pax)'
    | 'Executive Meeting Room (20 Pax)'
  >('Open-Air Lawn (3000 Pax)');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState(300);
  const [budgetRange, setBudgetRange] = useState('₹2,00,000 – ₹5,00,000 [Flexible]');
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

  const handleDownloadMenuText = () => {
    const lines: string[] = [
      'HOTEL SATYA INTERNATIONAL — SHARDA MULTI-CUISINE RESTAURANT & EUROPEAN BAKERY',
      'Main Road, Belaunji, Waidhan, Singrauli (M.P.) | Ph: +91-7805-350217',
      '=========================================================================',
      '',
    ];
    for (const [cat, items] of Object.entries(SHARDA_TABBED_MENU)) {
      lines.push(`--- ${cat.toUpperCase()} ---`);
      for (const item of items) {
        lines.push(
          `[${item.isVeg ? 'VEG' : 'NON-VEG'}] ${item.name} — ${item.priceInr}\n    ${item.description}`
        );
      }
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sharda-Restaurant-Menu-Satya-International.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      const fullNotes = `Event: ${eventType} | Budget: ${budgetRange} | ${notes.trim()}`;

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

      const summary = `Namaste Hotel Satya International (Banquets & Lawns),\nNew Event Enquiry [${inquiryId}]:\n• Contact: ${finalName} (${contactPhone.trim()})\n• Event Type: ${eventType}\n• Preferred Venue: ${venue}\n• Event Date: ${eventDate}\n• Expected Guests: ${guestCount} Pax\n• Budget Range: ${budgetRange}\n${notes.trim() ? `• Requirements: ${notes.trim()}` : ''}`;

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
          SECTION 5 — DINING (SHARDA RESTAURANT, EUROPEAN BAKERY & BLUE DIAMOND BAR)
          ===================================================================== */}
      <section
        id="dining-events"
        className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#F3EFE8] scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
                Section 5 · Gastronomy, Custom Bakery & Colonial Lounge
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
                {t.sections.diningTitle}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleDownloadMenuText}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D8CFC0] hover:border-[#8A5A12] rounded-xl text-xs font-semibold text-[#1A1A1A] transition-colors shrink-0"
            >
              <FileText className="w-4 h-4 text-[#8A5A12]" aria-hidden="true" />
              Download Printable Menu
            </button>
          </div>

          {/* 2-Card Showcase: Sharda Restaurant & Blue Diamond Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Sharda Multi-Cuisine Restaurant & European Bakery */}
            <article className="lg:col-span-7 bg-white border border-[#E5DFD3] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <div className="aspect-[16/9] bg-[#E5DFD3] overflow-hidden relative">
                  <SafeImage
                    src={DINING_AND_BAR.restaurant.image}
                    alt="Sharda Multi-Cuisine Restaurant at Hotel Satya International, Waidhan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
                    <p className="text-xs font-medium text-white/90">
                      {DINING_AND_BAR.restaurant.hours} · Seating: {DINING_AND_BAR.restaurant.seatingCapacity}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-0.5">
                      {DINING_AND_BAR.restaurant.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold text-[#8A5A12] mb-2">
                    6 Cuisines: {DINING_AND_BAR.restaurant.cuisines.join(' · ')}
                  </p>
                  <p className="text-sm sm:text-base text-[#454545] leading-relaxed mb-6">
                    {DINING_AND_BAR.restaurant.description}
                  </p>

                  {/* Interactive Tabbed Menu with Veg / Non-Veg Indicators */}
                  <div className="border border-[#E5DFD3] rounded-xl overflow-hidden bg-[#FAF8F4]">
                    <div className="p-2 bg-[#F2EDE4] border-b border-[#E5DFD3] flex flex-wrap gap-1.5">
                      {MENU_TABS.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveMenuTab(tab)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                            activeMenuTab === tab
                              ? 'bg-[#1A1A1A] text-white'
                              : 'text-[#4A4A4A] hover:text-[#1A1A1A] bg-white/70'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 divide-y divide-[#EFECE6]">
                      {(SHARDA_TABBED_MENU[activeMenuTab] || []).map((dish) => (
                        <div
                          key={dish.name}
                          className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              {/* Standard Indian FSSAI Veg / Non-Veg Indicator */}
                              <span
                                title={dish.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
                                className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border ${
                                  dish.isVeg ? 'border-emerald-700' : 'border-red-700'
                                } shrink-0`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    dish.isVeg ? 'bg-emerald-700' : 'bg-red-700'
                                  }`}
                                />
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                                {dish.name}
                              </p>
                            </div>
                            <p className="text-xs text-[#5A5A5A] mt-0.5 pl-6">
                              {dish.description}
                            </p>
                          </div>
                          <span className="price-tabular text-xs font-bold text-[#8A5A12] whitespace-nowrap shrink-0">
                            {dish.priceInr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#FAF8F4] border-t border-[#E5DFD3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A4A4A]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#1A1A1A]">
                  <Utensils className="w-3.5 h-3.5 text-[#8A5A12]" />
                  24-Hour In-Room Dining Available
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#8A5A12] font-semibold">
                  <Cake className="w-3.5 h-3.5" />
                  100% Original European Custom Cakes on Pre-Order
                </span>
              </div>
            </article>

            {/* Blue Diamond Colonial Bar + Reserve Table / Custom Cake WhatsApp Form */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <article className="bg-white border border-[#E5DFD3] rounded-2xl overflow-hidden shadow-xs">
                <div className="aspect-[16/9] bg-[#E5DFD3] overflow-hidden relative">
                  <SafeImage
                    src={DINING_AND_BAR.bar.image}
                    alt="Blue Diamond colonial-style bar at Hotel Satya International"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
                    <p className="text-xs text-white/90">{DINING_AND_BAR.bar.hours}</p>
                    <h3 className="font-display text-2xl font-semibold mt-0.5">
                      {DINING_AND_BAR.bar.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-[#454545] leading-relaxed">
                    {DINING_AND_BAR.bar.description}
                  </p>
                  <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E5DFD3] flex items-center gap-2.5 text-xs text-[#4A4A4A]">
                    <ShieldAlert className="w-4 h-4 text-[#8A5A12] shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-[#1A1A1A]">
                      {DINING_AND_BAR.bar.agePolicy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#EFECE6] text-xs">
                    <span className="text-[#5A5A5A]">Direct Bar Desk:</span>
                    <a
                      href={`tel:${DINING_AND_BAR.bar.phone}`}
                      className="price-tabular font-bold text-[#1A1A1A] hover:text-[#8A5A12] inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8A5A12]" />
                      {DINING_AND_BAR.bar.phone}
                    </a>
                  </div>
                </div>
              </article>

              {/* Reserve a Table / Order Custom Bakery Cake Mini-Form -> WhatsApp */}
              <form
                onSubmit={handleReserveTableWhatsApp}
                className="bg-white border border-[#E5DFD3] rounded-2xl p-6 space-y-3.5 shadow-xs"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A12]">
                    Instant Dining & Bakery Desk
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#1A1A1A]">
                    Reserve a Table or Order Custom Cake
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                    Reservation / Order Type
                  </label>
                  <select
                    value={tableRequestType}
                    onChange={(e) => setTableRequestType(e.target.value as typeof tableRequestType)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                  >
                    <option value="Table at Sharda Restaurant">
                      Reserve Family / Executive Table at Sharda Restaurant
                    </option>
                    <option value="Custom Bakery / Anniversary Cake">
                      Pre-Order Custom Birthday / Anniversary / Wedding Cake
                    </option>
                    <option value="Blue Diamond Bar Lounge Table">
                      Reserve Lounge Table at Blue Diamond Bar (21+)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={tableGuestName}
                      onChange={(e) => setTableGuestName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={tablePhone}
                      onChange={(e) => setTablePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Date</label>
                    <input
                      type="date"
                      value={tableDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setTableDate(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Time</label>
                    <input
                      type="time"
                      value={tableTime}
                      onChange={(e) => setTableTime(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={tableGuests}
                      onChange={(e) => setTableGuests(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl price-tabular"
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
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs sm:text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#D9A74A]" />
                  Reserve via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6 — BANQUETS, 3,000-GUEST LAWNS & EVENTS
          ===================================================================== */}
      <section
        id="banquets"
        className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#FAF8F4] scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
              Section 6 · Banquets, Lawns & Conferences
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
              {t.sections.banquetsTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#454545] mt-2 leading-relaxed">
              From 3,000-guest grand weddings on our manicured Open-Air Lawn to 200-delegate corporate seminars in our pillarless Grand Banquet Hall—complete with Sharda catering, panelled decorators, 100% DG power backup, and gated coach parking.
            </p>
          </div>

          {/* 4 Venue Capacity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_VENUES.map((v, idx) => {
              const isSelected = venue === v.name;
              return (
                <article
                  key={v.id}
                  onClick={() => setVenue(v.name as typeof venue)}
                  className={`cursor-pointer bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#8A5A12] ring-1 ring-[#8A5A12]'
                      : 'border-[#E5DFD3] hover:border-[#8A5A12]'
                  }`}
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#EFEAE1] overflow-hidden relative">
                      <SafeImage
                        src={v.image || BANQUET_IMAGE}
                        alt={v.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3.5 py-2 text-white flex items-center justify-between text-xs">
                        <span className="font-bold price-tabular">{v.capacity}</span>
                        <span className="text-white/80 text-[11px]">{v.areaSqFt}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-bold text-[#8A5A12] mb-1">
                        0{idx + 1} · {v.idealFor}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-1.5">
                        {v.name}
                      </h3>
                      <p className="text-xs text-[#5A5A5A] leading-relaxed">{v.description}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-[#FAF8F4] border-t border-[#E5DFD3] text-xs font-semibold text-[#8A5A12]">
                    {isSelected ? 'Selected in Enquiry Form ✓' : 'Click to Select Venue →'}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Packages + Event Enquiry Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Wedding Package & Corporate Meeting Package Cards */}
            <div className="lg:col-span-7 space-y-6">
              {BANQUET_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-7 shadow-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#8A5A12] uppercase tracking-wider">
                      Curated Event Package
                    </span>
                    <span className="price-tabular text-xs font-bold text-[#1D4E3E]">
                      {pkg.priceNote}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[#5A5A5A] mb-4">{pkg.subtitle}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-xs text-[#333333]">
                        <Check className="w-3.5 h-3.5 text-[#8A5A12] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right: Event Enquiry Form -> WhatsApp + Email */}
            <div className="lg:col-span-5 bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A12] mb-1">
                Weddings, Receptions & Seminars
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
                Request Banquet & Lawn Quote
              </h3>
              <p className="text-xs text-[#5A5A5A] mb-5">
                Check date availability and receive a customized catering & room-block proposal via WhatsApp or Email.
              </p>

              {eventConfirmation ? (
                <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#E5DFD3] space-y-4">
                  <div className="flex items-center gap-2 text-[#1D4E3E] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Event Enquiry Ready ({eventConfirmation.id})</span>
                  </div>
                  <p className="text-xs text-[#454545] leading-relaxed">
                    Send your event brief directly to our Banquet Manager on WhatsApp or Email for immediate date locking:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    <a
                      href={eventConfirmation.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1D4E3E] hover:bg-[#163D30] text-white text-xs font-semibold rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Event Enquiry on WhatsApp
                    </a>
                    <a
                      href={eventConfirmation.mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#8A5A12] hover:bg-[#72490D] text-white text-xs font-semibold rounded-xl"
                    >
                      <Mail className="w-4 h-4" />
                      Send via Email
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEventConfirmation(null)}
                    className="text-xs font-semibold text-[#5A5A5A] hover:text-[#1A1A1A]"
                  >
                    Submit Another Event Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEventInquiry} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Event Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as typeof eventType)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      >
                        <option value="Wedding & Reception">Wedding & Reception</option>
                        <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                        <option value="Corporate Seminar / AGM">Corporate Seminar / AGM</option>
                        <option value="Birthday / Private Gala">Birthday / Private Gala</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Preferred Venue
                      </label>
                      <select
                        value={venue}
                        onChange={(e) => setVenue(e.target.value as typeof venue)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
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
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Expected Guests
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={5000}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl price-tabular"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Budget Range
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      >
                        <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                        <option value="₹1,00,000 – ₹2,50,000">₹1,00,000 – ₹2,50,000</option>
                        <option value="₹2,00,000 – ₹5,00,000 [Flexible]">₹2L – ₹5L</option>
                        <option value="₹5,00,000 – ₹15,00,000+ (Grand Wedding)">₹5L – ₹15L+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Catering, Room Block & Decor Message
                    </label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Number of guest rooms needed, veg/non-veg buffet, stage setup, projector..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
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
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    {saving ? 'Preparing Proposal...' : 'Submit Event Enquiry (WhatsApp & Email)'}
                  </button>
                </form>
              )}

              {user && inquiries.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E5DFD3]">
                  <p className="text-xs font-semibold text-[#1A1A1A] mb-2">
                    Your Saved Event Enquiries ({inquiries.length})
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#5A5A5A]">
                    {inquiries.slice(0, 3).map((inq) => (
                      <li key={inq.inquiryId} className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {inq.venue} · {inq.eventDate} ({inq.guestCount} pax)
                        </span>
                        <span className="price-tabular font-semibold text-[#8A5A12] capitalize">
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
