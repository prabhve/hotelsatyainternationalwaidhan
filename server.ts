import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  if (lower.includes('403') || lower.includes('permission_denied') || lower.includes('api_key_invalid')) {
    return {
      status: 403,
      message: 'API key error or paid billing required for this model. Check Settings > Secrets to verify or attach a billing-enabled GEMINI_API_KEY.',
    };
  }
  if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      message: 'Quota limit reached for this Gemini model. Attach a billing-enabled key in Settings > Secrets for higher tier models.',
    };
  }
  if (lower.includes('404') || lower.includes('not_found')) {
    return {
      status: 404,
      message: `Requested Gemini model was not found or is unavailable: ${raw}`,
    };
  }
  return { status: 500, message: raw };
}

const HOTEL_CONTEXT = `You are the official AI Hospitality Concierge for Hotel Satya International, located on Main Road, Belaunji (Tali), Waidhan P.O., Singrauli District, Madhya Pradesh 486886, India (GPS: 24.072285, 82.6206458; Plus Code: 3JCF+W7 Waidhan; Google Maps Hex ID: 0x398f369a0ff99001:0xdb5aec929d36db90; Knowledge Graph: /g/11b6lmtf04).
Verified property facts:
- Classification: Singrauli's first classified 3-star business & family hotel, established in 2011. Motto: "Atithi-Devo-Bhava".
- Leadership: Managing Director Mr. S. D. Singh; General Manager Mr. Rajan G.P.
- Phones: +91-7805-350217, 234793, 234794, 350186 | Mobiles: +91-9009284982, +91-8719932581, +91-7024366637 | Email: hotelsatyainternational@gmail.com
- Check-in: 2:00 PM | Check-out: 12:00 PM.
- Rooms & Tariffs (INR/night):
  * Standard A/C Room: Single ₹2,000 / Double ₹2,700
  * Deluxe Room: Single ₹2,800 / Double ₹3,800
  * Super Deluxe Room: Single ₹3,500 / Double ₹4,500
  * Superior Suite: Single ₹4,500 / Double ₹5,500
  * Executive Suite: Single ₹5,500 / Double ₹6,500
  * Presidential Suite: Single ₹6,500 / Double ₹7,450
  * Royal Suite: Single ₹7,400–₹8,000 / Double ₹9,000–₹9,500
- Dining & Bar: Sharda Restaurant (Indian, Mughlai, Chinese, Continental, Italian, Oriental + European-style Custom Bakery & Wedding Cakes); Blue Diamond Bar (colonial-style lounge bar, 11:00 AM – 11:00 PM, last order 10:30 PM, mobile +91-7415866637).
- Amenities: Outdoor Swimming Pool, Health Club & Gym, 24h Room Service, Free Wi-Fi, Satellite TV, Hot/Cold Water, Doctor on Call, Laundry, Travel Desk & Car Rental, Secured Car/Bus/Coach Parking, Disabled Access.
- Events: Open-Air Lawn (~3,000 pax), Grand Banquet Hall (~200 pax), Party Room (~40 pax), Executive Meeting Room (~20 pax).
- Nearby Distances: NTPC Vindhyanagar (VSTPP) 4 km, NTPC Shaktinagar 12 km, Reliance Sasan Power Plant 18 km, Singrauli Railway Station 25 km, Hindalco Bargawan 25 km, NTPC Rihand Nagar 30 km, Mada Eco Park 33 km, Varanasi Railway Station 220 km, Varanasi Airport 240 km.`;

