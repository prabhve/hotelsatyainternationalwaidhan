import { useEffect, useState } from 'react';
import { Calendar, Globe, Menu, Phone, X } from 'lucide-react';
import { HOTEL_INFO, Language, UI_TRANSLATIONS } from '../data/hotelData';
import { trackEvent } from '../lib/analytics';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onBookStay: () => void;
}

export function Header({ lang, onToggleLang, onBookStay }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#top');
  const [scrolled, setScrolled] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  const navItems = [
    { label: lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home', href: '#top' },
    { label: lang === 'hi' ? 'रूम्स व सुइट्स' : 'Rooms & Suites', href: '#rooms' },
    { label: lang === 'hi' ? 'डाइनिंग व बार' : 'Dining', href: '#dining-events' },
    { label: lang === 'hi' ? 'इवेंट्स व बैंक्वेट' : 'Events & Banquets', href: '#banquets' },
    { label: lang === 'hi' ? 'सुविधाएं' : 'Facilities', href: '#facilities' },
    { label: lang === 'hi' ? 'गैलरी' : 'Gallery', href: '#gallery' },
    { label: lang === 'hi' ? 'हमारे बारे में' : 'About Us', href: '#about' },
    { label: lang === 'hi' ? 'लोकेशन' : 'Location', href: '#location' },
    { label: lang === 'hi' ? 'संपर्क' : 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const sectionIds = [
      'top',
      'rooms',
      'dining-events',
      'banquets',
      'facilities',
      'gallery',
      'about',
      'location',
      'contact',
    ];

    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
      const scrollPos = window.scrollY + 140;
      let current = '#top';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = `#${id}`;
        }
      }
      setActiveHash(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#F8F6F0]/95 backdrop-blur-md shadow-xs border-b border-[#E9E2D5]'
          : 'bg-[#F8F6F0] border-b border-[#E9E2D5]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <a
          href="#top"
          onClick={() => setActiveHash('#top')}
          className="group flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-[#183D32]"
        >
          <img
            src={HOTEL_INFO.logo}
            alt="Hotel Satya International Logo"
            className="w-10 h-10 object-contain rounded-lg border border-[#E9E2D5] bg-white p-0.5 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#191D1B] leading-none">
              Hotel Satya International
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C6B32] font-medium mt-1">
              {lang === 'hi' ? 'वैढ़न · सिंगरौली, मध्य प्रदेश' : 'Waidhan · Singrauli, M.P.'}
            </span>
          </div>
        </a>

        {/* Primary Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-[#525854]"
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveHash(item.href)}
                className={`py-1 transition-colors whitespace-nowrap relative focus-visible:outline-2 focus-visible:outline-[#183D32] ${
                  isActive
                    ? 'text-[#183D32] font-semibold after:content-[""] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-[#C6A66B]'
                    : 'hover:text-[#191D1B]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher + Book Your Stay CTA + Mobile Menu Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div
            className="inline-flex items-center rounded-lg border border-[#E9E2D5] bg-white p-0.5 text-xs"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#183D32] text-white'
                  : 'text-[#525854] hover:text-[#191D1B]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('hi')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                lang === 'hi'
                  ? 'bg-[#183D32] text-white'
                  : 'text-[#525854] hover:text-[#191D1B]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              trackEvent('book_stay_click', { source: 'header' });
              onBookStay();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold text-white bg-[#183D32] hover:bg-[#122E25] rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C6A66B]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>{lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E9E2D5] bg-white text-[#191D1B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#E9E2D5] bg-[#F8F6F0] px-4 py-5 space-y-2 max-h-[82vh] overflow-y-auto shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeHash === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveHash(item.href);
                    setMobileOpen(false);
                  }}
                  className={`block py-2.5 px-3.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#183D32] text-white font-semibold'
                      : 'text-[#191D1B] hover:bg-[#EFECE4]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E9E2D5] flex flex-col sm:flex-row gap-2.5">
            <a
              href={`tel:${HOTEL_INFO.phones[0]}`}
              onClick={() => trackEvent('call_click', { source: 'mobile_drawer' })}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#E9E2D5] bg-white text-xs font-semibold text-[#191D1B]"
            >
              <Phone className="w-3.5 h-3.5 text-[#183D32]" />
              <span className="price-tabular">Call {HOTEL_INFO.phones[0]}</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                trackEvent('book_stay_click', { source: 'mobile_drawer' });
                onBookStay();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs uppercase tracking-[0.14em] font-semibold text-white bg-[#183D32] hover:bg-[#122E25] rounded-lg cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
