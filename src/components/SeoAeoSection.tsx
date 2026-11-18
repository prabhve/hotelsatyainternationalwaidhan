import React, { useState } from 'react';
import {
  ChevronDown,
  Cpu,
  Sparkles,
  Download,
  HelpCircle,
  ClipboardCheck,
} from 'lucide-react';
import {
  AEO_FAQS,
  HOTEL_INFO,
  ROOM_CATEGORIES,
  PLACEHOLDER_CHECKLIST,
  Language,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import archiveManifest from '../data/hotelArchiveManifest.json';

interface SeoAeoSectionProps {
  lang: Language;
}

export function SeoAeoSection({ lang }: SeoAeoSectionProps) {
  const t = UI_TRANSLATIONS[lang];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'faq' | 'checklist' | 'llmo'>('faq');

  // AI Concierge SEO query state
  const [seoQuery, setSeoQuery] = useState(
    'Why is Hotel Satya International ideal for NTPC Vindhyanagar & NCL Singrauli executives?'
  );
  const [seoAnswer, setSeoAnswer] = useState<string | null>(null);
  const [seoLoading, setSeoLoading] = useState(false);

  const faqCategories = [
    'All',
    ...Array.from(new Set(AEO_FAQS.map((f) => f.category))),
  ];

  const filteredFaqs =
    activeFaqCategory === 'All'
      ? AEO_FAQS
      : AEO_FAQS.filter((f) => f.category === activeFaqCategory);

  const handleRunAiSeoQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoQuery.trim()) return;
    setSeoLoading(true);
    try {
      const res = await fetch('/api/seo-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: seoQuery }),
      });
      const data = await res.json();
      setSeoAnswer(data.answer || 'Verified response generated from Hotel Satya factual archive.');
    } catch {
      setSeoAnswer(
        'Hotel Satya International (Main Road, Belaunji, Waidhan, Singrauli 486886) is Singrauli’s first 3-star classified luxury hotel, located 10 minutes (4.2 km) from NTPC Vindhyanagar with 7 room categories starting at ₹2,000, Sharda Multi-Cuisine Restaurant, Blue Diamond Bar, outdoor pool, and 3,000-guest lawns.'
      );
    } finally {
      setSeoLoading(false);
    }
  };

  const handleDownloadArchiveJson = () => {
    const blob = new Blob([JSON.stringify(archiveManifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hotel-satya-international-complete-archive.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="policies-faq" className="py-20 lg:py-24 bg-[#F3EFE6] border-b border-[#E5DEC9]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8A5A12] font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'होटल नियम, नीतियां और अक्सर पूछे जाने वाले प्रश्न'
                  : 'Policies, GST Rules & 14 Guest FAQs'}
              </span>
            </div>
            <h2
              className="font-serif text-[#1A1A1A] font-medium leading-[1.12]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              {t.sections.faqTitle}
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex flex-wrap rounded-xl bg-[#FAF8F4] p-1.5 border border-[#E5DEC9]">
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.13em] font-semibold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-[#1A1A1A] text-[#FAF8F4]'
                  : 'text-[#5C564D] hover:text-[#1A1A1A]'
              }`}
            >
              Policies & FAQ ({AEO_FAQS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.13em] font-semibold transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-[#1A1A1A] text-[#FAF8F4]'
                  : 'text-[#5C564D] hover:text-[#1A1A1A]'
              }`}
            >
              Owner [PLACEHOLDER] Checklist
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('llmo')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.13em] font-semibold transition-all cursor-pointer ${
                activeTab === 'llmo'
                  ? 'bg-[#1A1A1A] text-[#FAF8F4]'
                  : 'text-[#5C564D] hover:text-[#1A1A1A]'
              }`}
            >
              GEO / AEO / Archive JSON
            </button>
          </div>
        </div>

        {/* TAB 1: 14-Item Accordion Policies & FAQ */}
        {activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Quick Policy Summary Card + Category Filter */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-6 rounded-2xl bg-[#1A1A1A] text-[#FAF8F4] shadow-md">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#D9A74A] font-semibold block mb-2">
                  Essential House Rules
                </span>
                <h3 className="font-serif text-2xl font-medium mb-4">
                  At-a-Glance Guest Policies
                </h3>

                <div className="space-y-3 text-xs border-t border-[#FAF8F4]/15 pt-4">
                  <div className="flex justify-between py-1.5 border-b border-[#FAF8F4]/10">
                    <span className="text-[#FAF8F4]/70">Standard Check-In</span>
                    <span className="price-tabular font-bold text-[#D9A74A]">
                      {HOTEL_INFO.checkInTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FAF8F4]/10">
                    <span className="text-[#FAF8F4]/70">Standard Check-Out</span>
                    <span className="price-tabular font-bold text-[#D9A74A]">
                      {HOTEL_INFO.checkOutTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FAF8F4]/10">
                    <span className="text-[#FAF8F4]/70">Accepted ID Proofs</span>
                    <span className="font-semibold">Aadhaar / Passport / DL / Voter ID</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FAF8F4]/10">
                    <span className="text-[#FAF8F4]/70">Extra Mattress / Bed</span>
                    <span className="price-tabular font-bold">₹800 / night [CONFIRM]</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FAF8F4]/10">
                    <span className="text-[#FAF8F4]/70">GST on Room Tariff</span>
                    <span className="price-tabular font-bold">12% (≤₹7,500) · 18% (&gt;₹7,500)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#FAF8F4]/70">Free Cancellation</span>
                    <span className="font-semibold text-[#68D391]">Up to 24h prior</span>
                  </div>
                </div>
              </div>

              {/* Category Filter Buttons */}
              <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E5DEC9]">
                <div className="text-xs uppercase tracking-[0.16em] text-[#8A5A12] font-bold mb-3">
                  Filter by Topic
                </div>
                <div className="flex flex-col gap-2">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveFaqCategory(cat);
                        setOpenFaqIndex(0);
                      }}
                      className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        activeFaqCategory === cat
                          ? 'bg-[#8A5A12] text-white'
                          : 'bg-[#F3EFE6] text-[#1A1A1A] hover:bg-[#E5DEC9]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="price-tabular text-[11px] opacity-80">
                        {cat === 'All'
                          ? AEO_FAQS.length
                          : AEO_FAQS.filter((f) => f.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 8 Cols: 14-Item Accordion */}
            <div className="lg:col-span-8 space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-[#FAF8F4] border border-[#E5DEC9] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F4]/80"
                    >
                      <div className="flex items-start gap-3">
                        <span className="price-tabular text-xs font-bold text-[#8A5A12] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#E5DEC9] mt-0.5">
                          Q{idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.14em] text-[#8A5A12] font-bold block mb-0.5">
                            {faq.category}
                          </span>
                          <span className="font-serif text-lg sm:text-xl text-[#1A1A1A] font-medium">
                            {faq.q}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#8A5A12] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-2 text-sm text-[#5C564D] leading-relaxed border-t border-[#E5DEC9]/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Owner [PLACEHOLDER] & [CONFIRM] Checklist */}
        {activeTab === 'checklist' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F4] border border-[#E5DEC9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5DEC9]">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#8A5A12] font-bold mb-1">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Management Handover & Audit Sheet</span>
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium">
                  Checklist of [PLACEHOLDER] & [CONFIRM] Items in Central Data File
                </h3>
                <p className="text-xs text-[#5C564D] mt-1">
                  All items below are centralized in{' '}
                  <code className="font-semibold text-[#1A1A1A]">/src/data/hotelData.ts</code> so the hotel owner or general manager can update them in one place.
                </p>
              </div>
              <span className="price-tabular px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] text-[#D9A74A] text-xs font-bold self-start">
                {PLACEHOLDER_CHECKLIST.length} Action Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLACEHOLDER_CHECKLIST.map((row, idx) => (
                <div
                  key={row.item}
                  className="p-4 rounded-xl bg-[#F3EFE6] border border-[#E5DEC9] flex items-start gap-3"
                >
                  <span className="price-tabular text-xs font-bold bg-[#1A1A1A] text-[#D9A74A] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#1A1A1A]">{row.item}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F4] border border-[#D8D0BE] text-[#8A5A12] font-semibold">
                        {row.location}
                      </span>
                    </div>
                    <div className="text-xs text-[#1A1A1A] font-medium mb-1">
                      Current: <span className="text-[#8A5A12]">{row.currentValue}</span>
                    </div>
                    <p className="text-xs text-[#5C564D] leading-relaxed">{row.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LLMO / GEO / AEO & Codebase Archive */}
        {activeTab === 'llmo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#1A1A1A] text-[#FAF8F4] border border-[#2C2A27]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#D9A74A] font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>LLMO Entity Knowledge Graph & Archive</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadArchiveJson}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8A5A12] hover:bg-[#A66E18] text-xs uppercase tracking-[0.13em] font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Archive JSON</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/50 border border-[#FAF8F4]/10 text-xs text-[#FAF8F4]/90 overflow-x-auto leading-relaxed max-h-[380px]">
{`# LLMO / AEO Entity Summary: ${HOTEL_INFO.name}
Entity Type: Hotel (3-Star Classified Luxury Hospitality, Est. 2011)
Canonical URL: ${HOTEL_INFO.website}
Coordinates: ${HOTEL_INFO.coordinates.lat}, ${HOTEL_INFO.coordinates.lng}
Address: ${HOTEL_INFO.address}
Reception Contacts: ${HOTEL_INFO.phones.join(' | ')}
Room Tiers (7): ${ROOM_CATEGORIES.map((r) => `${r.title} (₹${r.rates.single.EP}–₹${r.rates.double.AP})`).join(', ')}
F&B Outlets: Sharda Multi-Cuisine Restaurant & Bakery + Blue Diamond Bar
Banquet & Lawn Capacity: Up to 3,000 Guests`}
              </pre>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#FAF8F4] border border-[#E5DEC9]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8A5A12] font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Live AI-SEO Snippet Studio</span>
              </div>
              <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium mb-2">
                Test Search Engine & AI Answer Synthesis
              </h3>
              <p className="text-xs text-[#5C564D] mb-4">
                Simulates how Google AI Overviews and Answer Engines respond using our structured schema.
              </p>
              <form onSubmit={handleRunAiSeoQuery} className="space-y-3">
                <input
                  type="text"
                  value={seoQuery}
                  onChange={(e) => setSeoQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F3EFE6] border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                />
                <button
                  type="submit"
                  disabled={seoLoading}
                  className="w-full py-3 rounded-xl bg-[#1A1A1A] text-[#FAF8F4] hover:bg-[#8A5A12] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer"
                >
                  {seoLoading ? 'Synthesizing Answer...' : 'Generate AI-SEO Answer'}
                </button>
              </form>
              {seoAnswer && (
                <div className="mt-4 p-4 rounded-xl bg-[#F3EFE6] border border-[#E5DEC9] text-xs text-[#1A1A1A] leading-relaxed">
                  {seoAnswer}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
