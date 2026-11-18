import { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import {
  AEO_FAQS,
  HOTEL_INFO,
  Language,
  UI_TRANSLATIONS,
} from '../data/hotelData';

interface SeoAeoSectionProps {
  lang: Language;
}

export function SeoAeoSection({ lang }: SeoAeoSectionProps) {
  const t = UI_TRANSLATIONS[lang];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');

  const faqCategories = [
    'All',
    ...Array.from(new Set(AEO_FAQS.map((f) => f.category))),
  ];

  const filteredFaqs =
    activeFaqCategory === 'All'
      ? AEO_FAQS
      : AEO_FAQS.filter((f) => f.category === activeFaqCategory);

  return (
    <section id="policies-faq" className="py-20 lg:py-24 bg-[#EFECE4] border-b border-[#E9E2D5] scroll-mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#183D32] font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'होटल नियम, नीतियां और अक्सर पूछे जाने वाले प्रश्न'
                  : 'Essential Guest Information & Frequently Asked Questions'}
              </span>
            </div>
            <h2
              className="font-display text-[#191D1B] font-semibold leading-[1.12]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              {t.sections.faqTitle}
            </h2>
          </div>

          <a
            href={`tel:${HOTEL_INFO.phones[0]}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-xs font-semibold text-[#191D1B] hover:border-[#C6A66B] price-tabular self-start lg:self-auto"
          >
            <Phone className="w-3.5 h-3.5 text-[#183D32]" />
            <span>24×7 Reception Desk: {HOTEL_INFO.phones[0]}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Cols: Verified House Rules Summary Card + Category Filter */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-[#191D1B] text-[#F8F6F0] shadow-md">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#C6A66B] font-semibold block mb-2">
                Verified Hospitality Guidelines
              </span>
              <h3 className="font-display text-2xl font-medium mb-4">
                At-a-Glance Guest Policies
              </h3>

              <div className="space-y-3 text-xs border-t border-[#F8F6F0]/15 pt-4">
                <div className="flex justify-between py-1.5 border-b border-[#F8F6F0]/10">
                  <span className="text-[#F8F6F0]/70">Standard Check-In</span>
                  <span className="price-tabular font-bold text-[#C6A66B]">
                    {HOTEL_INFO.checkInTime}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F8F6F0]/10">
                  <span className="text-[#F8F6F0]/70">Standard Check-Out</span>
                  <span className="price-tabular font-bold text-[#C6A66B]">
                    {HOTEL_INFO.checkOutTime}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F8F6F0]/10">
                  <span className="text-[#F8F6F0]/70">Published Room Tariffs</span>
                  <span className="price-tabular font-semibold">₹2,000 – ₹9,000 + Taxes</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F8F6F0]/10">
                  <span className="text-[#F8F6F0]/70">Meal Plans Available</span>
                  <span className="font-semibold">EP · CP · MAP · AP</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F8F6F0]/10">
                  <span className="text-[#F8F6F0]/70">Blue Diamond Bar Hours</span>
                  <span className="price-tabular font-semibold">11:00 AM – 11:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#F8F6F0]/70">Required ID at Check-In</span>
                  <span className="font-semibold text-[#C6A66B]">Valid Govt. Photo ID</span>
                </div>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="p-5 rounded-2xl bg-white border border-[#E9E2D5]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#183D32] font-bold mb-3">
                Filter Questions by Topic
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
                        ? 'bg-[#183D32] text-white'
                        : 'bg-[#F8F6F0] text-[#191D1B] hover:bg-[#EFECE4]'
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

          {/* Right 8 Cols: Verified FAQ Accordion */}
          <div className="lg:col-span-8 space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white border border-[#E9E2D5] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8F6F0]/60"
                  >
                    <div className="flex items-start gap-3">
                      <span className="price-tabular text-xs font-bold text-[#183D32] bg-[#F8F6F0] px-2.5 py-1 rounded-md border border-[#E9E2D5] mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C6B32] font-bold block mb-0.5">
                          {faq.category}
                        </span>
                        <span className="font-display text-lg sm:text-xl text-[#191D1B] font-semibold">
                          {faq.q}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#183D32] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-2 text-sm text-[#525854] leading-relaxed border-t border-[#E9E2D5]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
