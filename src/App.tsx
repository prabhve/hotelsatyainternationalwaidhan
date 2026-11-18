/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { Header } from './components/Header';
import { HeroSection, QuickSearchParams } from './components/HeroSection';
import { RoomsAndBookingSection } from './components/RoomsAndBookingSection';
import { DiningAndEventsSection } from './components/DiningAndEventsSection';
import { HeritageAndLeadershipSection } from './components/HeritageAndLeadershipSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsDashboardSection } from './components/ReviewsDashboardSection';
import { LocationMapSection } from './components/LocationMapSection';
import { SeoAeoSection } from './components/SeoAeoSection';
import { Footer } from './components/Footer';
import {
  ROOM_CATEGORIES,
  OccupancyType,
  MealPlanCode,
  Language,
} from './data/hotelData';

export default function App() {
  // Bilingual Toggle State ('en' | 'hi')
  const [lang, setLang] = useState<Language>('en');

  // Shared Synchronized Room, Occupancy & Meal Plan State across Hero Widget, Tariff Inspector & Room Cards
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOM_CATEGORIES[0].id);
  const [occupancy, setOccupancy] = useState<OccupancyType>('Single');
  const [mealPlan, setMealPlan] = useState<MealPlanCode>('EP');

  const [bookingTrigger, setBookingTrigger] = useState<QuickSearchParams | null>(null);

  const scrollToAccommodations = () => {
    const el = document.getElementById('accommodations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroQuickReserve = (params: QuickSearchParams) => {
    setSelectedRoomId(params.roomId);
    setOccupancy(params.occupancy);
    setMealPlan(params.mealPlan);
    setBookingTrigger(params);
    scrollToAccommodations();
  };

  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <div className="min-h-screen bg-[#FAF8F4] text-[#1A1A1A] flex flex-col selection:bg-[#8A5A12] selection:text-[#FAF8F4]">
          {/* Sticky Header */}
          <Header lang={lang} onBookStay={scrollToAccommodations} />

          <main className="flex-1">
            {/* Top Announcement Strip + Language Toggle + Section 1 (Hero) + Section 2 (4 Highlight Cards) + Section 3 (Direct Booking Widget) */}
            <HeroSection
              lang={lang}
              onToggleLang={setLang}
              selectedRoomId={selectedRoomId}
              onSelectRoomId={setSelectedRoomId}
              occupancy={occupancy}
              onChangeOccupancy={setOccupancy}
              mealPlan={mealPlan}
              onChangeMealPlan={setMealPlan}
              onQuickReserve={handleHeroQuickReserve}
            />

            {/* Section 4 — Accommodations & Published Tariffs (Synced with Hero Widget + Compare Drawer + GST/UPI Modal) */}
            <RoomsAndBookingSection
              lang={lang}
              selectedRoomId={selectedRoomId}
              onSelectRoomId={setSelectedRoomId}
              occupancy={occupancy}
              onChangeOccupancy={setOccupancy}
              mealPlan={mealPlan}
              onChangeMealPlan={setMealPlan}
              bookingTrigger={bookingTrigger}
              onClearTrigger={() => setBookingTrigger(null)}
            />

            {/* Section 5 (Sharda Restaurant & Blue Diamond Bar) + Section 6 (Banquets, 3,000-Guest Lawns & Event Enquiry Form) */}
            <DiningAndEventsSection lang={lang} />

            {/* Section 7 (16-Facility Icon Grid & Pool Rules) + Section 8 (Corporate & Long-Stay Block + Heritage & Leadership) */}
            <HeritageAndLeadershipSection lang={lang} />

            {/* Section 9 — Filterable Photo Gallery (Larger 3-Col Cards + Lightbox + Video Tour Placeholder) */}
            <GallerySection lang={lang} />

            {/* Section 10 — Verified Guest Reviews Dashboard ([PLACEHOLDER REVIEW] benchmarks + Live Firestore + Spotlight Carousel) */}
            <ReviewsDashboardSection lang={lang} />

            {/* Section 11 — Location & Singrauli Power Corridor Distance Table + Cab/Pickup Booking Modal */}
            <LocationMapSection lang={lang} />

            {/* Section 12 — 14-Item Policies & FAQ Accordion + Owner [PLACEHOLDER] Checklist + GEO/AEO Studio */}
            <SeoAeoSection lang={lang} />
          </main>

          {/* Section 13 (24×7 Contact Form & Reception Desk) + Global Footer + Floating/Sticky Action Bars */}
          <Footer lang={lang} onBookStay={scrollToAccommodations} />
        </div>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