// ---------------------------------------------------------------------------
// SEO / GEO / AEO / LLMO Crawlable Endpoints
// ---------------------------------------------------------------------------
app.get('/llms.txt', (_req, res) => {
  res.type('text/plain; charset=utf-8').send(`# Hotel Satya International (Waidhan, Singrauli, M.P.)

> Official classified 3-star luxury hotel on Main Road, Belaunji (Tali), Waidhan, Singrauli, Madhya Pradesh 486886, India (Est. 2011).

## Core Facts
- Property Name: Hotel Satya International
- Established: 2011 (Singrauli's first classified 3-star hotel)
- Leadership: Mr. S. D. Singh (Managing Director) | Mr. Rajan G.P. (General Manager)
- Address: Main Road, Belaunji (Tali), Waidhan P.O., Singrauli District, Madhya Pradesh 486886, India
- Coordinates: 24.072285, 82.6206458 (Plus Code: 3JCF+W7 Waidhan)
- Google Maps Place ID: 0x398f369a0ff99001:0xdb5aec929d36db90 | Knowledge Graph: /g/11b6lmtf04
- Phone: +91-7805-350217, +91-7805-234793, +91-7805-234794, +91-7805-350186
- Mobile: +91-9009284982, +91-8719932581, +91-7024366637
- Email: hotelsatyainternational@gmail.com
- Check-in: 14:00 IST | Check-out: 12:00 IST

## Room Categories & Tariffs (INR)
- Standard A/C Room: Single ₹2,000 | Double ₹2,700
- Deluxe Room: Single ₹2,800 | Double ₹3,800
- Super Deluxe Room: Single ₹3,500 | Double ₹4,500
- Superior Suite: Single ₹4,500 | Double ₹5,500
- Executive Suite: Single ₹5,500 | Double ₹6,500
- Presidential Suite: Single ₹6,500 | Double ₹7,450
- Royal Suite: Single ₹7,400–₹8,000 | Double ₹9,000–₹9,500

## Dining, Bar & Banquets
- Sharda Restaurant: Multi-cuisine (Indian, Mughlai, Chinese, Continental, Italian, Oriental) & Custom European-technology Bakery.
- Blue Diamond Bar: Colonial lounge bar open 11:00 AM – 11:00 PM (Last Order 10:30 PM).
- Event Venues: Open-Air Lawn (3,000 pax), Grand Banquet Hall (200 pax), Party Room (40 pax), Executive Meeting Room (20 pax).

## Strategic Industrial & Transit Proximity
- NTPC Vindhyanagar (VSTPP): 4 km
- NTPC Shaktinagar (SSTPP): 12 km
- Reliance Sasan Power Plant: 18 km
- Singrauli Railway Station: 25 km
- Hindalco Bargawan: 25 km
- NTPC Rihand Nagar (RhSTPP): 30 km
- Mada Eco-Friendly Park: 33 km
- Varanasi Railway Station: 220 km
- Varanasi Airport: 240 km

## Extended Context & Structured Archive
- Full LLM specification: /llms-full.txt
- Structured JSON Archive: /api/archive
`);
});

app.get('/llms-full.txt', (_req, res) => {
  res.type('text/plain; charset=utf-8').send(`${HOTEL_CONTEXT}\n\n## Direct Booking & Review Portal\nGuests can check live tariffs across EP, CP, MAP, and AP meal plans, reserve rooms directly with instant confirmation tracking, submit banquet inquiries, explore driving routes on Google Maps, and read verified guest reviews.\n\n## Complete JSON Archive\nAvailable at /api/archive`);
});

app.get('/api/archive', (_req, res) => {
  try {
    const manifestPath = path.resolve(__dirname, 'src/data/hotelArchiveManifest.json');
    const content = fs.readFileSync(manifestPath, 'utf-8');
    res.type('application/json; charset=utf-8').send(content);
  } catch (err) {
    res.status(500).json({ error: 'Unable to read archive manifest.' });
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain; charset=utf-8').send(`User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
# LLMO Context
# ${baseUrl}/llms.txt
# ${baseUrl}/llms-full.txt
`);
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const now = new Date().toISOString().split('T')[0];
  res.type('application/xml; charset=utf-8').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/#rooms</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/#dining-events</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#banquets</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#facilities</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#gallery</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/#reviews</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#location</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#policies-faq</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/#contact</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`);
});

// Expose Google Maps public browser key safely for client <APIProvider>
app.get('/api/config/maps', (_req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  res.json({ apiKey });
});

// AI-SEO Snippet Studio endpoint
app.post('/api/seo-concierge', async (req, res) => {
  const { query } = req.body as { query?: string };
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Please provide a query.' });
  }
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: query.trim(),
      config: {
        systemInstruction: `${HOTEL_CONTEXT}\nAnswer factually and concisely in 2-4 sentences using only verified property details.`,
      },
    });
    res.json({ answer: response.text ?? '' });
  } catch {
    res.json({
      answer:
        'Hotel Satya International (Main Road, Belaunji, Waidhan, Singrauli 486886; Ph: +91-7805-350217) is located 4 km from NTPC Vindhyanagar and 18 km from Reliance Sasan, offering 7 room & suite categories (₹2,000 to ₹9,000), Sharda Multi-Cuisine Restaurant & Bakery, Blue Diamond Bar, outdoor swimming pool, and celebration lawns.',
    });
  }
});

