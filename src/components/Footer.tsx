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
  Language,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { buildWhatsAppUrl, buildMailtoUrl, trackEvent } from '../lib/analytics';

const DEFAULT_WHATSAPP_GREETING =
  'Namaste Hotel Satya International, I would like to inquire about direct room availability and tariffs in Waidhan.';
const GOOGLE_MAPS_PLACE_URL = HOTEL_INFO.googleMapsUrl;

interface FooterProps {
  lang: Language;
  onBookStay: () => void;
}

export function Footer({ lang, onBookStay }: FooterProps) {
  const t = UI_TRANSLATIONS[lang];

  // Contact Form State
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
      {/* 24×7 CONTACT FORM & RECEPTION DESK */}
      <section id="contact" className="py-20 lg:py-24 bg-[#F8F6F0] border-b border-[#E9E2D5] scroll-mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: Direct Reception Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#183D32] font-semibold mb-3">
                  <Phone className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi'
                      ? '२४×७ फ्रंट ऑफिस और रिसेप्शन डेस्क'
                      : '24×7 Front Office & Direct Reservations'}
                  </span>
                </div>
                <h2
                  className="font-display text-[#191D1B] font-semibold leading-[1.12] mb-3"
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
                >
                  {t.sections.contactTitle}
                </h2>
                <p className="text-sm text-[#525854] leading-relaxed">
                  Speak directly with our 24×7 Front Office in Waidhan for immediate room allocation, corporate tax invoicing, Sharda table reservations, or celebration lawn dates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E9E2D5] space-y-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#191D1B] text-[#C6A66B] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#183D32] font-bold">
                      Verified Landlines & Mobile Numbers
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      {HOTEL_INFO.phones.map((phone: string) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          onClick={() => trackEvent('call_click', { phone, section: 'contact' })}
                          className="price-tabular text-sm sm:text-base font-bold text-[#191D1B] hover:text-[#183D32] transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                    <p className="text-xs text-[#525854] mt-1 price-tabular">
                      Landlines: {HOTEL_INFO.landlines.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E9E2D5]">
                  <div className="w-10 h-10 rounded-xl bg-[#183D32] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#183D32] font-bold">
                      Instant WhatsApp Reception Desk
                    </div>
                    <p className="text-xs text-[#525854] mt-0.5 mb-2">
                      Direct messaging for room availability, published tariff sheets, and custom bakery cake orders.
                    </p>
                    <a
                      href={buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('whatsapp_click', { section: 'contact_card' })}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.13em] font-bold text-[#183D32] hover:underline"
                    >
                      <span>Chat on WhatsApp (+91-9009284982)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E9E2D5]">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-[#183D32] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#183D32] font-bold">
                      Official Reservation & Corporate Desk Email
                    </div>
                    <a
                      href={`mailto:${HOTEL_INFO.email}`}
                      className="text-sm font-semibold text-[#191D1B] hover:text-[#183D32] break-all block mt-0.5"
                    >
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#E9E2D5]">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-[#183D32] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-[#183D32] font-bold">
                      Check-In Hours & Address
                    </div>
                    <p className="text-xs text-[#191D1B] font-semibold mt-0.5">
                      24×7 Front Office · Check-in {HOTEL_INFO.checkInTime} / Check-out {HOTEL_INFO.checkOutTime}
                    </p>
                    <p className="text-xs text-[#525854] mt-0.5">{HOTEL_INFO.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Direct Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E9E2D5] shadow-xs">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#183D32] font-bold block mb-1">
                  Direct Reception Message
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-[#191D1B] font-semibold mb-2">
                  Send a Message to Our Front Office
                </h3>
                <p className="text-xs text-[#525854] mb-6">
                  Connects directly with our Waidhan Reservation Desk via WhatsApp or Email.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-sm text-[#191D1B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-sm text-[#191D1B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-sm text-[#191D1B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                        Inquiry Type
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-sm text-[#191D1B] font-medium"
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
                        <option value="Travel Desk / Station Cab Transfer">
                          Travel Desk / Station Cab Transfer
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                      Message / Dates / Special Requests *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your check-in dates, number of guests, company name, or event details..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] text-sm text-[#191D1B]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#183D32] text-white hover:bg-[#122E25] text-xs uppercase tracking-[0.15em] font-semibold transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#C6A66B]" />
                      <span>Send via WhatsApp Desk</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleContactEmailFallback}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#F8F6F0] text-[#191D1B] hover:bg-[#EFECE4] border border-[#E9E2D5] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-[#183D32]" />
                      <span>Send via Email</span>
                    </button>
                  </div>

                  {contactSubmitted && (
                    <div className="p-3.5 rounded-xl bg-[#183D32]/10 border border-[#183D32]/30 text-xs text-[#183D32] font-medium flex items-center gap-2">
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
      <footer className="bg-[#191D1B] text-[#F8F6F0] border-t border-white/10 pb-20 lg:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#F8F6F0]/15">
            {/* Brand Identity */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C6A66B] font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Est. 2011 · First Classified 3-Star Luxury Hotel</span>
              </div>
              <h3 className="font-display text-3xl text-[#F8F6F0] font-semibold mb-3">
                {HOTEL_INFO.name}
              </h3>
              <p className="text-sm text-[#F8F6F0]/75 leading-relaxed mb-5">
                {HOTEL_INFO.tagline}. Welcoming corporate executives from NTPC, Reliance, Hindalco, and NCL alongside celebrating families across Waidhan, Singrauli.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F6F0]/5 border border-[#F8F6F0]/15 text-xs text-[#F8F6F0]/85">
                <FileText className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Formal Tax Invoice Provided for Corporate & Business Stays</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#C6A66B] font-semibold mb-4">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-[#F8F6F0]/80">
                <li>
                  <a href="#rooms" className="hover:text-[#C6A66B] transition-colors">
                    7 Room & Suite Categories (₹2,000 – ₹9,000)
                  </a>
                </li>
                <li>
                  <a href="#dining-events" className="hover:text-[#C6A66B] transition-colors">
                    Sharda Multi-Cuisine Restaurant & Bakery
                  </a>
                </li>
                <li>
                  <a href="#dining-events" className="hover:text-[#C6A66B] transition-colors">
                    Blue Diamond Colonial Bar (11 AM – 11 PM)
                  </a>
                </li>
                <li>
                  <a href="#banquets" className="hover:text-[#C6A66B] transition-colors">
                    3,000-Guest Lawn & Banquet Venues
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-[#C6A66B] transition-colors">
                    Swimming Pool, Health Club & 12 Facilities
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-[#C6A66B] transition-colors">
                    Authentic Property Photo Gallery
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#C6A66B] transition-colors">
                    About Us & Leadership (Est. 2011)
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-[#C6A66B] transition-colors">
                    Location Map & Industrial Distances
                  </a>
                </li>
                <li>
                  <a href="#policies-faq" className="hover:text-[#C6A66B] transition-colors">
                    Guest Policies & Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Reception */}
            <div className="lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#C6A66B] font-semibold mb-4">
                24×7 Reception & Address
              </h4>
              <div className="space-y-2.5 text-sm text-[#F8F6F0]/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                  <span>{HOTEL_INFO.address}</span>
                </div>
                {HOTEL_INFO.phones.map((phone: string) => (
                  <div key={phone} className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
                    <a
                      href={`tel:${phone}`}
                      className="price-tabular font-semibold hover:text-[#C6A66B] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 text-xs text-[#F8F6F0]/70 price-tabular pt-1">
                  <span>Bar Desk: {HOTEL_INFO.barPhone}</span>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                  <a
                    href={`mailto:${HOTEL_INFO.email}`}
                    className="hover:text-[#C6A66B] transition-colors break-all"
                  >
                    {HOTEL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Policies & Direct Booking Assurance */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#C6A66B] font-semibold mb-4">
                Policies & Legal
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F8F6F0]/75 mb-5">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-[#C6A66B] underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('terms')}
                    className="hover:text-[#C6A66B] underline cursor-pointer"
                  >
                    Reservation Terms & Policies
                  </button>
                </li>
                <li>
                  <a
                    href={GOOGLE_MAPS_PLACE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#C6A66B] underline"
                  >
                    <span>Google Maps Listing</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>

              <div className="p-3.5 rounded-xl bg-[#F8F6F0]/5 border border-[#F8F6F0]/15 text-[11px] text-[#F8F6F0]/80 leading-relaxed">
                <strong className="text-[#C6A66B] block mb-0.5">
                  Direct Reservation Desk
                </strong>
                Book directly with our 24×7 Waidhan Front Office for verified published room tariffs and meal plan options.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F6F0]/55">
            <p>
              © {new Date().getFullYear()} {HOTEL_INFO.name}, Waidhan, Singrauli (M.P.). All Rights Reserved.
            </p>
            <p className="price-tabular">
              Official Hospitality Portal · GPS: 24.072285, 82.6206458
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
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#183D32] text-white border border-[#C6A66B]/40 shadow-lg hover:bg-[#122E25] transition-all text-xs font-bold uppercase tracking-[0.12em]"
        >
          <MessageSquare className="w-4 h-4 text-[#C6A66B]" />
          <span>WhatsApp Desk</span>
        </a>
        <a
          href={`tel:${HOTEL_INFO.phones[0]}`}
          onClick={() => trackEvent('call_click', { location: 'floating_desktop' })}
          className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#191D1B] text-[#F8F6F0] border border-[#C6A66B]/40 shadow-lg hover:bg-[#2E3330] transition-all text-xs font-bold uppercase tracking-[0.12em]"
        >
          <Phone className="w-4 h-4 text-[#C6A66B]" />
          <span className="price-tabular">{HOTEL_INFO.phones[0]}</span>
        </a>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Call | WhatsApp | Book Now) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#191D1B] text-[#F8F6F0] border-t border-white/15 px-3 py-2 shadow-2xl">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <a
            href={`tel:${HOTEL_INFO.phones[0]}`}
            onClick={() => trackEvent('call_click', { location: 'mobile_sticky_bar' })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8F6F0]/10 text-[#F8F6F0] text-xs font-bold uppercase tracking-wider"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Call</span>
          </a>
          <a
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'mobile_sticky_bar' })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#183D32] text-white text-xs font-bold uppercase tracking-wider"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              trackEvent('book_stay_click', { location: 'mobile_sticky_bar' });
              onBookStay();
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#C6A66B] text-[#191D1B] text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>

      {/* COOKIE CONSENT BANNER */}
      {!cookieAccepted && (
        <div className="fixed bottom-16 lg:bottom-6 left-4 right-4 lg:left-6 lg:right-auto lg:max-w-md z-40 p-4 rounded-2xl bg-[#191D1B] text-[#F8F6F0] border border-[#C6A66B]/30 shadow-2xl flex items-center justify-between gap-4">
          <p className="text-xs text-[#F8F6F0]/85 leading-relaxed">
            We use essential cookies to remember your selected room & meal plan preferences for direct booking.
          </p>
          <button
            type="button"
            onClick={handleAcceptCookie}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-[#183D32] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#122E25] cursor-pointer"
          >
            Got It
          </button>
        </div>
      )}

      {/* PRIVACY POLICY & TERMS MODAL */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6F0] border border-[#E9E2D5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#191D1B] border border-[#E9E2D5] flex items-center justify-center hover:bg-[#EFECE4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#183D32] font-bold block mb-1">
              Hotel Satya International · Waidhan, Singrauli
            </span>
            <h3 className="font-display text-2xl text-[#191D1B] font-semibold mb-4">
              {legalModal === 'privacy'
                ? 'Guest Privacy & Data Protection Policy'
                : 'Reservation Terms & House Policies'}
            </h3>
            {legalModal === 'privacy' ? (
              <div className="space-y-3 text-xs text-[#525854] leading-relaxed">
                <p>
                  <strong className="text-[#191D1B]">1. Direct Booking Data:</strong> Guest names, phone numbers, email addresses, and corporate billing details submitted on this website are used solely by Hotel Satya International Front Office for room allocation, travel desk transfers, and invoicing.
                </p>
                <p>
                  <strong className="text-[#191D1B]">2. Government ID Verification:</strong> All checking-in guests are required to present valid original Government photo identification at reception upon arrival.
                </p>
                <p>
                  <strong className="text-[#191D1B]">3. Confidentiality:</strong> We never sell or rent guest contact information to external marketing agencies or unauthorized third parties.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#525854] leading-relaxed">
                <p>
                  <strong className="text-[#191D1B]">1. Check-In & Check-Out:</strong> Standard check-in time is {HOTEL_INFO.checkInTime} and check-out time is {HOTEL_INFO.checkOutTime}.
                </p>
                <p>
                  <strong className="text-[#191D1B]">2. Published Tariffs & Taxes:</strong> Published room tariffs (₹2,000 to ₹9,000 per night) are exclusive of applicable taxes. EP, CP, MAP, and AP meal plans are available and confirmed by our Front Office.
                </p>
                <p>
                  <strong className="text-[#191D1B]">3. Reservations & Amendments:</strong> For reservation changes or cancellations, please contact our 24×7 Front Office directly at {HOTEL_INFO.phones[0]} or {HOTEL_INFO.phones[1]}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
