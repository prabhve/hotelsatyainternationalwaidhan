import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  Phone,
  Calendar,
  ChevronDown,
  MapPin,
  Globe,
} from 'lucide-react';
import { HOTEL_INFO, Language, UI_TRANSLATIONS } from '../data/hotelData';
import { trackEvent } from '../lib/analytics';
import { LUXURY_EASE, ScrollProgressBar } from './MotionPrimitives';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onBookStay: () => void;
}

export function Header({ lang, onToggleLang, onBookStay }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [activeHash, setActiveHash] = useState('#top');
  const moreDropdownRef = useRef<HTMLDivElement>(null);

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

    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      // Update active section indicator based on scroll position
      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveHash(`#${sectionIds[i]}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close "More" dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const t = UI_TRANSLATIONS[lang];

  const primaryLinks = [
    { href: '#top', label: t.nav.home },
    { href: '#rooms', label: t.nav.rooms },
    { href: '#dining-events', label: t.nav.dining },
    { href: '#banquets', label: t.nav.banquets },
    { href: '#facilities', label: t.nav.facilities },
    { href: '#gallery', label: t.nav.gallery },
  ];

  const moreLinks = [
    { href: '#about', label: t.nav.about },
    { href: '#location', label: t.nav.location },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = (href: string) => {
    setActiveHash(href);
    setMoreOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -44, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.4, ease: LUXURY_EASE }}
        className={`sticky top-0 z-40 w-full max-w-full transition-colors duration-300 ${
          scrolled
            ? 'bg-[#F8F6F0]/95 backdrop-blur-md shadow-[0_6px_24px_rgba(25,29,27,0.08)]'
            : 'bg-[#F8F6F0]'
        }`}
      >
        {/* Top Announcement Bar (Hidden on very small mobile screens to avoid clutter, dismissible with smooth animation) */}
        <AnimatePresence initial={false}>
          {showAnnouncement && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: LUXURY_EASE }}
              className="hidden sm:block bg-[#183D32] text-[#F8F6F0] border-b border-[#C6A66B]/25 px-4 lg:px-8 py-2 text-xs"
            >
              <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 tracking-wide">
                  <span className="font-semibold text-[#C6A66B]">
                    {lang === 'hi' ? 'अतिथि देवो भव:' : 'Atithi Devo Bhava'}
                  </span>
                  <span className="text-[#F8F6F0]/40" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-[#F8F6F0]/95">
                    {lang === 'hi'
                      ? 'डायरेक्ट बुकिंग सहायता · निःशुल्क वाई-फाई और स्विमिंग पूल सुविधा'
                      : 'Direct Reservation Assistance · Complimentary Wi-Fi & Swimming Pool Access'}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <a
                    href={`tel:${HOTEL_INFO.phones[0]}`}
                    onClick={() => trackEvent('call_click', { source: 'announcement_bar' })}
                    className="inline-flex items-center gap-1.5 price-tabular font-semibold text-[#C6A66B] hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{HOTEL_INFO.phones[0]}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowAnnouncement(false)}
                    aria-label="Dismiss announcement bar"
                    className="text-[#F8F6F0]/75 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Header Bar */}
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="h-[68px] sm:h-[82px] flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Identity (Original Crest + Serif Wordmark + Waidhan Subtitle) */}
            <a
              href="#top"
              onClick={() => handleNavClick('#top')}
              aria-label={`${HOTEL_INFO.name} — Home`}
              className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 flex-1 xl:flex-initial"
            >
              {/* Official Hotel Satya International Emblem Crest */}
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-white border border-[#E2DACB] shadow-2xs overflow-hidden flex items-center justify-start shrink-0 transition-transform duration-300 group-hover:scale-[1.04]"
                title="Hotel Satya International Official Crest"
              >
                <img
                  src={HOTEL_INFO.logo}
                  alt="Hotel Satya International Crest"
                  className="h-7 sm:h-9 w-auto max-w-none object-left object-contain ml-[2.5px] sm:ml-[3px]"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-display text-[17px] sm:text-[23px] font-semibold tracking-tight text-[#191D1B] group-hover:text-[#183D32] transition-colors leading-none truncate">
                  {HOTEL_INFO.name}
                </span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.11em] sm:tracking-[0.2em] text-[#77756F] font-semibold mt-1 sm:mt-1.5 leading-none truncate">
                  {t.brandSub}
                </span>
              </div>
            </a>

            {/* Desktop Navigation: Home | Rooms & Suites | Dining | Events & Banquets | Facilities | Gallery | More */}
            <nav
              aria-label="Primary Navigation"
              className="hidden xl:flex items-center gap-6"
            >
              {primaryLinks.map((item) => {
                const isActive = activeHash === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative py-2 text-[13px] font-medium tracking-[0.02em] transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[#183D32] font-semibold'
                        : 'text-[#191D1B]/85 hover:text-[#183D32]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="header-active-underline"
                        transition={{ duration: 0.3, ease: LUXURY_EASE }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A66B] rounded-full"
                      />
                    )}
                  </a>
                );
              })}

              {/* Accessible "More" Dropdown (About Us, Location, Contact) */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    moreOpen || moreLinks.some((l) => l.href === activeHash)
                      ? 'text-[#183D32] font-semibold'
                      : 'text-[#191D1B]/85 hover:text-[#183D32]'
                  }`}
                >
                  <span>{lang === 'hi' ? 'अधिक' : 'More'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moreOpen ? 'rotate-180 text-[#183D32]' : 'text-[#77756F]'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Additional Pages"
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: LUXURY_EASE }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#E9E2D5] shadow-lg py-2 z-50 origin-top-right"
                    >
                      {moreLinks.map((subItem) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          role="menuitem"
                          onClick={() => handleNavClick(subItem.href)}
                          className="flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-[#191D1B] hover:bg-[#F8F6F0] hover:text-[#183D32] transition-colors"
                        >
                          <span>{subItem.label}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Actions: Language Toggle + Primary Booking CTA + Mobile Hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
              {/* Language Toggle (EN | हिन्दी) */}
              <div
                role="group"
                aria-label="Language Switcher"
                className="inline-flex items-center rounded-lg border border-[#E2DACB] bg-white p-0.5 text-[10px] sm:text-[11px] font-semibold shrink-0"
              >
                <button
                  type="button"
                  onClick={() => onToggleLang('en')}
                  aria-pressed={lang === 'en'}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md transition-colors cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#183D32] text-white'
                      : 'text-[#77756F] hover:text-[#191D1B]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onToggleLang('hi')}
                  aria-pressed={lang === 'hi'}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md transition-colors cursor-pointer ${
                    lang === 'hi'
                      ? 'bg-[#183D32] text-white'
                      : 'text-[#77756F] hover:text-[#191D1B]'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Primary CTA Button: BOOK YOUR STAY */}
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: LUXURY_EASE }}
                onClick={() => {
                  trackEvent('book_stay_click', { location: 'header_desktop' });
                  onBookStay();
                }}
                className="btn-gold-sheen hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-white text-xs uppercase tracking-[0.14em] font-semibold transition-colors shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>{t.nav.bookStay}</span>
              </motion.button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                className="xl:hidden p-2 sm:p-2.5 rounded-lg border border-[#E2DACB] bg-white text-[#191D1B] hover:border-[#183D32] transition-colors cursor-pointer shrink-0"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Progress Indicator Bar Directly Beneath Sticky Header */}
        <ScrollProgressBar />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: LUXURY_EASE }}
              className="xl:hidden bg-[#F8F6F0] border-b border-[#E9E2D5] px-4 pt-3 pb-6 shadow-xl"
            >
              <div className="max-w-lg mx-auto space-y-4">
                {/* Mobile Location Note */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D5] text-xs text-[#77756F]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#191D1B]">
                    <MapPin className="w-3.5 h-3.5 text-[#183D32]" />
                    <span>Main Road, Belaunji, Waidhan</span>
                  </span>
                  <span className="price-tabular font-semibold text-[#183D32]">Est. 2011</span>
                </div>

                {/* Primary & Secondary Navigation Links */}
                <nav aria-label="Mobile Navigation" className="grid grid-cols-1 gap-1">
                  {[...primaryLinks, ...moreLinks].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#191D1B] hover:bg-white hover:text-[#183D32] transition-colors"
                    >
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>

                {/* Mobile Language Switcher + Direct Phone + Book Your Stay CTA */}
                <div className="pt-3 border-t border-[#E9E2D5] space-y-2.5">
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-white border border-[#E9E2D5]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#77756F]">
                      <Globe className="w-3.5 h-3.5 text-[#183D32]" />
                      <span>{lang === 'hi' ? 'भाषा चुनें' : 'Language'}</span>
                    </span>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => onToggleLang('en')}
                        className={`px-2.5 py-1 rounded ${
                          lang === 'en'
                            ? 'bg-[#183D32] text-white'
                            : 'text-[#77756F] hover:text-[#191D1B]'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleLang('hi')}
                        className={`px-2.5 py-1 rounded ${
                          lang === 'hi'
                            ? 'bg-[#183D32] text-white'
                            : 'text-[#77756F] hover:text-[#191D1B]'
                        }`}
                      >
                        हिन्दी
                      </button>
                    </div>
                  </div>

                  <a
                    href={`tel:${HOTEL_INFO.phones[0]}`}
                    onClick={() => {
                      trackEvent('call_click', { location: 'header_mobile_drawer' });
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white border border-[#E2DACB] text-xs font-semibold text-[#191D1B] price-tabular"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#183D32]" />
                    <span>24×7 Reception: {HOTEL_INFO.phones[0]}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      trackEvent('book_stay_click', { location: 'header_mobile_drawer' });
                      onBookStay();
                    }}
                    className="w-full py-3.5 rounded-lg bg-[#183D32] hover:bg-[#122E25] text-white text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#C6A66B]" />
                    <span>{t.nav.bookStay}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
