/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  OpeningWelcomeCurtain,
  sectionChildSpringVariants,
  sectionContainerSpringVariants,
} from './components/MotionPrimitives';
import {
  ROOM_CATEGORIES,
  OccupancyType,
  MealPlanCode,
  Language,
} from './data/hotelData';

interface SectionRevealWrapperProps {
  children: React.ReactNode;
}

function SectionRevealWrapper({ children }: SectionRevealWrapperProps) {
  return (
    <motion.div
      variants={sectionContainerSpringVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={sectionChildSpringVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

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
        <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#F8F6F0] text-[#191D1B] flex flex-col selection:bg-[#183D32] selection:text-[#F8F6F0]">
          {/* Luxury Opening Crest & Curtain Reveal on Page Start */}
          <OpeningWelcomeCurtain />

          {/* Sticky Header with Active Scroll Tracking & Language Switcher */}
          <Header
            lang={lang}
            onToggleLang={setLang}
            onBookStay={scrollToRooms}
          />

          <main className="flex-1 w-full max-w-full overflow-x-clip">
            {/* Hero + Parallax Background + Staggered Headlines + Integrated Booking Search Interface (#booking-widget) + 4 Hotel Highlights */}
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

            {/* Rooms & Suites (#rooms) — 7 Verified Room Categories + Compare Drawer + Booking Request Modal */}
            <SectionRevealWrapper>
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
            </SectionRevealWrapper>

            {/* Dining (#dining-events: Sharda Restaurant & Blue Diamond Bar) + Banquets & Events (#banquets) */}
            <SectionRevealWrapper>
              <DiningAndEventsSection lang={lang} />
            </SectionRevealWrapper>

            {/* Facilities (#facilities) + Corporate (#corporate) + About Us & Leadership (#about) */}
            <SectionRevealWrapper>
              <HeritageAndLeadershipSection lang={lang} />
            </SectionRevealWrapper>

            {/* Filterable Authentic Photo Gallery (#gallery) + Lightbox */}
            <SectionRevealWrapper>
              <GallerySection lang={lang} />
            </SectionRevealWrapper>

            {/* Verified Guest Reviews & Google Maps Portal (#reviews) */}
            <SectionRevealWrapper>
              <ReviewsDashboardSection lang={lang} />
            </SectionRevealWrapper>

            {/* Interactive Location Map & Verified Corridor Distance Matrix (#location) */}
            <SectionRevealWrapper>
              <LocationMapSection lang={lang} />
            </SectionRevealWrapper>

            {/* Guest Policies & Frequently Asked Questions Accordion (#policies-faq) */}
            <SectionRevealWrapper>
              <SeoAeoSection lang={lang} />
            </SectionRevealWrapper>
          </main>

          {/* 24×7 Contact Form (#contact) + Global Footer + Floating/Sticky Action Bars */}
          <Footer lang={lang} onBookStay={scrollToRooms} />
        </div>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
