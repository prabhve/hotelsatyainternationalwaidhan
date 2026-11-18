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
import { Reveal } from './MotionPrimitives';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const HAS_VALID_KEY = Boolean(API_KEY && API_KEY !== 'YOUR_API_KEY');

const HOTEL_COORDS = {
  lat: HOTEL_INFO.coordinates.lat,
  lng: HOTEL_INFO.coordinates.lng,
};

const GOOGLE_MAPS_PLACE_URL = HOTEL_INFO.googleMapsUrl;

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

  // Travel Desk Cab / Ticket Request Modal State
  const [showCabModal, setShowCabModal] = useState(false);
  const [cabPickupPoint, setCabPickupPoint] = useState(
    `${NEARBY_LANDMARKS[4].name} (${NEARBY_LANDMARKS[4].distanceLabel})`
  );
  const [cabDate, setCabDate] = useState('');
  const [cabTime, setCabTime] = useState('10:00 AM');
  const [cabServiceType, setCabServiceType] = useState(
    'Local / Outstation Cab Transfer'
  );
  const [cabGuestName, setCabGuestName] = useState('');
  const [cabGuestPhone, setCabGuestPhone] = useState('');
  const [cabTrainOrFlight, setCabTrainOrFlight] = useState('');

  const getCategoryIcon = (category: LandmarkItem['category']) => {
    switch (category) {
      case 'Transit':
        return <Train className="w-4 h-4 text-[#183D32]" />;
      case 'Power & Industry':
        return <Factory className="w-4 h-4 text-[#183D32]" />;
      case 'Tourism':
        return <Compass className="w-4 h-4 text-[#183D32]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#183D32]" />;
    }
  };

  const handleBookCabWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('cab_request', { source: 'cab_pickup_modal', pickup: cabPickupPoint });
    const msg = [
      `Namaste Hotel Satya International Travel Desk,`,
      ``,
      `I would like to request Travel Desk assistance:`,
      `• Location / Route: ${cabPickupPoint}`,
      `• Service Type: ${cabServiceType}`,
      `• Date & Time: ${cabDate || 'Flexible'} at ${cabTime}`,
      `• Train / Flight / Plant Gate Info: ${cabTrainOrFlight || 'Will share shortly'}`,
      `• Guest Name: ${cabGuestName}`,
      `• Mobile: ${cabGuestPhone}`,
      ``,
      `Please confirm availability and tariff.`,
    ].join('\n');

    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    setShowCabModal(false);
  };

  return (
    <section id="location" className="py-20 lg:py-24 bg-[#F8F6F0] border-b border-[#E9E2D5] scroll-mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#183D32] font-semibold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'लोकेशन और प्रमुख स्थानों से प्रमाणित दूरी'
                    : 'Singrauli Power Corridor & Verified Distances'}
                </span>
              </div>
              <h2
                className="font-display text-[#191D1B] font-semibold leading-[1.12]"
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#183D32] text-white hover:bg-[#122E25] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Car className="w-4 h-4 text-[#C6A66B]" />
                <span>
                  {lang === 'hi'
                    ? 'ट्रैवल डेस्क / कैब सहायता'
                    : 'Request Travel Desk / Cab Transfer'}
                </span>
              </button>
              <a
                href={GOOGLE_MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cab_request', { action: 'directions_click' })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#191D1B] text-[#F8F6F0] hover:bg-[#2E3330] text-xs uppercase tracking-[0.14em] font-semibold transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#C6A66B]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Interactive Map + Verified Distance Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Official Address & 9 Verified Famous Places Distances */}
          <div className="lg:col-span-5 space-y-5">
            {/* Official Address & Coordinates Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9E2D5] shadow-2xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#183D32] font-bold">
                  Verified GPS & Postal Address
                </span>
                <span className="price-tabular text-xs font-bold text-[#525854] bg-[#F8F6F0] px-2.5 py-1 rounded-md border border-[#E9E2D5]">
                  24.072285° N, 82.6206458° E
                </span>
              </div>
              <h3 className="font-display text-2xl text-[#191D1B] font-semibold mb-1">
                {HOTEL_INFO.name}
              </h3>
              <p className="text-sm text-[#525854] leading-relaxed mb-4">
                {HOTEL_INFO.address}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E9E2D5]">
                <a
                  href={`tel:${HOTEL_INFO.phones[0]}`}
                  onClick={() => trackEvent('call_click', { location: 'map_card' })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#191D1B] bg-[#F8F6F0] px-3 py-2 rounded-lg border border-[#E9E2D5] hover:border-[#C6A66B]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#183D32]" />
                  <span className="price-tabular">{HOTEL_INFO.phones[0]}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowCabModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183D32] bg-[#F8F6F0] px-3 py-2 rounded-lg border border-[#183D32]/30 hover:bg-[#183D32] hover:text-white transition-colors cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Travel Desk Assistance</span>
                </button>
              </div>
            </div>

            {/* Verified Famous Places & Distances Table */}
            <div className="rounded-2xl bg-white border border-[#E9E2D5] overflow-hidden shadow-xs">
              <div className="px-5 py-4 bg-[#191D1B] text-[#F8F6F0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#C6A66B] font-semibold block">
                    Official Distance Chart
                  </span>
                  <h4 className="font-display text-xl font-medium">
                    Famous Places & Industrial Distances
                  </h4>
                </div>
                <span className="text-[11px] text-[#F8F6F0]/70">Click row to view on map</span>
              </div>

              <div className="divide-y divide-[#E9E2D5]">
                {NEARBY_LANDMARKS.map((lm) => {
                  const isSelected = selectedLandmark?.id === lm.id;
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => setSelectedLandmark(lm)}
                      className={`w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected ? 'bg-[#EFECE4]' : 'hover:bg-[#F8F6F0]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] border border-[#E9E2D5] flex items-center justify-center shrink-0 mt-0.5">
                          {getCategoryIcon(lm.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#191D1B] truncate">
                            {lm.name}
                          </div>
                          <div className="text-xs text-[#525854] line-clamp-1">
                            {lm.note}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="price-tabular text-sm font-bold text-[#183D32]">
                          {lm.distanceLabel}
                        </div>
                        <div className="text-[11px] text-[#525854]">
                          {lm.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Live Google Map Canvas */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-[#E9E2D5] bg-white shadow-sm">
              {/* Top Route Header */}
              <div className="px-6 py-4 bg-[#191D1B] text-[#F8F6F0] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-[#C6A66B]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#F8F6F0]/65">
                      Selected Destination
                    </div>
                    <div className="text-sm font-medium">
                      Hotel Satya International →{' '}
                      <span className="text-[#C6A66B]">
                        {selectedLandmark ? selectedLandmark.name : 'Select a landmark'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedLandmark && (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-[#F8F6F0]/10 border border-[#F8F6F0]/15">
                      <span className="text-[#F8F6F0]/65 mr-1.5">Verified Distance:</span>
                      <span className="price-tabular font-bold text-[#C6A66B]">
                        {liveRouteInfo?.distanceMeters
                          ? `${(liveRouteInfo.distanceMeters / 1000).toFixed(1)} Km`
                          : selectedLandmark.distanceLabel}
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
                          background="#183D32"
                          borderColor="#C6A66B"
                          glyphColor="#F8F6F0"
                          scale={1.3}
                        />
                      </AdvancedMarker>

                      {showHotelInfo && (
                        <InfoWindow
                          position={HOTEL_COORDS}
                          onCloseClick={() => setShowHotelInfo(false)}
                        >
                          <div className="p-1 max-w-[230px] text-[#191D1B]">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#183D32] mb-0.5">
                              3-Star Classified Hotel · Est. 2011
                            </div>
                            <div className="font-display font-semibold text-base leading-tight mb-1">
                              Hotel Satya International
                            </div>
                            <p className="text-xs text-[#525854] mb-2">
                              Main Road, Belaunji, Waidhan, Singrauli 486886
                            </p>
                            <a
                              href={GOOGLE_MAPS_PLACE_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[#183D32] underline"
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
                              background={isSelected ? '#191D1B' : '#525854'}
                              borderColor="#F8F6F0"
                              glyphColor="#C6A66B"
                              scale={isSelected ? 1.15 : 0.9}
                            />
                          </AdvancedMarker>
                        );
                      })}

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
              <div className="p-5 bg-[#EFECE4] border-t border-[#E9E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-[#183D32] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#525854] leading-relaxed">
                    <strong className="text-[#191D1B]">In-House Travel Desk:</strong> Assists resident guests with local transport, railway ticket reservations (Singrauli & Varanasi stations), and air ticket bookings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCabModal(true)}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-[#183D32] text-white hover:bg-[#122E25] text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer"
                >
                  Contact Travel Desk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Desk Transfer & Ticketing Modal */}
      {showCabModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F6F0] border border-[#E9E2D5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowCabModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#191D1B] border border-[#E9E2D5] flex items-center justify-center hover:bg-[#EFECE4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#183D32] font-bold mb-2">
              <Car className="w-4 h-4" />
              <span>Travel Desk · Hotel Satya International</span>
            </div>
            <h3 className="font-display text-2xl text-[#191D1B] font-semibold mb-2">
              Request Transport, Railway or Air Ticket Assistance
            </h3>
            <p className="text-xs text-[#525854] mb-5">
              Our on-site Travel Desk arranges cab transfers to industrial plants, railway stations, and airports as well as rail and air ticket bookings.
            </p>

            <form onSubmit={handleBookCabWhatsApp} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                  Destination / Pickup Corridor
                </label>
                <select
                  value={cabPickupPoint}
                  onChange={(e) => setCabPickupPoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B] font-medium"
                >
                  {NEARBY_LANDMARKS.map((lm) => (
                    <option key={lm.id} value={`${lm.name} (${lm.distanceLabel})`}>
                      {lm.name} — {lm.distanceLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={cabDate}
                    onChange={(e) => setCabDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM"
                    value={cabTime}
                    onChange={(e) => setCabTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Travel Desk Service
                  </label>
                  <select
                    value={cabServiceType}
                    onChange={(e) => setCabServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  >
                    <option value="Local / Outstation Cab Transfer">
                      Cab Transfer (Station / Plant / Airport)
                    </option>
                    <option value="Railway Ticket Booking Assistance">
                      Railway Ticket Booking Assistance
                    </option>
                    <option value="Air Ticket Booking Assistance">
                      Air Ticket Booking Assistance
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Train / Flight / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional details"
                    value={cabTrainOrFlight}
                    onChange={(e) => setCabTrainOrFlight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={cabGuestName}
                    onChange={(e) => setCabGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.14em] text-[#525854] font-bold mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={cabGuestPhone}
                    onChange={(e) => setCabGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E9E2D5] text-sm text-[#191D1B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCabModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E9E2D5] text-xs uppercase tracking-[0.14em] font-semibold text-[#525854] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#183D32] text-white text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#122E25] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
                  <span>Send Request on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
