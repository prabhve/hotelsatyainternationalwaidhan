import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Building2,
  Car,
  Check,
  Droplets,
  Dumbbell,
  FileText,
  Mail,
  MessageSquare,
  Plane,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
} from 'lucide-react';
import {
  CORPORATE_BENEFITS,
  CORPORATE_SECTORS,
  FACILITIES_LIST,
  HOTEL_INFO,
  LEADERSHIP_PROFILES,
  Language,
  POOL_AND_HEALTH_CLUB_INFO,
  SINGRAULI_HERITAGE,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { buildMailtoUrl, buildWhatsAppUrl, trackEvent } from '../lib/analytics';
import { SafeImage } from './SafeImage';
import { LUXURY_SPRING, Reveal } from './MotionPrimitives';

interface HeritageAndLeadershipSectionProps {
  lang: Language;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves,
  Dumbbell,
  Wifi,
  Utensils,
  Car,
  Stethoscope,
  ShieldCheck,
  Users,
  Plane,
  Tv,
  Droplets,
  Sparkles,
  FileText,
};

export function HeritageAndLeadershipSection({ lang }: HeritageAndLeadershipSectionProps) {
  const t = UI_TRANSLATIONS[lang];

  // Request Corporate Rate Form State
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
    const summary = `Namaste Hotel Satya International (Corporate Sales Desk),\nNew B2B / Long-Stay Rate Request:\n• Company: ${corpCompany.trim()}\n• GSTIN: ${corpGstin.trim() || 'To be provided'}\n• Contact Person: ${corpContact.trim()} (${corpPhone.trim()})\n• Email: ${corpEmail.trim() || 'N/A'}\n• Expected Volume: ${corpRoomNights}\n${corpNote.trim() ? `• Requirements (Early breakfast / Plant cab / Corporate billing): ${corpNote.trim()}` : ''}`;

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
          VERIFIED THREE-STAR HOTEL FACILITIES & RESIDENT SERVICES
          ===================================================================== */}
      <motion.section
        id="facilities"
        initial={{ opacity: 0, y: 38 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.08 }}
        transition={LUXURY_SPRING}
        className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#EFECE4] scroll-mt-16"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                {lang === 'hi'
                  ? '३-स्टार होटल सुविधाएं और आतिथ्य सेवाएं'
                  : 'Three-Star Facilities & Resident Privileges'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#191D1B] text-balance">
                {t.sections.facilitiesTitle}
              </h2>
            </div>
          </Reveal>

          {/* 12 Verified Facilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACILITIES_LIST.map((fac, idx) => {
              const IconComp = ICON_MAP[fac.icon] || ShieldCheck;
              return (
                <motion.div
                  key={fac.title}
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  whileHover={{ y: -5, scale: 1.015 }}
                  transition={{ ...LUXURY_SPRING, delay: idx * 0.04 }}
                  className="bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-2xl p-5 flex items-start gap-3.5 shadow-2xs hover:shadow-md transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] border border-[#E9E2D5] flex items-center justify-center text-[#183D32] shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#191D1B]">
                      <span className="price-tabular text-[#8C6B32] mr-1">
                        {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                      </span>
                      {fac.title}
                    </p>
                    <p className="text-xs text-[#525854] mt-1 leading-relaxed">{fac.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Outdoor Swimming Pool & Health Club Showcase */}
          <Reveal delay={0.1}>
            <div className="bg-white border border-[#E9E2D5] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-xs">
            <div className="lg:col-span-5 relative min-h-[260px] bg-[#EFECE4]">
              <SafeImage
                src={HOTEL_INFO.poolImage}
                alt="Outdoor Swimming Pool at Hotel Satya International, Waidhan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 text-white">
                <p className="text-xs font-semibold text-[#C6A66B]">
                  {POOL_AND_HEALTH_CLUB_INFO.subtitle}
                </p>
                <p className="font-display text-2xl font-semibold mt-0.5">
                  Outdoor Swimming Pool & Health Club
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#183D32] mb-1">
                  Resident Recreation & Wellness
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-2">
                  {POOL_AND_HEALTH_CLUB_INFO.headline}
                </h3>
                <ul className="space-y-2.5 mt-4">
                  {POOL_AND_HEALTH_CLUB_INFO.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-[#525854]">
                      <Check className="w-4 h-4 text-[#183D32] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-[#525854] mt-4 pt-3 border-t border-[#EFECE4]">
                For current seasonal pool hours or health club assistance, please contact our 24×7 Front Office at {HOTEL_INFO.phones[0]}.
              </p>
            </div>
            </div>
          </Reveal>
        </div>
      </motion.section>

      {/* =====================================================================
          CORPORATE & EXECUTIVE HOSPITALITY (NTPC, RELIANCE, HINDALCO, NCL)
          ===================================================================== */}
      <motion.section
        id="corporate"
        initial={{ opacity: 0, y: 38 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.08 }}
        transition={LUXURY_SPRING}
        className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0] scroll-mt-16"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Corporate Positioning, Partner Sectors & 6 B2B Privileges */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                  {lang === 'hi'
                    ? 'कॉर्पोरेट और दीर्घकालिक प्रवास डेस्क'
                    : 'Corporate & Long-Stay Hospitality Desk'}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#191D1B] text-balance mb-3">
                  {t.sections.corporateTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#525854] leading-relaxed">
                  Situated on Belaunji Main Road in Waidhan—just 04 Km from NTPC Vindhyanagar, 12 Km from NTPC Shaktinagar, and 18 Km from Reliance Power Plant (Sasan)—Hotel Satya International serves as the trusted residential address for visiting directors, plant engineers, and corporate teams.
                </p>
              </div>

              {/* Industrial Corridors Served */}
              <div className="bg-white border border-[#E9E2D5] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#183D32] uppercase tracking-wider mb-3">
                  Verified Industrial Corridors & Distances from Hotel Satya International:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CORPORATE_SECTORS.map((sec) => (
                    <div key={sec} className="flex items-center gap-2 text-xs font-semibold text-[#191D1B]">
                      <Building2 className="w-3.5 h-3.5 text-[#183D32] shrink-0" />
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
                    className="bg-white border border-[#E9E2D5] rounded-2xl p-5 shadow-2xs"
                  >
                    <h3 className="text-sm font-bold text-[#191D1B] mb-1">{ben.title}</h3>
                    <p className="text-xs text-[#525854] leading-relaxed">{ben.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Request Corporate Rate Card Form */}
            <div className="lg:col-span-5 bg-white border border-[#E9E2D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#183D32] mb-1">
                B2B Empanelment & Monthly Tariffs
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-2">
                Request Corporate Rate Card
              </h3>
              <p className="text-xs text-[#525854] mb-5">
                Receive our corporate EP / CP / MAP / AP tariff schedule, long-stay arrangements, and billing details directly from our Front Office.
              </p>

              {corpSubmitted ? (
                <div className="p-5 bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl space-y-4">
                  <p className="text-xs sm:text-sm font-bold text-[#183D32]">
                    Corporate Rate Request Prepared for {corpCompany}
                  </p>
                  <p className="text-xs text-[#525854]">
                    Send your corporate inquiry directly to our General Manager & Corporate Desk:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    <a
                      href={corpSubmitted.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#183D32] hover:bg-[#122E25] text-white text-xs font-semibold rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Corporate Inquiry via WhatsApp
                    </a>
                    <a
                      href={corpSubmitted.mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#191D1B] hover:bg-[#2E3330] text-white text-xs font-semibold rounded-xl"
                    >
                      <Mail className="w-4 h-4 text-[#C6A66B]" />
                      Send via Official Email
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCorpSubmitted(null)}
                    className="text-xs font-semibold text-[#525854] hover:text-[#191D1B] cursor-pointer"
                  >
                    Edit Corporate Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      value={corpCompany}
                      onChange={(e) => setCorpCompany(e.target.value)}
                      placeholder="e.g. NTPC Ltd. / Reliance Power / Hindalco"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Company GSTIN (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={corpGstin}
                        onChange={(e) => setCorpGstin(e.target.value.toUpperCase())}
                        placeholder="Enter company GSTIN"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Expected Room Nights / Month
                      </label>
                      <select
                        value={corpRoomNights}
                        onChange={(e) => setCorpRoomNights(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
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
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Contact Person & Designation *
                      </label>
                      <input
                        type="text"
                        value={corpContact}
                        onChange={(e) => setCorpContact(e.target.value)}
                        placeholder="Name & Role (Admin / HR)"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#525854] mb-1">
                        Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={corpPhone}
                        onChange={(e) => setCorpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#525854] mb-1">
                      Specific Requirements (Travel Desk Transfers, Meal Plans, Conference Room)
                    </label>
                    <textarea
                      rows={2}
                      value={corpNote}
                      onChange={(e) => setCorpNote(e.target.value)}
                      placeholder="e.g. CP/MAP meal plans, cab transfers to NTPC VSTPP, monthly billing..."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#183D32] hover:bg-[#122E25] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Request Corporate Rate Card
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Heritage & Leadership Messages (Est. 2011 · MD Mr. S. D. Singh & GM Mr. Rajan G.P.) */}
          <Reveal>
            <div id="about" className="pt-12 border-t border-[#E9E2D5] scroll-mt-24">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#183D32] mb-2">
                About Hotel Satya International · Est. {SINGRAULI_HERITAGE.foundingYear}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-2">
                {lang === 'hi'
                  ? 'हमारी विरासत और नेतृत्व संदेश'
                  : 'Our Waidhan Hospitality Heritage & Leadership'}
              </h3>
              <p className="text-sm text-[#525854] max-w-3xl mb-6 leading-relaxed">
                {SINGRAULI_HERITAGE.narrative}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LEADERSHIP_PROFILES.map((leader, idx) => (
                  <motion.article
                    key={leader.id}
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ ...LUXURY_SPRING, delay: idx * 0.1 }}
                    className="bg-white border border-[#E9E2D5] hover:border-[#C6A66B] rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start shadow-2xs hover:shadow-md transition-colors"
                  >
                    <SafeImage
                      src={leader.image}
                      alt={`${leader.name} — ${leader.role}, Hotel Satya International`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover border border-[#E9E2D5] shrink-0"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#183D32]">
                        {leader.role} · {leader.motto}
                      </p>
                      <h4 className="font-display text-2xl font-semibold text-[#191D1B] mt-0.5 mb-2">
                        {leader.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#525854] leading-relaxed italic">
                        “{leader.quote}”
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </motion.section>
    </div>
  );
}
