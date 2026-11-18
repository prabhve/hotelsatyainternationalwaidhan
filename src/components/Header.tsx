import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Language, UI_TRANSLATIONS } from '../data/hotelData';
import { trackEvent } from '../lib/analytics';

interface HeaderProps {
  lang: Language;
  onBookStay: () => void;
}

export function Header({ lang, onBookStay }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  const navItems = [
    { label: t.nav.rooms, href: '#rooms' },
    { label: t.nav.dining, href: '#dining-events' },
    { label: t.nav.banquets, href: '#banquets' },
    { label: t.nav.facilities, href: '#facilities' },
    { label: t.nav.location, href: '#location' },
  ];

  const mobileNavItems = [
    { label: t.nav.home, href: '#top' },
    { label: t.nav.rooms, href: '#rooms' },
    { label: t.nav.dining, href: '#dining-events' },
    { label: t.nav.banquets, href: '#banquets' },
    { label: t.nav.facilities, href: '#facilities' },
    { label: t.nav.corporate, href: '#corporate' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.location, href: '#location' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E5DFD3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#top"
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#1A1A1A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8A5A12]"
        >
          Hotel Satya International
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A4A4A]"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#1A1A1A] hover:underline underline-offset-4 decoration-[#B8862B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8A5A12]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              trackEvent('book_stay_click', { source: 'header' });
              onBookStay();
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#1A1A1A] rounded-xl hover:bg-[#2E2E2E] shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8A5A12]"
          >
            {t.bookStay}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#E5DFD3] text-[#1A1A1A] hover:bg-[#F2EDE4] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5DFD3] bg-[#FAF8F4] px-4 py-4 space-y-1.5 max-h-[80vh] overflow-y-auto shadow-lg">
          {mobileNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 text-sm font-medium text-[#1A1A1A] rounded-xl hover:bg-[#F2EDE4]"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              trackEvent('book_stay_click', { source: 'mobile_drawer' });
              onBookStay();
            }}
            className="w-full mt-2 px-5 py-3 text-sm font-semibold text-white bg-[#1A1A1A] rounded-xl"
          >
            {t.bookStay}
          </button>
        </div>
      )}
    </header>
  );
}
