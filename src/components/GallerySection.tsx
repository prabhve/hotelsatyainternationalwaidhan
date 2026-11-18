import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Film, X } from 'lucide-react';
import { GALLERY_ITEMS, Language, UI_TRANSLATIONS } from '../data/hotelData';
import { SafeImage } from './SafeImage';

interface GallerySectionProps {
  lang: Language;
}

const GALLERY_CATEGORIES = [
  'All',
  'Rooms',
  'Dining',
  'Pool',
  'Bar',
  'Lawn & Events',
  'Exterior',
] as const;

export function GallerySection({ lang }: GallerySectionProps) {
  const [category, setCategory] = useState<(typeof GALLERY_CATEGORIES)[number]>('All');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const t = UI_TRANSLATIONS[lang];

  const visibleItems =
    category === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === category);

  const displayedItems = showAll ? visibleItems : visibleItems.slice(0, 12);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, visibleItems.length]);

  const activeItem =
    lightboxIdx !== null && visibleItems[lightboxIdx]
      ? visibleItems[lightboxIdx]
      : null;

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#F3EFE8] scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
              Section 9 · Property Lookbook ({GALLERY_ITEMS.length} Verified Photos)
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
              {t.sections.galleryTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#E5DFD3] rounded-2xl">
            {GALLERY_CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? GALLERY_ITEMS.length
                  : GALLERY_ITEMS.filter((g) => g.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setLightboxIdx(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    category === cat
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Larger Readable Thumbnails Masonry / Bento Grid (Fix #6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, i) => (
            <button
              key={`${item.title}-${i}`}
              type="button"
              onClick={() => setLightboxIdx(i)}
              className="group text-left bg-white border border-[#E5DFD3] hover:border-[#8A5A12] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs transition-all focus-visible:outline-2 focus-visible:outline-[#8A5A12]"
            >
              <div className="aspect-[4/3] w-full bg-[#EFEAE1] overflow-hidden relative">
                <SafeImage
                  src={item.src}
                  alt={`${item.title} — ${item.subtitle}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/55 text-white text-[11px] font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-3 h-3" aria-hidden="true" />
                  View
                </div>
              </div>
              <div className="p-4 sm:p-5 w-full">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#8A5A12]">
                    {item.category}
                  </span>
                  <span className="price-tabular text-[11px] text-[#666666]">
                    Photo {i + 1}
                  </span>
                </div>
                <p className="font-display text-xl font-semibold text-[#1A1A1A]">
                  {item.title}
                </p>
                <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>

        {visibleItems.length > 12 && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="px-6 py-3 bg-white border border-[#D8CFC0] hover:border-[#8A5A12] text-xs sm:text-sm font-semibold text-[#1A1A1A] rounded-xl transition-colors"
            >
              {showAll
                ? 'Show Featured 12 Photos'
                : `Load All ${visibleItems.length} High-Resolution Photos`}
            </button>
          </div>
        )}

        {/* Optional Video Tour Embed Placeholder */}
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] border border-[#E5DFD3] flex items-center justify-center text-[#8A5A12] shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A12]">
                Property Walk-Through Video Tour [PLACEHOLDER]
              </p>
              <h3 className="font-display text-2xl font-semibold text-[#1A1A1A] mt-0.5">
                360° & Drone Video Showcase of Suites, Pool & 3,000-Guest Wedding Lawn
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 max-w-2xl">
                {/* REPLACE WITH REAL VIDEO EMBED URL (YouTube / Vimeo / MP4) */}
                [PLACEHOLDER: Embed official YouTube/MP4 hotel walk-through video URL here, or use the AI Concierge & Media Studio below to animate any hotel photo into a motion walk-through clip.]
              </p>
            </div>
          </div>
          <a
            href="#concierge-studio"
            className="px-5 py-3 bg-[#183D32] hover:bg-[#122E25] text-white text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors"
          >
            Open Motion Video Studio
          </a>
        </div>
      </div>

      {/* Fullscreen Lightbox with Keyboard & Touch Swipe Navigation */}
      {activeItem && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIdx(null)}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (delta > 40) {
              setLightboxIdx(
                (lightboxIdx - 1 + visibleItems.length) % visibleItems.length
              );
            } else if (delta < -40) {
              setLightboxIdx((lightboxIdx + 1) % visibleItems.length);
            }
            setTouchStartX(null);
          }}
        >
          <div
            className="max-w-4xl w-full bg-[#FAF8F4] rounded-2xl overflow-hidden border border-[#E5DFD3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5DFD3]">
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">
                  {activeItem.title} · {activeItem.category}
                </p>
                <p className="text-xs text-[#5A5A5A]">{activeItem.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs price-tabular font-semibold text-[#5A5A5A] mr-2">
                  {lightboxIdx + 1} / {visibleItems.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx(
                      (lightboxIdx - 1 + visibleItems.length) % visibleItems.length
                    )
                  }
                  aria-label="Previous photo"
                  className="p-2 rounded-xl border border-[#E5DFD3] bg-white hover:bg-[#F2EDE4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx + 1) % visibleItems.length)
                  }
                  aria-label="Next photo"
                  className="p-2 rounded-xl border border-[#E5DFD3] bg-white hover:bg-[#F2EDE4]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx(null)}
                  aria-label="Close photo preview"
                  className="p-2 rounded-xl border border-[#E5DFD3] bg-white hover:bg-[#F2EDE4]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-black max-h-[75vh] flex items-center justify-center">
              <SafeImage
                src={activeItem.src}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
