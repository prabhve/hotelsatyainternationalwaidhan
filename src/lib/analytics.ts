import { BOOKING_CONFIG } from '../data/hotelData';

/**
 * Analytics & Deep-Link Helper (/src/lib/analytics.ts)
 * Supports GA4 (gtag) & Meta Pixel (fbq) event dispatch plus WhatsApp & mailto builders.
 */

export const ANALYTICS_CONFIG = {
  ga4MeasurementId: 'G-XXXXXXXXXX', // [PLACEHOLDER: Replace with live GA4 Measurement ID]
  metaPixelId: '000000000000000', // [PLACEHOLDER: Replace with live Meta Pixel ID]
};

export function trackEvent(
  eventName: 'book_stay_click' | 'whatsapp_click' | 'call_click' | 'corporate_inquiry' | 'event_inquiry' | 'table_reserve' | 'cab_request',
  payload?: Record<string, string | number | boolean>
) {
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, payload || {});
    }
    if (typeof w.fbq === 'function') {
      w.fbq('trackCustom', eventName, payload || {});
    }
  } catch {
    // Non-blocking analytics
  }
}

export function buildWhatsAppUrl(message: string, phone = BOOKING_CONFIG.whatsappNumber): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(subject: string, body: string, email = BOOKING_CONFIG.email): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