// 1. Low-latency Quick Concierge (gemini-3.1-flash-lite)
app.post('/api/ai/quick-concierge', async (req, res) => {
  try {
    const { question } = req.body as { question?: string };
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Please provide a question.' });
    }
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: question.trim(),
      config: {
        systemInstruction: `${HOTEL_CONTEXT}\nAnswer concisely in 2-4 clear sentences with exact INR tariffs, timings, or distances.`,
      },
    });
    res.json({ text: response.text ?? '' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

// 2. High-Thinking Deep Planner (gemini-4-carbon with ThinkingLevel.HIGH, no maxOutputTokens)
app.post('/api/ai/deep-planner', async (req, res) => {
  try {
    const { prompt } = req.body as { prompt?: string };
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a planning brief.' });
    }
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-carbon',
      contents: prompt.trim(),
      config: {
        systemInstruction: `${HOTEL_CONTEXT}\nProvide a structured, thorough hospitality, corporate travel, wedding logistics, or local GEO/SEO strategy plan tailored specifically to Hotel Satya International in Waidhan, Singrauli.`,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });
    res.json({ text: response.text ?? '' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

// 3. Google Search & Maps Grounding (gemini-4-hydrogen)
app.post('/api/ai/explore-singrauli', async (req, res) => {
  try {
    const { query, mode, userLat, userLng } = req.body as {
      query?: string;
      mode?: 'search' | 'maps';
      userLat?: number;
      userLng?: number;
    };
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Please enter a local search or travel query.' });
    }
    const ai = getGeminiClient();
    const useMaps = mode === 'maps';

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `${query.trim()} (Context: around Hotel Satya International, Main Road, Belaunji, Waidhan, Singrauli, Madhya Pradesh 486886).`,
      config: {
        tools: useMaps ? [{ googleMaps: {} }] : [{ googleSearch: {} }],
        ...(useMaps
          ? {
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: typeof userLat === 'number' ? userLat : 24.072285,
                    longitude: typeof userLng === 'number' ? userLng : 82.6206458,
                  },
                },
              },
            }
          : {}),
      },
    });

    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Array<{ title: string; uri: string; snippet?: string }> = [];
    for (const chunk of rawChunks as any[]) {
      if (chunk.web?.uri) {
        sources.push({ title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri });
      }
      if (chunk.maps?.uri) {
        const snippet = chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.content;
        sources.push({
          title: chunk.maps.title || 'Google Maps Place',
          uri: chunk.maps.uri,
          snippet,
        });
      }
    }

    res.json({ text: response.text ?? '', sources });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

// 4. Image & Video Analysis (gemini-4-argon)
app.post('/api/ai/analyze-media', async (req, res) => {
  try {
    const { base64Data, mimeType, prompt } = req.body as {
      base64Data?: string;
      mimeType?: string;
      prompt?: string;
    };
    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'Please upload an image or video file to analyze.' });
    }
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text:
              prompt?.trim() ||
              'Analyze this photo or video for event planning, room styling, or hospitality execution at Hotel Satya International (3,000-pax Open-Air Lawn, 200-pax Grand Banquet Hall, Sharda Restaurant & Bakery). Provide specific setup and venue recommendations.',
          },
        ],
      },
    });
    res.json({ text: response.text ?? '' });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

// 5. High-Quality Hospitality Visual Generation (gemini-nano-banana-2.1 / gemini-3-pro-image)
app.post('/api/ai/generate-visual', async (req, res) => {
  try {
    const { prompt, aspectRatio, imageSize, qualityTier } = req.body as {
      prompt?: string;
      aspectRatio?: string;
      imageSize?: '1K' | '2K' | '4K';
      qualityTier?: 'standard' | 'studio';
    };
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Please enter a visual concept prompt.' });
    }

    const validRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const ratio = validRatios.includes(aspectRatio ?? '') ? aspectRatio : '16:9';
    const size = ['1K', '2K', '4K'].includes(imageSize ?? '') ? imageSize : '1K';
    const model = qualityTier === 'studio' ? 'gemini-3-pro-image' : 'gemini-nano-banana-2.1';

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            text: `Architectural and luxury hospitality photography for Hotel Satya International Singrauli: ${prompt.trim()}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: ratio,
          imageSize: size,
        },
      },
    });

    let imageUrl = '';
    let caption = '';
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        caption += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(502).json({ error: 'No image was returned by the model.' });
    }

    res.json({ imageUrl, caption, model });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

// 6. Animate Image into Video via Interactions API (gemini-omni-1.2-flash)
app.post('/api/ai/animate-video', async (req, res) => {
  try {
    const { base64Data, mimeType, prompt, aspectRatio } = req.body as {
      base64Data?: string;
      mimeType?: string;
      prompt?: string;
      aspectRatio?: '16:9' | '9:16';
    };
    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'Please upload a photo to animate into video.' });
    }
    const targetAspect: '16:9' | '9:16' = aspectRatio === '9:16' ? '9:16' : '16:9';

    const ai = getGeminiClient();
    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: [
          {
            type: 'image',
            mime_type: mimeType,
            data: base64Data,
          },
          {
            type: 'text',
            text:
              prompt?.trim() ||
              'Gentle luxury hospitality camera push-in, warm golden sunlight shimmering across the space, serene natural motion.',
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: targetAspect,
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (!videoPart?.data && !videoPart?.uri) {
      return res.status(502).json({ error: 'Video generation completed without a playable video payload.' });
    }

    const videoUrl = videoPart.data
      ? `data:${videoPart.mime_type || 'video/mp4'};base64,${videoPart.data}`
      : videoPart.uri;

    res.json({ videoUrl });
  } catch (err) {
    const formatted = formatGeminiError(err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hotel Satya International server running on http://localhost:${PORT}`);
  });
}

startServer();
