import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import {
  HOTEL_INFO,
  BOOKING_CONFIG,
  Language,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { buildWhatsAppUrl, buildMailtoUrl, trackEvent } from '../lib/analytics';

const DEFAULT_WHATSAPP_GREETING =
  'Namaste Hotel Satya International, I would like to inquire about direct room availability and tariffs in Waidhan.';
const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Hotel+Satya+International/@24.072285,82.6206458,17z';

interface FooterProps {
  lang: Language;
  onBookStay: () => void;
}

export function Footer({ lang, onBookStay }: FooterProps) {
  const t = UI_TRANSLATIONS[lang];

  // Section 13 Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Room Reservation / Tariff Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Legal Modals (Privacy Policy / Terms)
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Cookie Consent Banner
  const [cookieAccepted, setCookieAccepted] = useState<boolean>(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('satya_cookie_consent_v1');
      if (!saved) setCookieAccepted(false);
    } catch {
      setCookieAccepted(true);
    }
  }, []);

  const handleAcceptCookie = () => {
    try {
      localStorage.setItem('satya_cookie_consent_v1', 'accepted');
    } catch {
      // ignore storage errors
    }
    setCookieAccepted(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('whatsapp_click', { source: 'contact_form_submit', subject: contactSubject });

    const text = [
      `Namaste Hotel Satya International Reception Desk,`,
      ``,
      `New Website Contact Inquiry:`,
      `• Name: ${contactName}`,
      `• Phone: ${contactPhone}`,
      `• Email: ${contactEmail || 'Not provided'}`,
      `• Subject: ${contactSubject}`,
      `• Message: ${contactMessage}`,
    ].join('\n');

    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
    setContactSubmitted(true);
  };

  const handleContactEmailFallback = () => {
    const body = [
      `Name: ${contactName}`,
      `Phone: ${contactPhone}`,
      `Email: ${contactEmail}`,
      `Subject: ${contactSubject}`,
      ``,
      contactMessage,
    ].join('\n');
    window.location.href = buildMailtoUrl(
      `[Website Inquiry] ${contactSubject} - ${contactName || 'Guest'}`,
      body
    );
  };

  return (
    <>
      {/* SECTION 13 — 24×7 CONTACT FORM & RECEPTION DESK */}
      <section id="contact" className="py-20 lg:py-24 bg-[#FAF8F4] border-b border-[#E5DEC9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: Direct Reception Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8A5A12] font-semibold mb-3">
                  <Phone className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi'
                      ? '२४×७ फ्रंट ऑफिस और रिसेप्शन डेस्क'
                      : '24×7 Front Office & Direct Reservations'}
                  </span>
                </div>
                <h2
                  className="font-serif text-[#1A1A1A] font-medium leading-[1.12] mb-3"
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
                >
                  {t.sections.contactTitle}
                </h2>
                <p className="text-sm text-[#5C564D] leading-relaxed">
                  Speak directly with our 24×7 Front Office in Waidhan for immediate room allocation, corporate GST billing, Sharda table reservations, or marriage lawn dates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#D9A74A] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#8A5A12] font-bold">
                      24×7 Front Desk & Reservations
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      {HOTEL_INFO.phones.map((phone: string) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          onClick={() => trackEvent('call_click', { phone, section: 'contact' })}
                          className="price-tabular text-base font-bold text-[#1A1A1A] hover:text-[#8A5A12] transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E5DEC9]">
                  <div className="w-10 h-10 rounded-xl bg-[#2F6B48] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#2F6B48] font-bold">
                      Instant WhatsApp Concierge
                    </div>
                    <p className="text-xs text-[#5C564D] mt-0.5 mb-2">
                      Fastest response for room availability, tariff sheets, and cake orders.
                    </p>
                    <a
                      href={buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('whatsapp_click', { section: 'contact_card' })}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.13em] font-bold text-[#2F6B48] hover:underline"
                    >
                      <span>Chat on WhatsApp (+91-9009284982)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E5DEC9]">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-[#8A5A12] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#8A5A12] font-bold">
                      Official Reservation & Corporate Desk Email
                    </div>
                    <a
                      href={`mailto:${HOTEL_INFO.email}`}
                      className="text-sm font-semibold text-[#1A1A1A] hover:text-[#8A5A12] break-all block mt-0.5"
                    >
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E5DEC9]">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-[#8A5A12] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#8A5A12] font-bold">
                      Working Hours & Address
                    </div>
                    <p className="text-xs text-[#1A1A1A] font-semibold mt-0.5">
                      24×7 Reception & Travel Desk · Check-in {HOTEL_INFO.checkInTime} / Check-out {HOTEL_INFO.checkOutTime}
                    </p>
                    <p className="text-xs text-[#5C564D] mt-0.5">{HOTEL_INFO.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Direct Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5DEC9] shadow-sm">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8A5A12] font-bold block mb-1">
                  Direct Reception Message
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-medium mb-2">
                  Send a Message to Our Front Office
                </h3>
                <p className="text-xs text-[#5C564D] mb-6">
                  Submits directly to our Reservation Desk via WhatsApp or Email with zero middlemen.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                        Inquiry Type
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-sm text-[#1A1A1A] font-medium"
                      >
                        <option value="Room Reservation / Tariff Inquiry">
                          Room Reservation / Tariff Inquiry
                        </option>
                        <option value="Corporate Empanelment / GST Billing">
                          Corporate Empanelment / GST Billing
                        </option>
                        <option value="Wedding Lawn / Banquet Hall Booking">
                          Wedding Lawn / Banquet Hall Booking
                        </option>
                        <option value="Sharda Restaurant / Custom Bakery Order">
                          Sharda Restaurant / Custom Bakery Order
                        </option>
                        <option value="Station / Airport Cab Transfer">
                          Station / Airport Cab Transfer
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                      Message / Dates / Special Requests *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your check-in dates, number of guests, company name, or event details..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1A1A] text-[#FAF8F4] hover:bg-[#8A5A12] text-xs uppercase tracking-[0.15em] font-semibold transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#D9A74A]" />
                      <span>Send via WhatsApp Desk</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleContactEmailFallback}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#F3EFE6] text-[#1A1A1A] hover:bg-[#E5DEC9] border border-[#D8D0BE] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-[#8A5A12]" />
                      <span>Send via Email</span>
                    </button>
                  </div>

                  {contactSubmitted && (
                    <div className="p-3.5 rounded-xl bg-[#2F6B48]/10 border border-[#2F6B48]/30 text-xs text-[#2F6B48] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Your inquiry has been formatted for our reception desk. If WhatsApp did not open automatically, please call +91-7805-350217.
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <footer className="bg-[#1A1A1A] text-[#FAF8F4] border-t border-[#2E2B26] pb-20 lg:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#FAF8F4]/15">
            {/* Brand Identity */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D9A74A] font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Est. 2011 · 3-Star Classified Luxury Hotel</span>
              </div>
              <h3 className="font-serif text-3xl text-[#FAF8F4] font-medium mb-3">
                {HOTEL_INFO.name}
              </h3>
              <p className="text-sm text-[#FAF8F4]/70 leading-relaxed mb-5">
                {HOTEL_INFO.tagline} Serving corporate leaders from NTPC, Reliance, NCL, Hindalco, and celebrating families across the Singrauli power corridor.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F4]/5 border border-[#FAF8F4]/15 text-xs text-[#FAF8F4]/85">
                <FileText className="w-3.5 h-3.5 text-[#D9A74A]" />
                <span>GSTIN:</span>
                <span className="price-tabular font-bold text-[#D9A74A]">
                  {BOOKING_CONFIG.gstinPlaceholder}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#D9A74A] font-semibold mb-4">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-[#FAF8F4]/80">
                <li>
                  <a href="#accommodations" className="hover:text-[#D9A74A] transition-colors">
                    7 Room & Suite Tiers (₹2,000 – ₹9,000)
                  </a>
                </li>
                <li>
                  <a href="#dining-events" className="hover:text-[#D9A74A] transition-colors">
                    Sharda Multi-Cuisine Restaurant & Bakery
                  </a>
                </li>
                <li>
                  <a href="#dining-events" className="hover:text-[#D9A74A] transition-colors">
                    Blue Diamond Colonial Bar & Lounge
                  </a>
                </li>
                <li>
                  <a href="#banquets" className="hover:text-[#D9A74A] transition-colors">
                    3,000-Guest Lawns & Conference Halls
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-[#D9A74A] transition-colors">
                    Swimming Pool & 16 Facilities
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-[#D9A74A] transition-colors">
                    Verified Photo Gallery
                  </a>
                </li>
                <li>
                  <a href="#policies-faq" className="hover:text-[#D9A74A] transition-colors">
                    Guest Policies & 14 FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Reception */}
            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#D9A74A] font-semibold mb-4">
                24×7 Reception & Address
              </h4>
              <div className="space-y-3 text-sm text-[#FAF8F4]/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D9A74A] shrink-0 mt-1" />
                  <span>{HOTEL_INFO.address}</span>
                </div>
                {HOTEL_INFO.phones.map((phone: string) => (
                  <div key={phone} className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D9A74A] shrink-0" />
                    <a
                      href={`tel:${phone}`}
                      className="price-tabular font-semibold hover:text-[#D9A74A] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D9A74A] shrink-0" />
                  <a
                    href={`mailto:${HOTEL_INFO.email}`}
                    className="hover:text-[#D9A74A] transition-colors break-all"
                  >
                    {HOTEL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Policies & Direct Booking Assurance */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#D9A74A] font-semibold mb-4">
                Policies & Legal
              </h4>
              <ul className="space-y-2.5 text-xs text-[#FAF8F4]/75 mb-5">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-[#D9A74A] underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('terms')}
                    className="hover:text-[#D9A74A] underline cursor-pointer"
                  >
                    Terms & Cancellation Policy
                  </button>
                </li>
                <li>
                  <a
                    href={GOOGLE_MAPS_PLACE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#D9A74A] underline"
                  >
                    <span>Google Maps Listing</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>

              <div className="p-3.5 rounded-xl bg-[#FAF8F4]/5 border border-[#FAF8F4]/15 text-[11px] text-[#FAF8F4]/80 leading-relaxed">
                <strong className="text-[#D9A74A] block mb-0.5">
                  Designed for Direct Bookings
                </strong>
                Zero OTA commission markup. Instant room confirmation & GST invoice at check-out.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F4]/55">
            <p>
              © {new Date().getFullYear()} {HOTEL_INFO.name}, Waidhan, Singrauli (M.P.). All Rights Reserved.
            </p>
            <p>
              Designed for Direct Bookings · Official Hospitality Portal · GPS: 24.072285, 82.6206458
            </p>
          </div>
        </div>
      </footer>

      {/* DESKTOP FLOATING ACTION BUTTONS (Bottom-Right) */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col gap-2.5">
        <a
          href={buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'floating_desktop' })}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2F6B48] text-white shadow-lg hover:bg-[#245538] transition-all text-xs font-bold uppercase tracking-[0.12em]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Desk</span>
        </a>
        <a
          href={`tel:${HOTEL_INFO.phones[0]}`}
          onClick={() => trackEvent('call_click', { location: 'floating_desktop' })}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1A1A1A] text-[#FAF8F4] border border-[#D9A74A]/40 shadow-lg hover:bg-[#8A5A12] transition-all text-xs font-bold uppercase tracking-[0.12em]"
        >
          <Phone className="w-4 h-4 text-[#D9A74A]" />
          <span className="price-tabular">{HOTEL_INFO.phones[0]}</span>
        </a>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Call | WhatsApp | Book Now) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1A1A1A] text-[#FAF8F4] border-t border-[#2E2B26] px-3 py-2 shadow-2xl">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <a
            href={`tel:${HOTEL_INFO.phones[0]}`}
            onClick={() => trackEvent('call_click', { location: 'mobile_sticky_bar' })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#FAF8F4]/10 text-[#FAF8F4] text-xs font-bold uppercase tracking-wider"
          >
            <Phone className="w-3.5 h-3.5 text-[#D9A74A]" />
            <span>Call</span>
          </a>
          <a
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'mobile_sticky_bar' })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#2F6B48] text-white text-xs font-bold uppercase tracking-wider"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              trackEvent('book_stay_click', { location: 'mobile_sticky_bar' });
              onBookStay();
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#8A5A12] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>

      {/* COOKIE CONSENT BANNER */}
      {!cookieAccepted && (
        <div className="fixed bottom-16 lg:bottom-6 left-4 right-4 lg:left-6 lg:right-auto lg:max-w-md z-40 p-4 rounded-2xl bg-[#1A1A1A] text-[#FAF8F4] border border-[#D9A74A]/30 shadow-2xl flex items-center justify-between gap-4">
          <p className="text-xs text-[#FAF8F4]/85 leading-relaxed">
            We use essential cookies to remember your selected room & meal plan preferences for direct booking.
          </p>
          <button
            type="button"
            onClick={handleAcceptCookie}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-[#8A5A12] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#A66E18] cursor-pointer"
          >
            Got It
          </button>
        </div>
      )}

      {/* PRIVACY POLICY & TERMS MODAL */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F3EFE6] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E5DEC9] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#8A5A12] font-bold block mb-1">
              Hotel Satya International · Waidhan, Singrauli
            </span>
            <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium mb-4">
              {legalModal === 'privacy'
                ? 'Guest Privacy & Data Protection Policy'
                : 'Reservation Terms, GST & Cancellation Policy'}
            </h3>
            {legalModal === 'privacy' ? (
              <div className="space-y-3 text-xs text-[#5C564D] leading-relaxed">
                <p>
                  <strong className="text-[#1A1A1A]">1. Direct Booking Data:</strong> Guest names, phone numbers, email addresses, and corporate GST details submitted on this website are used solely by Hotel Satya International Front Office for room allocation, cab transfers, and invoicing.
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">2. Government ID Verification:</strong> As mandated by Ministry of Home Affairs / Madhya Pradesh regulations, all checking-in guests must present valid original Government photo identification (Aadhaar, Passport, Driving Licence, or Voter ID) at reception.
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">3. Zero Third-Party Sale:</strong> We never sell or rent guest contact information to external marketing agencies or unauthorized third parties.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#5C564D] leading-relaxed">
                <p>
                  <strong className="text-[#1A1A1A]">1. Check-In & Check-Out:</strong> Standard check-in time is {HOTEL_INFO.checkInTime} and check-out time is {HOTEL_INFO.checkOutTime}. Early check-in is complimentary for direct bookings subject to room availability.
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">2. GST Compliance:</strong> Published tariffs are exclusive of applicable Government GST (12% for room tariffs up to ₹7,500/night; 18% for room tariffs above ₹7,500/night). Corporate guests requiring B2B GST input credit must provide their valid 15-digit GSTIN prior to check-out invoice generation.
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">3. Cancellation & Amendments:</strong> Direct bookings enjoy free cancellation up to 24 hours before standard check-in time. Cancellations within 24 hours or no-shows may attract a one-night retention charge.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
