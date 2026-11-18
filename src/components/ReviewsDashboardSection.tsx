import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageSquareQuote,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import {
  Language,
  ROOM_CATEGORIES,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { useFirebase } from '../contexts/FirebaseContext';
import { Reveal } from './MotionPrimitives';

interface ReviewsDashboardSectionProps {
  lang: Language;
}

const GOOGLE_MAPS_REVIEWS_URL =
  'https://www.google.com/maps/place/Hotel+Satya+International/@24.072285,82.6206458,17z';

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

  const [authorName, setAuthorName] = useState(user?.displayName || '');
  const [stayCategory, setStayCategory] = useState<
    'Business' | 'Family' | 'Wedding & Events' | 'Solo'
  >('Business');
  const [roomStayed, setRoomStayed] = useState(ROOM_CATEGORIES[0].title);
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

  // Only genuine authenticated guest reviews from Firestore
  const liveReviews = useMemo(() => {
    return reviews.map((r) => ({
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
      dateLabel: r.createdAt
        ? r.createdAt.toDate().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Recently submitted',
    }));
  }, [reviews]);

  const metrics = useMemo(() => {
    const count = liveReviews.length;
    if (count === 0) {
      return null;
    }
    const avg = (
      key: 'rating' | 'cleanlinessRating' | 'diningRating' | 'hospitalityRating'
    ) => (liveReviews.reduce((acc, item) => acc + item[key], 0) / count).toFixed(1);

    return {
      overall: avg('rating'),
      cleanliness: avg('cleanlinessRating'),
      dining: avg('diningRating'),
      hospitality: avg('hospitalityRating'),
      count,
    };
  }, [liveReviews]);

  const filteredReviews = useMemo(() => {
    let list =
      categoryFilter === 'All'
        ? [...liveReviews]
        : liveReviews.filter((r) => r.stayCategory === categoryFilter);

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
  }, [liveReviews, categoryFilter, searchQuery, sortBy]);

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
        'Thank you! Your review has been published to our guest ledger.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="py-16 sm:py-24 border-b border-[#E9E2D5] bg-[#F8F6F0] scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#183D32] mb-2">
                {lang === 'hi'
                  ? 'अतिथि अनुभव और सत्यापित समीक्षाएं'
                  : 'Authentic Guest Feedback & Google Maps Reviews'}
              </p>
              <h2
                className="font-display text-[#191D1B] font-medium leading-[1.12]"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 3.1rem)' }}
              >
                {t.sections.reviewsTitle}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <a
                href={GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#183D32] hover:bg-[#122E25] text-white rounded-xl text-xs uppercase tracking-[0.14em] font-semibold transition-colors shrink-0"
              >
                <span>Read & Write Reviews on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Live Metrics Bar (Only displayed when genuine Firestore reviews exist) */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E9E2D5] rounded-xl p-5">
              <p className="text-xs text-[#525854]">Portal Guest Average ({metrics.count})</p>
              <p className="price-tabular text-3xl font-bold text-[#191D1B] mt-1">
                {metrics.overall} <span className="text-xs font-normal text-[#525854]">/ 5.0</span>
              </p>
            </div>
            <div className="bg-white border border-[#E9E2D5] rounded-xl p-5">
              <p className="text-xs text-[#525854]">Room Cleanliness</p>
              <p className="price-tabular text-3xl font-bold text-[#183D32] mt-1">
                {metrics.cleanliness}
              </p>
            </div>
            <div className="bg-white border border-[#E9E2D5] rounded-xl p-5">
              <p className="text-xs text-[#525854]">Sharda Dining</p>
              <p className="price-tabular text-3xl font-bold text-[#8C6B32] mt-1">
                {metrics.dining}
              </p>
            </div>
            <div className="bg-white border border-[#E9E2D5] rounded-xl p-5">
              <p className="text-xs text-[#525854]">Staff Hospitality</p>
              <p className="price-tabular text-3xl font-bold text-[#191D1B] mt-1">
                {metrics.hospitality}
              </p>
            </div>
          </div>
        )}

        {/* Review Feed + Authenticated Guest Review Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Verified Portal Reviews & Google Maps Direct Verification Card */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#E9E2D5] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1">
                {(['All', 'Business', 'Family', 'Wedding & Events', 'Solo'] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-[#183D32] text-white'
                          : 'text-[#525854] hover:text-[#191D1B]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-44">
                  <Search
                    className="w-3.5 h-3.5 text-[#525854] absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter reviews..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B]"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
                  aria-label="Sort reviews"
                  className="px-2.5 py-1.5 text-xs font-semibold bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg text-[#191D1B]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                </select>
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="bg-white border border-[#E9E2D5] rounded-xl p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F8F6F0] border border-[#E9E2D5] flex items-center justify-center mx-auto text-[#183D32]">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div className="max-w-lg mx-auto space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-[#191D1B]">
                    Verified Guest Reviews Only
                  </h3>
                  <p className="text-xs sm:text-sm text-[#525854] leading-relaxed">
                    We do not display synthetic or unverified testimonials. Read public guest reviews directly on our official Google Maps listing, or sign in with Google to share your own stay experience here.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={GOOGLE_MAPS_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#183D32] text-[#183D32] hover:bg-[#183D32] hover:text-white text-xs font-semibold uppercase tracking-[0.13em] transition-colors"
                  >
                    <span>View Public Reviews on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white border border-[#E9E2D5] rounded-xl p-6 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                    <div className="text-xs text-[#525854] flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#191D1B]">{rev.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.stayCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.roomStayed}</span>
                    </div>
                    <div className="flex items-center gap-1 price-tabular text-sm font-bold text-[#8C6B32]">
                      <Star
                        className="w-4 h-4 fill-[#C6A66B] text-[#C6A66B]"
                        aria-hidden="true"
                      />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-[#191D1B] mb-1.5">
                    {rev.title}
                  </h3>
                  <p className="text-sm text-[#525854] leading-relaxed mb-3">
                    {rev.comment}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#525854] pt-3 border-t border-[#E9E2D5]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span>{rev.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="price-tabular">
                        Cleanliness {rev.cleanlinessRating}★ · Dining {rev.diningRating}★ · Service{' '}
                        {rev.hospitalityRating}★
                      </span>
                      {rev.verifiedStay && (
                        <span className="inline-flex items-center gap-1 text-[#183D32] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Verified Stay
                        </span>
                      )}
                    </div>
                    {user && (user.uid === rev.userId || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => deleteReview(rev.id)}
                        className="inline-flex items-center gap-1 text-red-700 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    )}
                  </div>

                  {rev.ownerReply && (
                    <div className="mt-4 p-4 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5]">
                      <p className="text-xs font-bold text-[#183D32] mb-1">
                        Management Response · Hotel Satya International
                      </p>
                      <p className="text-xs text-[#525854] leading-relaxed">
                        {rev.ownerReply}
                      </p>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-4 pt-3 border-t border-[#E9E2D5] flex flex-col sm:flex-row gap-2">
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
                        className="flex-1 px-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
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
                        className="px-3 py-1.5 text-xs font-semibold bg-[#183D32] text-white rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        Save Reply & Verify
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Right 5 Columns: Authenticated Guest Review Submission Card */}
          <div className="lg:col-span-5 bg-white border border-[#E9E2D5] rounded-xl p-6 sm:p-8 shadow-2xs">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#183D32] mb-1.5">
              Authenticated Guest Ledger
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#191D1B] mb-2">
              Share Your Stay Experience
            </h3>
            <p className="text-xs text-[#525854] mb-5">
              Sign in with your verified Google account to publish feedback from your stay or dining visit at Hotel Satya International.
            </p>

            {successMsg && (
              <p className="mb-4 text-xs text-[#183D32] bg-[#183D32]/10 border border-[#183D32]/25 rounded-lg px-3 py-2.5">
                {successMsg}
              </p>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#525854] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder={user?.displayName || 'Guest name'}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#525854] mb-1">
                    Trip Type
                  </label>
                  <select
                    value={stayCategory}
                    onChange={(e) =>
                      setStayCategory(e.target.value as typeof stayCategory)
                    }
                    className="w-full px-3 py-2 text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
                  >
                    <option value="Business">Business</option>
                    <option value="Family">Family</option>
                    <option value="Wedding & Events">Wedding & Events</option>
                    <option value="Solo">Solo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525854] mb-1">
                  Room / Venue Experienced
                </label>
                <select
                  value={roomStayed}
                  onChange={(e) => setRoomStayed(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
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
              <div className="bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg p-3.5 space-y-2.5">
                {[
                  { label: 'Overall Rating', val: rating, set: setRating },
                  {
                    label: 'Room Cleanliness',
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
                    <span className="text-xs font-semibold text-[#191D1B]">
                      {dim.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => dim.set(starNum)}
                          aria-label={`Rate ${dim.label} ${starNum} out of 5`}
                          className="p-0.5 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              starNum <= dim.val
                                ? 'fill-[#C6A66B] text-[#C6A66B]'
                                : 'text-[#D8CFC0]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="price-tabular text-xs font-bold text-[#191D1B] ml-1 w-6 text-right">
                        {dim.val}.0
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525854] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Comfortable stay in Waidhan"
                  className="w-full px-3 py-2 text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525854] mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  maxLength={1200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on room comfort, dining at Sharda Restaurant, or reception service..."
                  className="w-full px-3 py-2 text-sm bg-[#F8F6F0] border border-[#E9E2D5] rounded-lg"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#183D32] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-lg hover:bg-[#122E25] disabled:opacity-60 transition-colors cursor-pointer"
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
