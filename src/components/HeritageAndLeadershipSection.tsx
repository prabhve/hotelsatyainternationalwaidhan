import { useState } from 'react';
import {
  ArrowUpDown,
  Briefcase,
  Building2,
  Car,
  Check,
  Compass,
  CreditCard,
  Dumbbell,
  Info,
  Mail,
  MessageSquare,
  Plane,
  ShieldCheck,
  Shirt,
  Stethoscope,
  Users,
  Utensils,
  Waves,
  Wifi,
  Zap,
} from 'lucide-react';
import {
  CORPORATE_BENEFITS,
  CORPORATE_SECTORS,
  FACILITIES_LIST,
  HOTEL_INFO,
  LEADERSHIP_PROFILES,
  Language,
  POOL_TIMINGS_AND_RULES,
  SINGRAULI_HERITAGE,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { buildMailtoUrl, buildWhatsAppUrl, trackEvent } from '../lib/analytics';
import { SafeImage } from './SafeImage';

interface HeritageAndLeadershipSectionProps {
  lang: Language;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves,
  Dumbbell,
  Wifi,
  Utensils,
  Zap,
  Car,
  Compass,
  Shirt,
  Stethoscope,
  ShieldCheck,
  Briefcase,
  Users,
  ArrowUpDown,
  CreditCard,
  Plane,
  Info,
};

export function HeritageAndLeadershipSection({ lang }: HeritageAndLeadershipSectionProps) {
  const t = UI_TRANSLATIONS[lang];

  // Section 8 State: Request Corporate Rate Form
  const [corpCompany, setCorpCompany] = useState('');
  const [corpGstin, setCorpGstin] = useState('');
  const [corpContact, setCorpContact] = useState('');
  const [corpPhone, setCorpPhone] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpRoomNights, setCorpRoomNights] = useState('15 – 40 Room Nights / Month');
  const [corpNote, setCorpNote] = useState('');
  const [corpSubmitted, setCorpSubmitted] = useState<{
    whatsappUrl: string;
    mailtoUrl: string;
  } | null>(null);

  const handleCorporateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const summary = `Namaste Hotel Satya International (Corporate Sales Desk),\nNew B2B / Long-Stay Rate Request:\n• Company: ${corpCompany.trim()}\n• GSTIN: ${corpGstin.trim() || 'To be provided'}\n• Contact Person: ${corpContact.trim()} (${corpPhone.trim()})\n• Email: ${corpEmail.trim() || 'N/A'}\n• Expected Volume: ${corpRoomNights}\n${corpNote.trim() ? `• Requirements (Early breakfast / Plant cab / Monthly billing): ${corpNote.trim()}` : ''}`;

    trackEvent('corporate_inquiry', {
      company: corpCompany.trim(),
      volume: corpRoomNights,
    });

    setCorpSubmitted({
      whatsappUrl: buildWhatsAppUrl(summary),
      mailtoUrl: buildMailtoUrl(
        `Corporate / Long-Stay Tariff Request — ${corpCompany.trim()}`,
        summary
      ),
    });
  };

  return (
    <div>
      {/* =====================================================================
          SECTION 7 — 16 HOTEL FACILITIES & AMENITIES + POOL TIMINGS & RULES
          ===================================================================== */}
      <section
        id="facilities"
        className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#F3EFE8] scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
              Section 7 · Three-Star Facilities & Resident Privileges
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
              {t.sections.facilitiesTitle}
            </h2>
          </div>

          {/* 16-Facility Icon Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACILITIES_LIST.map((fac, idx) => {
              const IconComp = ICON_MAP[fac.icon] || ShieldCheck;
              return (
                <div
                  key={fac.title}
                  className="bg-white border border-[#E5DFD3] rounded-2xl p-5 flex items-start gap-3.5 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F4] border border-[#E5DFD3] flex items-center justify-center text-[#8A5A12] shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                      <span className="price-tabular text-[#8A5A12] mr-1">
                        {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                      </span>
                      {fac.title}
                    </p>
                    <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">{fac.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outdoor Swimming Pool Showcase & Rules Box */}
          <div className="bg-white border border-[#E5DFD3] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-xs">
            <div className="lg:col-span-5 relative min-h-[250px] bg-[#EFEAE1]">
              <SafeImage
                src={HOTEL_INFO.poolImage}
                alt="Outdoor Swimming Pool at Hotel Satya International, Waidhan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 text-white">
                <p className="text-xs font-semibold text-[#D9A74A]">
                  {POOL_TIMINGS_AND_RULES.hours}
                </p>
                <p className="font-display text-2xl font-semibold mt-0.5">
                  Outdoor Swimming Pool & Health Club
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A12] mb-1">
                  Pool Timings, Access & Safety Guidelines
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
                  {POOL_TIMINGS_AND_RULES.access}
                </h3>
                <ul className="space-y-2 mt-4">
                  {POOL_TIMINGS_AND_RULES.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs sm:text-sm text-[#454545]">
                      <Check className="w-4 h-4 text-[#8A5A12] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-[#666666] mt-4 pt-3 border-t border-[#EFECE6]">
                 Pool Towels & Changing Lockers provided for registered in-house guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8 — CORPORATE & LONG-STAY PROGRAMME (NTPC, RELIANCE, HINDALCO, NCL)
          ===================================================================== */}
      <section
        id="corporate"
        className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#FAF8F4] scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Corporate Positioning, Partner Sectors & 6 B2B Privileges */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
                  Section 8 · Corporate & Long-Stay Hospitality Desk
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance mb-3">
                  {t.sections.corporateTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#454545] leading-relaxed">
                  Situated on Waidhan Main Road just 4 km from NTPC Vindhyanagar and 18 km from Reliance Sasan, Hotel Satya International serves as the trusted residential base for visiting directors, plant engineers, EPC contractors, and government officials.
                </p>
              </div>

              {/* Industrial Corridors Served */}
              <div className="bg-white border border-[#E5DFD3] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#8A5A12] uppercase tracking-wider mb-3">
                  Serving Executives & Vendors Across Singrauli’s Energy Belt:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CORPORATE_SECTORS.map((sec) => (
                    <div key={sec} className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <Building2 className="w-3.5 h-3.5 text-[#8A5A12] shrink-0" />
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 Corporate Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CORPORATE_BENEFITS.map((ben) => (
                  <div
                    key={ben.title}
                    className="bg-white border border-[#E5DFD3] rounded-2xl p-5 shadow-2xs"
                  >
                    <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{ben.title}</h3>
                    <p className="text-xs text-[#5A5A5A] leading-relaxed">{ben.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: "Request Corporate Rate" Form */}
            <div className="lg:col-span-5 bg-white border border-[#DFD8CA] rounded-2xl p-6 sm:p-8 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A12] mb-1">
                B2B Empanelment & Monthly Tariffs
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
                Request Corporate Rate Card
              </h3>
              <p className="text-xs text-[#5A5A5A] mb-5">
                Receive our contracted EP / CP / MAP corporate tariff sheet, monthly long-stay rates, and GST billing agreement.
              </p>

              {corpSubmitted ? (
                <div className="p-5 bg-[#FAF8F4] border border-[#E5DFD3] rounded-xl space-y-4">
                  <p className="text-xs sm:text-sm font-bold text-[#1D4E3E]">
                    Corporate Rate Request Prepared for {corpCompany}
                  </p>
                  <p className="text-xs text-[#454545]">
                    Send your corporate empanelment details directly to our General Manager & Corporate Desk:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    <a
                      href={corpSubmitted.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1D4E3E] hover:bg-[#163D30] text-white text-xs font-semibold rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Corporate Inquiry via WhatsApp
                    </a>
                    <a
                      href={corpSubmitted.mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#8A5A12] hover:bg-[#72490D] text-white text-xs font-semibold rounded-xl"
                    >
                      <Mail className="w-4 h-4" />
                      Send via Official Email
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCorpSubmitted(null)}
                    className="text-xs font-semibold text-[#5A5A5A] hover:text-[#1A1A1A]"
                  >
                    Edit Corporate Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      value={corpCompany}
                      onChange={(e) => setCorpCompany(e.target.value)}
                      placeholder="e.g. NTPC Ltd. / Reliance Power / L&T"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Company GSTIN (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={corpGstin}
                        onChange={(e) => setCorpGstin(e.target.value.toUpperCase())}
                        placeholder="23AAAAA0000A1Z5"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Expected Room Nights / Month
                      </label>
                      <select
                        value={corpRoomNights}
                        onChange={(e) => setCorpRoomNights(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                      >
                        <option value="5 – 15 Room Nights / Month">5 – 15 Nights / Month</option>
                        <option value="15 – 40 Room Nights / Month">15 – 40 Nights / Month</option>
                        <option value="40 – 100+ Room Nights / Month">40 – 100+ Nights / Month</option>
                        <option value="Long-Stay Residential (30+ Days)">Monthly Long-Stay (30+ Days)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Contact Person & Designation *
                      </label>
                      <input
                        type="text"
                        value={corpContact}
                        onChange={(e) => setCorpContact(e.target.value)}
                        placeholder="Name & Role (Admin / HR)"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={corpPhone}
                        onChange={(e) => setCorpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                      Specific Requirements (Plant Cab, Early Breakfast, Bill-to-Company)
                    </label>
                    <textarea
                      rows={2}
                      value={corpNote}
                      onChange={(e) => setCorpNote(e.target.value)}
                      placeholder="e.g. 6:00 AM breakfast packs, daily cab to NTPC VSTPP, MAP plan..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    Request Corporate Rate Card
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Heritage & Leadership Messages (Est. 2011 · MD Mr. S. D. Singh & GM Mr. Rajan G.P.) */}
          <div id="about" className="pt-12 border-t border-[#E5DFD3] scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#183D32] mb-2">
              About Hotel Satya International · Est. {SINGRAULI_HERITAGE.foundingYear}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-6">
              {lang === 'hi'
                ? 'हमारी विरासत और नेतृत्व संदेश'
                : 'Our Waidhan Hospitality Heritage & Leadership'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEADERSHIP_PROFILES.map((leader) => (
                <article
                  key={leader.id}
                  className="bg-white border border-[#E5DFD3] rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start shadow-2xs"
                >
                  <SafeImage
                    src={leader.image}
                    alt={`${leader.name} — ${leader.role}, Hotel Satya International`}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border border-[#E5DFD3] shrink-0"
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A5A12]">
                      {leader.role} · {leader.motto}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#1A1A1A] mt-0.5 mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#454545] leading-relaxed italic">
                      “{leader.quote}”
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
