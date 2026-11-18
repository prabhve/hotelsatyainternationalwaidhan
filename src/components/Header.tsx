import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Language } from '../data/hotelData';
import { trackEvent } from '../lib/analytics';

interface HeaderProps {
  lang: Language;
  onToggleLang?: (lang: Language) => void;
  onBookStay: () => void;
}

export function Header({ lang, onBookStay }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#top');
  const [scrolled, setScrolled] = useState(false);

  // Strict 5 single-line navigation links for the 3-Zone Top Bar Contract
  const primaryNavItems = [
    { label: lang === 'hi' ? 'रूम्स व सुइट्स' : 'Rooms & Suites', href: '#rooms' },
    { label: lang === 'hi' ? 'डाइनिंग' : 'Dining', href: '#dining-events' },
    { label: lang === 'hi' ? 'बैंक्वेट्स' : 'Banquets', href: '#banquets' },
    { label: lang === 'hi' ? 'सुविधाएं' : 'Facilities', href: '#facilities' },
    { label: lang === 'hi' ? 'लोकेशन' : 'Location', href: '#location' },
  ];

  // Complete navigation list for the mobile drawer
  const mobileNavItems = [
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
      setScrolled(window.scrollY > 12);
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
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E9E2D5]'
          : 'bg-[#F8F6F0] border-b border-[#E9E2D5]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={() => setActiveHash('#top')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#191D1B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#183D32]"
        >
          Hotel Satya International
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#525854]"
          aria-label="Primary Navigation"
        >
          {primaryNavItems.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveHash(item.href)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 relative focus-visible:outline-2 focus-visible:outline-[#183D32] ${
                  isActive
                    ? 'text-[#183D32] font-semibold underline underline-offset-8 decoration-[#C6A66B] decoration-2'
                    : 'hover:text-[#191D1B] hover:underline underline-offset-8 decoration-[#C6A66B]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              trackEvent('book_stay_click', { source: 'header' });
              onBookStay();
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold text-[#F8F6F0] bg-[#183D32] hover:bg-[#122E25] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C6A66B]"
          >
            {lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E9E2D5] bg-white text-[#191D1B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E9E2D5] bg-[#F8F6F0] px-4 py-5 space-y-1.5 max-h-[82vh] overflow-y-auto shadow-lg">
          {mobileNavItems.map((item) => {
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
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              trackEvent('book_stay_click', { source: 'mobile_drawer' });
              onBookStay();
            }}
            className="w-full mt-2 py-3 px-5 text-xs uppercase tracking-[0.14em] font-semibold text-white bg-[#183D32] hover:bg-[#122E25] rounded-lg cursor-pointer"
          >
            {lang === 'hi' ? 'प्रवास बुक करें' : 'Book Your Stay'}
          </button>
        </div>
      )}
    </header>
  );
}
