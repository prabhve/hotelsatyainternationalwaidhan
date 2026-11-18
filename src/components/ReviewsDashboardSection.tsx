import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import {
  BOOKING_CONFIG,
  HISTORICAL_BENCHMARK_REVIEWS,
  Language,
  ROOM_CATEGORIES,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { useFirebase } from '../contexts/FirebaseContext';

interface ReviewsDashboardSectionProps {
  lang: Language;
}

export function ReviewsDashboardSection({ lang }: ReviewsDashboardSectionProps) {
  const {
    user,
    isAdmin,
    reviews,
    signInWithGoogle,
    createReview,
    deleteReview,
    adminReplyReview,
  } = useFirebase();

  const t = UI_TRANSLATIONS[lang];

  const [categoryFilter, setCategoryFilter] = useState<
    'All' | 'Business' | 'Family' | 'Wedding & Events' | 'Solo'
  >('All');
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIdx, setCarouselIdx] = useState(0);

  const [authorName, setAuthorName] = useState(user?.displayName || '');
  const [stayCategory, setStayCategory] = useState<
    'Business' | 'Family' | 'Wedding & Events' | 'Solo'
  >('Business');
  const [roomStayed, setRoomStayed] = useState(ROOM_CATEGORIES[2].title);
  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [diningRating, setDiningRating] = useState(5);
  const [hospitalityRating, setHospitalityRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // Merge live Firestore reviews + clearly marked [PLACEHOLDER REVIEW] entries
  const combinedReviews = useMemo(() => {
    const liveMapped = reviews.map((r) => ({
      id: r.reviewId,
      userId: r.userId,
      authorName: r.authorName,
      stayCategory: r.stayCategory,
      roomStayed: r.roomStayed,
      rating: r.rating,
      cleanlinessRating: r.cleanlinessRating,
      diningRating: r.diningRating,
      hospitalityRating: r.hospitalityRating,
      title: r.title,
      comment: r.comment,
      verifiedStay: r.verifiedStay,
      ownerReply: r.ownerReply,
      isLive: true,
      isPlaceholder: false,
      sourceLabel: 'Direct Guest Review',
      dateLabel: r.createdAt
        ? r.createdAt.toDate().toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric',
          })
        : 'Just now',
    }));

    const historicalMapped = HISTORICAL_BENCHMARK_REVIEWS.map((h) => ({
      id: h.id,
      userId: '',
      authorName: h.authorName,
      stayCategory: h.stayCategory,
      roomStayed: h.roomStayed,
      rating: h.rating,
      cleanlinessRating: h.cleanlinessRating,
      diningRating: h.diningRating,
      hospitalityRating: h.hospitalityRating,
      title: h.title,
      comment: h.comment,
      verifiedStay: true,
      ownerReply: '',
      isLive: false,
      isPlaceholder: true,
      sourceLabel: h.sourceLabel,
      dateLabel: `${h.sourceLabel} · ${h.dateLabel}`,
    }));

    return [...liveMapped, ...historicalMapped];
  }, [reviews]);

  // Auto-advance horizontal highlight carousel
  useEffect(() => {
    if (combinedReviews.length <= 1) return;
    const timer = window.setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % combinedReviews.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [combinedReviews.length]);

  const metrics = useMemo(() => {
    const list = combinedReviews;
    const count = list.length || 1;
    const avg = (
      key: 'rating' | 'cleanlinessRating' | 'diningRating' | 'hospitalityRating'
    ) => (list.reduce((acc, item) => acc + item[key], 0) / count).toFixed(1);

    const dist = [5, 4, 3, 2, 1].map((star) => {
      const matched = list.filter((r) => Math.round(r.rating) === star).length;
      return {
        star,
        count: matched,
        pct: Math.round((matched / count) * 100),
      };
    });

    return {
      overall: avg('rating'),
      cleanliness: avg('cleanlinessRating'),
      dining: avg('diningRating'),
      hospitality: avg('hospitalityRating'),
      liveCount: reviews.length,
      totalCount: list.length,
      dist,
    };
  }, [combinedReviews, reviews.length]);

  const filteredReviews = useMemo(() => {
    let list =
      categoryFilter === 'All'
        ? [...combinedReviews]
        : combinedReviews.filter((r) => r.stayCategory === categoryFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.roomStayed.toLowerCase().includes(q) ||
          r.authorName.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [combinedReviews, categoryFilter, searchQuery, sortBy]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!user) {
      const signed = await signInWithGoogle();
      if (!signed) return;
    }

    const finalAuthor = authorName.trim() || user?.displayName || '';
    if (finalAuthor.length < 2) {
      setError('Please enter your display name.');
      return;
    }
    if (title.trim().length < 3 || comment.trim().length < 10) {
      setError(
        'Please enter a short headline and at least 10 characters of feedback.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        authorName: finalAuthor,
        stayCategory,
        roomStayed,
        rating,
        cleanlinessRating,
        diningRating,
        hospitalityRating,
        title: title.trim(),
        comment: comment.trim(),
      });
      setTitle('');
      setComment('');
      setSuccessMsg(
        'Thank you! Your review has been published to our live guest ledger.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const featuredReview = combinedReviews[carouselIdx] || combinedReviews[0];

  return (
    <section
      id="reviews"
      className="py-16 sm:py-24 border-b border-[#E5DFD3] bg-[#FAF8F4] scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A5A12] mb-2">
              Section 10 · Guest Ratings & Review Dashboard
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1A1A] text-balance">
              {t.sections.reviewsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.google.com/maps/place/Hotel+Satya+International/@24.072285,82.6206458,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D8CFC0] hover:border-[#8A5A12] rounded-xl text-xs font-semibold text-[#1A1A1A] transition-colors shrink-0"
            >
              <span>Write a Review on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8A5A12]" />
            </a>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F2EDE4] border border-[#E5DFD3] rounded-xl">
              {(['All', 'Business', 'Family', 'Wedding & Events', 'Solo'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-white text-[#1A1A1A] shadow-2xs'
                        : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Auto-Scrolling Guest Testimonial Spotlight Carousel */}
        {featuredReview && (
          <div className="bg-white border border-[#DFD8CA] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A5A5A]">
                <span className="font-bold text-[#8A5A12]">
                  Featured Guest Spotlight ({carouselIdx + 1}/{combinedReviews.length})
                </span>
                <span aria-hidden="true">·</span>
                <span>{featuredReview.sourceLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredReview.roomStayed}</span>
                {featuredReview.verifiedStay && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1D4E3E] font-semibold">Verified Guest</span>
                  </>
                )}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
                “{featuredReview.title}”
              </h3>
              <p className="text-sm text-[#454545] leading-relaxed">
                {featuredReview.comment}
              </p>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                — {featuredReview.authorName} ({featuredReview.stayCategory})
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() =>
                  setCarouselIdx(
                    (prev) => (prev - 1 + combinedReviews.length) % combinedReviews.length
                  )
                }
                aria-label="Previous review"
                className="w-9 h-9 rounded-xl border border-[#E5DFD3] bg-[#FAF8F4] hover:bg-[#F2EDE4] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCarouselIdx((prev) => (prev + 1) % combinedReviews.length)
                }
                aria-label="Next review"
                className="w-9 h-9 rounded-xl border border-[#E5DFD3] bg-[#FAF8F4] hover:bg-[#F2EDE4] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Aggregate Rating Card + 5-Star Distribution Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-[#5A5A5A]">Aggregate Score</p>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="price-tabular text-3xl font-bold text-[#1A1A1A]">
                  {metrics.overall}
                </span>
                <span className="text-xs text-[#5A5A5A]">/ 5.0</span>
              </div>
              <p className="text-[11px] text-[#8A5A12] font-medium">
                {BOOKING_CONFIG.googleRatingPlaceholder}
              </p>
            </div>

            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-[#5A5A5A]">Suite Cleanliness</p>
              <p className="price-tabular text-3xl font-bold text-[#1A1A1A] my-2">
                {metrics.cleanliness}
              </p>
              <div className="h-1.5 w-full bg-[#F2EDE4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1D4E3E]"
                  style={{ width: `${(Number(metrics.cleanliness) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-[#5A5A5A]">Sharda Dining</p>
              <p className="price-tabular text-3xl font-bold text-[#1A1A1A] my-2">
                {metrics.dining}
              </p>
              <div className="h-1.5 w-full bg-[#F2EDE4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8A5A12]"
                  style={{ width: `${(Number(metrics.dining) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-5 flex flex-col justify-between">
              <p className="text-xs text-[#5A5A5A]">Staff Hospitality</p>
              <p className="price-tabular text-3xl font-bold text-[#1A1A1A] my-2">
                {metrics.hospitality}
              </p>
              <div className="h-1.5 w-full bg-[#F2EDE4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A]"
                  style={{ width: `${(Number(metrics.hospitality) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E5DFD3] rounded-2xl p-5 flex flex-col justify-between">
            <p className="text-xs font-bold text-[#1A1A1A] mb-2">
              Star Rating Distribution ({metrics.liveCount} Live + 4 Sample Placeholders)
            </p>
            <div className="space-y-1.5">
              {metrics.dist.map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-xs">
                  <span className="price-tabular w-8 text-[#454545] font-semibold">
                    {row.star} ★
                  </span>
                  <div className="flex-1 h-2 bg-[#F2EDE4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8A5A12]"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="price-tabular w-9 text-right text-[#5A5A5A]">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Feed + Live Guest Review Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Sort Bar */}
            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-3.5 h-3.5 text-[#5A5A5A] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews (e.g. NTPC, Royal Suite, Wedding, Pool)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#5A5A5A]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
                  aria-label="Sort reviews"
                  className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl text-[#1A1A1A]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                </select>
              </div>
            </div>

            {filteredReviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                  <div className="text-xs text-[#5A5A5A] flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">{rev.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rev.stayCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rev.roomStayed}</span>
                  </div>
                  <div className="flex items-center gap-1 price-tabular text-sm font-bold text-[#8A5A12]">
                    <Star
                      className="w-4 h-4 fill-[#8A5A12] text-[#8A5A12]"
                      aria-hidden="true"
                    />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-1.5">
                  {rev.title}
                </h3>
                <p className="text-sm text-[#454545] leading-relaxed mb-3">
                  {rev.comment}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A5A5A] pt-3 border-t border-[#EFECE6]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span>{rev.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="price-tabular">
                      Cleanliness {rev.cleanlinessRating}★ · Dining {rev.diningRating}★ · Service{' '}
                      {rev.hospitalityRating}★
                    </span>
                    {rev.verifiedStay && (
                      <span className="inline-flex items-center gap-1 text-[#1D4E3E] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Verified Guest
                      </span>
                    )}
                  </div>
                  {rev.isLive && user && (user.uid === rev.userId || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => deleteReview(rev.id)}
                      className="inline-flex items-center gap-1 text-red-700 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>

                {rev.ownerReply && (
                  <div className="mt-4 p-4 rounded-xl bg-[#F3EFE8] border border-[#E5DFD3]">
                    <p className="text-xs font-bold text-[#8A5A12] mb-1">
                      Management Response · Hotel Satya International
                    </p>
                    <p className="text-xs text-[#454545] leading-relaxed">
                      {rev.ownerReply}
                    </p>
                  </div>
                )}

                {rev.isLive && isAdmin && (
                  <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Write management response..."
                      value={replyDrafts[rev.id] ?? rev.ownerReply ?? ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [rev.id]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        adminReplyReview(
                          rev.id,
                          replyDrafts[rev.id] ??
                            rev.ownerReply ??
                            'Thank you for staying with us in Waidhan.',
                          true
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-[#1A1A1A] text-white rounded-xl whitespace-nowrap"
                    >
                      Save Reply & Verify
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Submit Live Guest Review Card */}
          <div className="lg:col-span-5 bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 shadow-2xs">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A12] mb-1.5">
              Direct Guest Ledger
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
              Publish a Verified Guest Review
            </h3>
            <p className="text-xs text-[#5A5A5A] mb-5">
              Share your real stay experience on this website or post directly to Google Maps.
            </p>

            {successMsg && (
              <p className="mb-4 text-xs text-[#1D4E3E] bg-[#1D4E3E]/10 border border-[#1D4E3E]/25 rounded-xl px-3 py-2.5">
                {successMsg}
              </p>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder={user?.displayName || 'Guest name'}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                    Trip Type
                  </label>
                  <select
                    value={stayCategory}
                    onChange={(e) =>
                      setStayCategory(e.target.value as typeof stayCategory)
                    }
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                  >
                    <option value="Business">Business</option>
                    <option value="Family">Family</option>
                    <option value="Wedding & Events">Wedding & Events</option>
                    <option value="Solo">Solo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                  Room / Venue Experienced
                </label>
                <select
                  value={roomStayed}
                  onChange={(e) => setRoomStayed(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                >
                  {ROOM_CATEGORIES.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                  <option value="Sharda Restaurant & Lawn">
                    Sharda Restaurant & Lawn
                  </option>
                </select>
              </div>

              {/* Interactive Star Pickers */}
              <div className="bg-[#FAF8F4] border border-[#E5DFD3] rounded-xl p-3.5 space-y-2.5">
                {[
                  { label: 'Overall Rating', val: rating, set: setRating },
                  {
                    label: 'Suite Cleanliness',
                    val: cleanlinessRating,
                    set: setCleanlinessRating,
                  },
                  {
                    label: 'Sharda Dining & Bar',
                    val: diningRating,
                    set: setDiningRating,
                  },
                  {
                    label: 'Staff Hospitality',
                    val: hospitalityRating,
                    set: setHospitalityRating,
                  },
                ].map((dim) => (
                  <div
                    key={dim.label}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-semibold text-[#454545]">
                      {dim.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => dim.set(starNum)}
                          aria-label={`Rate ${dim.label} ${starNum} out of 5`}
                          className="p-0.5 focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              starNum <= dim.val
                                ? 'fill-[#8A5A12] text-[#8A5A12]'
                                : 'text-[#D8CFC0]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="price-tabular text-xs font-bold text-[#1A1A1A] ml-1 w-6 text-right">
                        {dim.val}.0
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Convenient stay near NTPC Vindhyanagar"
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  maxLength={1200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on room upkeep, dining at Sharda Restaurant, pool, or reception hospitality..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F4] border border-[#D8CFC0] rounded-xl"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2E2E2E] disabled:opacity-60 transition-colors"
              >
                {submitting
                  ? 'Publishing...'
                  : user
                    ? 'Publish Verified Review'
                    : 'Sign In with Google & Publish'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
