import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Car,
  Train,
  Plane,
  Factory,
  Compass,
  Clock,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  HOTEL_INFO,
  NEARBY_LANDMARKS,
  LandmarkItem,
  Language,
  UI_TRANSLATIONS,
} from '../data/hotelData';
import { buildWhatsAppUrl, trackEvent } from '../lib/analytics';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const HAS_VALID_KEY = Boolean(API_KEY && API_KEY !== 'YOUR_API_KEY');

const HOTEL_COORDS = {
  lat: HOTEL_INFO.coordinates.lat,
  lng: HOTEL_INFO.coordinates.lng,
};

const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Hotel+Satya+International/@24.072285,82.6206458,17z';

interface MapPolyline {
  setMap: (map: unknown) => void;
}

function RouteComputeController({
  destination,
  onRouteResult,
}: {
  destination: LandmarkItem | null;
  onRouteResult: (info: { distanceMeters?: number; duration?: string } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<MapPolyline[]>([]);

  useEffect(() => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!map || !routesLib || !destination) {
      onRouteResult(null);
      return;
    }

    let cancelled = false;
    const RouteClass = (routesLib as unknown as {
      Route?: {
        computeRoutes: (req: unknown) => Promise<{
          routes?: Array<{
            distanceMeters?: number;
            duration?: string;
            createPolylines?: () => MapPolyline[];
            viewport?: unknown;
          }>;
        }>;
      };
    }).Route;

    if (!RouteClass?.computeRoutes) {
      onRouteResult(null);
      return;
    }

    RouteClass.computeRoutes({
      origin: HOTEL_COORDS,
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'duration', 'viewport'],
    })
      .then((res) => {
        if (cancelled) return;
        const route = res?.routes?.[0];
        if (route) {
          if (typeof route.createPolylines === 'function') {
            const newLines = route.createPolylines();
            newLines.forEach((line) => line.setMap(map));
            polylinesRef.current = newLines;
          }
          if (route.viewport) {
            map.fitBounds(route.viewport as never, 48);
          }
          onRouteResult({
            distanceMeters: route.distanceMeters,
            duration: route.duration,
          });
        }
      })
      .catch(() => {
        if (!cancelled) onRouteResult(null);
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, destination, onRouteResult]);

  return null;
}

interface LocationMapSectionProps {
  lang: Language;
}

export function LocationMapSection({ lang }: LocationMapSectionProps) {
  const t = UI_TRANSLATIONS[lang];
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkItem | null>(
    NEARBY_LANDMARKS[0]
  );
  const [showHotelInfo, setShowHotelInfo] = useState(true);
  const [liveRouteInfo, setLiveRouteInfo] = useState<{
    distanceMeters?: number;
    duration?: string;
  } | null>(null);

  // Cab / Pickup Booking Modal State
  const [showCabModal, setShowCabModal] = useState(false);
  const [cabPickupPoint, setCabPickupPoint] = useState('Bargawan Railway Station (BRGW - 25 km)');
  const [cabDate, setCabDate] = useState('');
  const [cabTime, setCabTime] = useState('10:00 AM');
  const [cabVehicle, setCabVehicle] = useState('AC Sedan (Dzire / Etios - up to 3 guests)');
  const [cabGuestName, setCabGuestName] = useState('');
  const [cabGuestPhone, setCabGuestPhone] = useState('');
  const [cabTrainOrFlight, setCabTrainOrFlight] = useState('');

  const getCategoryIcon = (category: LandmarkItem['category']) => {
    switch (category) {
      case 'Transit':
        return <Train className="w-4 h-4 text-[#8A5A12]" />;
      case 'Power & Industry':
        return <Factory className="w-4 h-4 text-[#8A5A12]" />;
      case 'Tourism':
        return <Compass className="w-4 h-4 text-[#8A5A12]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#8A5A12]" />;
    }
  };

  const handleBookCabWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('cab_request', { source: 'cab_pickup_modal', pickup: cabPickupPoint });
    const msg = [
      `Namaste Hotel Satya International Travel Desk,`,
      ``,
      `I would like to arrange a Station / Airport / Plant Cab Transfer:`,
      `• Pickup / Drop Point: ${cabPickupPoint}`,
      `• Date & Time: ${cabDate || 'Flexible'} at ${cabTime}`,
      `• Vehicle Preference: ${cabVehicle}`,
      `• Train / Flight / Gate Details: ${cabTrainOrFlight || 'Will share shortly'}`,
      `• Guest Name: ${cabGuestName}`,
      `• Mobile: ${cabGuestPhone}`,
      ``,
      `Please confirm driver details and tariff.`,
    ].join('\n');

    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    setShowCabModal(false);
  };

  return (
    <section id="location" className="py-20 lg:py-24 bg-[#FAF8F4] border-b border-[#E5DEC9]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8A5A12] font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'लोकेशन और औद्योगिक कॉरिडोर दूरी'
                  : 'Singrauli Power Corridor & Location'}
              </span>
            </div>
            <h2
              className="font-serif text-[#1A1A1A] font-medium leading-[1.12]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              {t.sections.locationTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCabModal(true);
                trackEvent('cab_request', { action: 'open_modal' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8A5A12] text-[#FAF8F4] hover:bg-[#1A1A1A] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Car className="w-4 h-4" />
              <span>
                {lang === 'hi'
                  ? 'स्टेशन / एयरपोर्ट कैब पिकअप बुक करें'
                  : 'Arrange Station / Plant Cab Pickup'}
              </span>
            </button>
            <a
              href={GOOGLE_MAPS_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cab_request', { action: 'directions_click' })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A1A1A] text-[#FAF8F4] hover:bg-[#8A5A12] text-xs uppercase tracking-[0.14em] font-semibold transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#D9A74A]" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>
          </div>
        </div>

        {/* Interactive Map + Distance Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Complete Distance Table & Address Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* Official Address & Coordinates Card */}
            <div className="p-6 rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9]">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#8A5A12] font-bold">
                  Verified GPS & Postal Address
                </span>
                <span className="price-tabular text-xs font-bold text-[#5C564D] bg-[#FAF8F4] px-2.5 py-1 rounded-md border border-[#E5DEC9]">
                  24.0723° N, 82.6206° E
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#1A1A1A] font-medium mb-1">
                {HOTEL_INFO.name}
              </h3>
              <p className="text-sm text-[#5C564D] leading-relaxed mb-4">
                {HOTEL_INFO.address}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E5DEC9]">
                <a
                  href={`tel:${HOTEL_INFO.phones[0]}`}
                  onClick={() => trackEvent('call_click', { location: 'map_card' })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] bg-[#FAF8F4] px-3 py-2 rounded-lg border border-[#D8D0BE] hover:border-[#8A5A12]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#8A5A12]" />
                  <span className="price-tabular">{HOTEL_INFO.phones[0]}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowCabModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5A12] bg-[#FAF8F4] px-3 py-2 rounded-lg border border-[#8A5A12]/40 hover:bg-[#8A5A12] hover:text-white transition-colors cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Request Travel Desk Pickup</span>
                </button>
              </div>
            </div>

            {/* Section 11 Distance Table */}
            <div className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-[#1A1A1A] text-[#FAF8F4] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#D9A74A] font-semibold block">
                    Interactive Corridor Matrix
                  </span>
                  <h4 className="font-serif text-lg font-medium">
                    Key Distances from Hotel Satya
                  </h4>
                </div>
                <span className="text-[11px] text-[#FAF8F4]/70">Click row to plot route</span>
              </div>

              <div className="divide-y divide-[#E5DEC9]">
                {NEARBY_LANDMARKS.map((lm) => {
                  const isSelected = selectedLandmark?.id === lm.id;
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => setSelectedLandmark(lm)}
                      className={`w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected ? 'bg-[#F3EFE6]' : 'hover:bg-[#FAF8F4]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF8F4] border border-[#E5DEC9] flex items-center justify-center shrink-0 mt-0.5">
                          {getCategoryIcon(lm.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {lm.name}
                          </div>
                          <div className="text-xs text-[#5C564D] line-clamp-1">
                            {lm.note}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="price-tabular text-sm font-bold text-[#8A5A12]">
                          {lm.distanceLabel || `${lm.distanceKm} km`}
                        </div>
                        <div className="inline-flex items-center gap-1 text-[11px] text-[#5C564D]">
                          <Clock className="w-3 h-3" />
                          <span>~{lm.driveMinutes} mins</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Live Google Map Canvas + Route Telemetry Bar */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-[#E5DEC9] bg-[#F3EFE6] shadow-md">
              {/* Top Route Telemetry Header */}
              <div className="px-6 py-4 bg-[#1A1A1A] text-[#FAF8F4] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-[#D9A74A]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#FAF8F4]/65">
                      Selected Corridor Route
                    </div>
                    <div className="text-sm font-medium">
                      Hotel Satya International →{' '}
                      <span className="text-[#D9A74A]">
                        {selectedLandmark ? selectedLandmark.name : 'Select a landmark'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLandmark && (
                  <div className="flex items-center gap-4 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F4]/10 border border-[#FAF8F4]/15">
                      <span className="text-[#FAF8F4]/65 mr-1.5">Distance:</span>
                      <span className="price-tabular font-bold text-[#D9A74A]">
                        {liveRouteInfo?.distanceMeters
                          ? `${(liveRouteInfo.distanceMeters / 1000).toFixed(1)} km`
                          : selectedLandmark.distanceLabel || `${selectedLandmark.distanceKm} km`}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#FAF8F4]/10 border border-[#FAF8F4]/15">
                      <span className="text-[#FAF8F4]/65 mr-1.5">Drive Time:</span>
                      <span className="price-tabular font-bold text-[#FAF8F4]">
                        ~{selectedLandmark.driveMinutes} mins
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Google Maps Container */}
              <div className="h-[520px] w-full relative">
                {HAS_VALID_KEY ? (
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      defaultCenter={HOTEL_COORDS}
                      defaultZoom={12}
                      mapId="HOTEL_SATYA_SINGRAULI_MAP"
                      gestureHandling="cooperative"
                      disableDefaultUI={false}
                      className="w-full h-full"
                    >
                      {/* Primary Hotel Marker */}
                      <AdvancedMarker
                        position={HOTEL_COORDS}
                        onClick={() => setShowHotelInfo(true)}
                      >
                        <Pin
                          background="#8A5A12"
                          borderColor="#1A1A1A"
                          glyphColor="#FAF8F4"
                          scale={1.3}
                        />
                      </AdvancedMarker>

                      {showHotelInfo && (
                        <InfoWindow
                          position={HOTEL_COORDS}
                          onCloseClick={() => setShowHotelInfo(false)}
                        >
                          <div className="p-1 max-w-[230px] text-[#1A1A1A]">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#8A5A12] mb-0.5">
                              3-Star Classified Hotel
                            </div>
                            <div className="font-serif font-semibold text-base leading-tight mb-1">
                              Hotel Satya International
                            </div>
                            <p className="text-xs text-[#5C564D] mb-2">
                              Main Road, Belaunji, Waidhan, Singrauli 486886
                            </p>
                            <a
                              href={GOOGLE_MAPS_PLACE_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[#8A5A12] underline"
                            >
                              Open in Google Maps
                            </a>
                          </div>
                        </InfoWindow>
                      )}

                      {/* Landmark Markers */}
                      {NEARBY_LANDMARKS.map((lm) => {
                        const isSelected = selectedLandmark?.id === lm.id;
                        return (
                          <AdvancedMarker
                            key={lm.id}
                            position={{ lat: lm.lat, lng: lm.lng }}
                            onClick={() => setSelectedLandmark(lm)}
                          >
                            <Pin
                              background={isSelected ? '#1A1A1A' : '#5C564D'}
                              borderColor="#FAF8F4"
                              glyphColor="#D9A74A"
                              scale={isSelected ? 1.15 : 0.9}
                            />
                          </AdvancedMarker>
                        );
                      })}

                      {/* Live Route Polyline */}
                      <RouteComputeController
                        destination={selectedLandmark}
                        onRouteResult={setLiveRouteInfo}
                      />
                    </Map>
                  </APIProvider>
                ) : (
                  <iframe
                    title="Hotel Satya International Waidhan Map"
                    src="https://maps.google.com/maps?q=24.072285,82.6206458&hl=en&z=14&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>

              {/* Bottom Travel Desk Strip */}
              <div className="p-5 bg-[#F3EFE6] border-t border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-[#8A5A12] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5C564D] leading-relaxed">
                    <strong className="text-[#1A1A1A]">24×7 Dedicated Travel Desk:</strong> Chauffeur-driven AC sedans, SUVs (Innova Crysta), and Force Urbania coaches available for Bargawan & Singrauli railway transfers, NTPC/Reliance plant gate drops, and Varanasi Airport pickups.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCabModal(true)}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-[#FAF8F4] hover:bg-[#8A5A12] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer"
                >
                  Book Cab Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Station / Airport / Plant Cab Pickup Modal */}
      {showCabModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowCabModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F3EFE6] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E5DEC9] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8A5A12] font-bold mb-2">
              <Car className="w-4 h-4" />
              <span>24×7 Travel Desk · Hotel Satya International</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium mb-2">
              Arrange Station, Airport or Plant Cab Transfer
            </h3>
            <p className="text-xs text-[#5C564D] mb-5">
              Direct chauffeur pickup with placard at Bargawan Station, Singrauli Station, Shaktinagar, or plant gates.
            </p>

            <form onSubmit={handleBookCabWhatsApp} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                  Pickup / Drop Location
                </label>
                <select
                  value={cabPickupPoint}
                  onChange={(e) => setCabPickupPoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A] font-medium"
                >
                  <option value="Bargawan Railway Station (BRGW - 25 km)">
                    Bargawan Railway Station (BRGW - 25 km)
                  </option>
                  <option value="Singrauli Railway Station (SGRL - 22 km)">
                    Singrauli Railway Station (SGRL - 22 km)
                  </option>
                  <option value="Waidhan Bus Stand (1.2 km)">
                    Waidhan Bus Stand (1.2 km)
                  </option>
                  <option value="NTPC Vindhyanagar (VSTPP Gate - 4 km)">
                    NTPC Vindhyanagar (VSTPP Gate - 4 km)
                  </option>
                  <option value="Reliance Sasan Ultra Mega Power Project (18 km)">
                    Reliance Sasan Ultra Mega Power Project (18 km)
                  </option>
                  <option value="NCL Headquarters Singrauli (12 km)">
                    NCL Headquarters Singrauli (12 km)
                  </option>
                  <option value="Hindalco Mahan Aluminium Bargawan (32 km)">
                    Hindalco Mahan Aluminium Bargawan (32 km)
                  </option>
                  <option value="Varanasi Airport (VNS - 220 km)">
                    Varanasi Airport (VNS - 220 km)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={cabDate}
                    onChange={(e) => setCabDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Expected Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06:45 AM"
                    value={cabTime}
                    onChange={(e) => setCabTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Vehicle Type
                  </label>
                  <select
                    value={cabVehicle}
                    onChange={(e) => setCabVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  >
                    <option value="AC Sedan (Dzire / Etios - up to 3 guests)">
                      AC Sedan (Dzire / Etios)
                    </option>
                    <option value="AC SUV (Innova Crysta - up to 6 guests)">
                      AC SUV (Innova Crysta)
                    </option>
                    <option value="Executive Coach / Tempo Traveller (Group)">
                      Executive Coach / Group Van
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Train / Flight / Gate Info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Train 11447 Shaktipunj Exp"
                    value={cabTrainOrFlight}
                    onChange={(e) => setCabTrainOrFlight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={cabGuestName}
                    onChange={(e) => setCabGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#5C564D] font-bold mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={cabGuestPhone}
                    onChange={(e) => setCabGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8D0BE] text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCabModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D8D0BE] text-xs uppercase tracking-[0.14em] font-semibold text-[#5C564D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F6B48] text-white text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#235337] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Send Pickup Request on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
