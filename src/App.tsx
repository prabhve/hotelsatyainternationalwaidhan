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
import { AIConciergeHub } from './components/AIConciergeHub';
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

  const scrollToRooms = () => {
    const el = document.getElementById('rooms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroQuickReserve = (params: QuickSearchParams) => {
    setSelectedRoomId(params.roomId);
    setOccupancy(params.occupancy);
    setMealPlan(params.mealPlan);
    setBookingTrigger(params);
    scrollToRooms();
  };

  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <div className="min-h-screen bg-[#F8F6F0] text-[#191D1B] flex flex-col selection:bg-[#183D32] selection:text-[#F8F6F0]">
          {/* Sticky Header with Active Scroll Tracking & Language Switcher */}
          <Header
            lang={lang}
            onToggleLang={setLang}
            onBookStay={scrollToRooms}
          />

          <main className="flex-1">
            {/* Top Announcement Strip + Hero + Integrated Booking Search Interface (#booking-widget) + 4 Hotel Highlights */}
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

            {/* Rooms & Suites (#rooms) — 7 Room Categories + Compare Drawer + 6-Step Booking Request Modal */}
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

            {/* Dining (#dining-events: Sharda Restaurant & Blue Diamond Bar) + Banquets & Events (#banquets) */}
            <DiningAndEventsSection lang={lang} />

            {/* Facilities (#facilities) + Corporate (#corporate) + About Us & Leadership (#about) */}
            <HeritageAndLeadershipSection lang={lang} />

            {/* Filterable Photo Gallery (#gallery) + Lightbox + Video Tour Link */}
            <GallerySection lang={lang} />

            {/* AI Hospitality Concierge & Event Visualizer Studio (#concierge-studio) */}
            <AIConciergeHub />

            {/* Verified Guest Reviews & Google Maps Portal (#reviews) */}
            <ReviewsDashboardSection lang={lang} />

            {/* Interactive Location Map & Corridor Distance Matrix (#location) */}
            <LocationMapSection lang={lang} />

            {/* 14-Item Policies & FAQ Accordion + Owner Confirmation Checklist (#policies-faq) */}
            <SeoAeoSection lang={lang} />
          </main>

          {/* 24×7 Contact Form (#contact) + Global Footer + Floating/Sticky Action Bars */}
          <Footer lang={lang} onBookStay={scrollToRooms} />
        </div>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
