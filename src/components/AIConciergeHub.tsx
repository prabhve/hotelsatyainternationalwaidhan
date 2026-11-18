import { useState } from 'react';
import { ExternalLink, Film, Globe, Image as ImageIcon, MapPin, Send, Sparkles, Upload } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';

type StudioTab = 'concierge' | 'planner' | 'grounding' | 'media-analyze' | 'visual-studio';

const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '3:2', '2:3', '3:4', '9:16', '21:9'] as const;
const IMAGE_SIZES = ['1K', '2K', '4K'] as const;

function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIdx = result.indexOf(',');
      const base64 = commaIdx >= 0 ? result.slice(commaIdx + 1) : result;
      resolve({
        base64,
        mimeType: file.type || 'application/octet-stream',
        previewUrl: result,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read uploaded file.'));
    reader.readAsDataURL(file);
  });
}

export function AIConciergeHub() {
  const [tab, setTab] = useState<StudioTab>('concierge');

  // Tab 1: Low-latency Concierge (gemini-3.1-flash-lite)
  const [quickQuestion, setQuickQuestion] = useState('What is the tariff for Royal Suite Double with breakfast and distance from NTPC Vindhyanagar?');
  const [quickAnswer, setQuickAnswer] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  // Tab 2: High-Thinking Deep Planner (gemini-4-carbon)
  const [planPrompt, setPlanPrompt] = useState('Plan a 2-day corporate delegation for 18 NTPC engineers including Executive Suites, meeting room briefing, and dinner at Sharda Restaurant.');
  const [planResult, setPlanResult] = useState('');
  const [planLoading, setPlanLoading] = useState(false);

  // Tab 3: Search & Maps Grounding (gemini-4-hydrogen)
  const [groundMode, setGroundMode] = useState<'search' | 'maps'>('maps');
  const [groundQuery, setGroundQuery] = useState('Best sightseeing stops and connectivity around Waidhan, Singrauli, and Mada Caves');
  const [groundText, setGroundText] = useState('');
  const [groundSources, setGroundSources] = useState<Array<{ title: string; uri: string; snippet?: string }>>([]);
  const [groundLoading, setGroundLoading] = useState(false);

  // Tab 4: Image & Video Analysis (gemini-4-argon)
  const [analysisPrompt, setAnalysisPrompt] = useState('Evaluate this venue or decor photo/clip and suggest seating, lighting, and catering tips for our Waidhan banquet or lawn.');
  const [mediaFileInfo, setMediaFileInfo] = useState<{ name: string; base64: string; mimeType: string; previewUrl: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Tab 5: Image Generation (nano-banana-2.1 / 3-pro-image) & Image-to-Video (gemini-omni-1.2-flash)
  const [visualPrompt, setVisualPrompt] = useState('Bright marigold and ivory evening wedding reception on a manicured 3000-guest open-air lawn in Singrauli, warm architectural lighting');
  const [aspectRatio, setAspectRatio] = useState<(typeof ASPECT_RATIOS)[number]>('16:9');
  const [imageSize, setImageSize] = useState<(typeof IMAGE_SIZES)[number]>('1K');
  const [qualityTier, setQualityTier] = useState<'standard' | 'studio'>('standard');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [visualLoading, setVisualLoading] = useState(false);

  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [videoMotionPrompt, setVideoMotionPrompt] = useState('Gentle golden-hour camera glide across the sunlit hotel facade and garden entrance');
  const [videoSourceFile, setVideoSourceFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callApi = async <T,>(url: string, body: unknown): Promise<T> => {
    setErrorMsg(null);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data as T;
  };

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickLoading(true);
    try {
      const data = await callApi<{ text: string }>('/api/ai/quick-concierge', { question: quickQuestion });
      setQuickAnswer(data.text);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to fetch answer.');
    } finally {
      setQuickLoading(false);
    }
  };

  const handleDeepPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanLoading(true);
    try {
      const data = await callApi<{ text: string }>('/api/ai/deep-planner', { prompt: planPrompt });
      setPlanResult(data.text);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to generate deep plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroundLoading(true);
    try {
      const data = await callApi<{ text: string; sources: Array<{ title: string; uri: string; snippet?: string }> }>(
        '/api/ai/explore-singrauli',
        { query: groundQuery, mode: groundMode }
      );
      setGroundText(data.text);
      setGroundSources(data.sources || []);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to explore grounded data.');
    } finally {
      setGroundLoading(false);
    }
  };

  const handleMediaAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFileInfo) {
      setErrorMsg('Please select a photo or video file first.');
      return;
    }
    setAnalysisLoading(true);
    try {
      const data = await callApi<{ text: string }>('/api/ai/analyze-media', {
        base64Data: mediaFileInfo.base64,
        mimeType: mediaFileInfo.mimeType,
        prompt: analysisPrompt,
      });
      setAnalysisResult(data.text);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Media analysis failed.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleGenerateVisual = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisualLoading(true);
    try {
      const data = await callApi<{ imageUrl: string }>('/api/ai/generate-visual', {
        prompt: visualPrompt,
        aspectRatio,
        imageSize,
        qualityTier,
      });
      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Image generation failed.');
    } finally {
      setVisualLoading(false);
    }
  };

  const handleAnimateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    let payloadBase64 = videoSourceFile?.base64;
    let payloadMime = videoSourceFile?.mimeType;

    if (!payloadBase64) {
      // Fallback to fetching local hero image into base64 if user hasn't uploaded one
      try {
        const resp = await fetch(HOTEL_INFO.heroImage);
        const blob = await resp.blob();
        const file = new File([blob], 'hotel-exterior.jpg', { type: blob.type || 'image/jpeg' });
        const encoded = await readFileAsBase64(file);
        payloadBase64 = encoded.base64;
        payloadMime = encoded.mimeType;
      } catch {
        setErrorMsg('Please upload a photo to animate into a video clip.');
        return;
      }
    }

    setVideoLoading(true);
    try {
      const data = await callApi<{ videoUrl: string }>('/api/ai/animate-video', {
        base64Data: payloadBase64,
        mimeType: payloadMime,
        prompt: videoMotionPrompt,
        aspectRatio: videoAspect,
      });
      setGeneratedVideoUrl(data.videoUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Video generation failed.');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <section id="concierge-studio" className="py-16 sm:py-24 border-b border-[#E5E0D8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C5E14] mb-2">
            Guest & Event Planning Studio
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D20] text-balance">
            Concierge Desk, Local Explorer & Event Visualizer
          </h2>
        </div>

        {/* Segmented Workspace Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3F1EC] border border-[#E5E0D8] rounded-xl mb-6">
          {[
            { id: 'concierge', label: 'Instant Concierge' },
            { id: 'planner', label: 'Deep Stay & Event Planner' },
            { id: 'grounding', label: 'Live Maps & Web Explorer' },
            { id: 'media-analyze', label: 'Photo & Video Inspector' },
            { id: 'visual-studio', label: 'Decor Visualizer & Reel' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id as StudioTab);
                setErrorMsg(null);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                tab === item.id
                  ? 'bg-white text-[#1A1D20] shadow-sm'
                  : 'text-[#5A5E63] hover:text-[#1A1D20]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
            {errorMsg}
          </div>
        )}

        <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-8">
          {/* 1. Low-latency Quick Concierge */}
          {tab === 'concierge' && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4E54]">
                Ask about published room tariffs, Sharda Restaurant cuisines, Blue Diamond Bar hours, or NTPC Vindhyanagar travel time for an immediate answer.
              </p>
              <form onSubmit={handleQuickAsk} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                  placeholder="Ask about check-in time, custom cakes, or group tariffs..."
                  required
                />
                <button
                  type="submit"
                  disabled={quickLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1A1D20] text-white text-sm font-semibold rounded-lg hover:bg-[#2F343A] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {quickLoading ? 'Answering...' : 'Ask Concierge'}
                </button>
              </form>
              {quickAnswer && (
                <div className="p-5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1A1D20] leading-relaxed whitespace-pre-wrap">
                  {quickAnswer}
                </div>
              )}
            </div>
          )}

          {/* 2. Deep Planner (gemini-4-carbon, ThinkingLevel.HIGH) */}
          {tab === 'planner' && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4E54]">
                Generate comprehensive multi-day corporate itineraries, 3,000-guest wedding schedules, or local Waidhan hospitality logistics using deep reasoning.
              </p>
              <form onSubmit={handleDeepPlan} className="space-y-3">
                <textarea
                  rows={3}
                  value={planPrompt}
                  onChange={(e) => setPlanPrompt(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={planLoading}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1A1D20] text-white text-sm font-semibold rounded-lg hover:bg-[#2F343A] disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {planLoading ? 'Reasoning deeply...' : 'Build Detailed Plan'}
                </button>
              </form>
              {planResult && (
                <div className="p-5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1A1D20] leading-relaxed whitespace-pre-wrap">
                  {planResult}
                </div>
              )}
            </div>
          )}

          {/* 3. Google Search & Maps Grounding (gemini-4-hydrogen) */}
          {tab === 'grounding' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#4A4E54]">
                  Verify live Singrauli travel updates, nearby attractions, and local business data grounded directly in Google Maps or Google Search.
                </p>
                <div className="inline-flex p-1 bg-[#F3F1EC] border border-[#E5E0D8] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGroundMode('maps')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${
                      groundMode === 'maps' ? 'bg-white text-[#1A1D20] shadow-sm' : 'text-[#5A5E63]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    Google Maps Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroundMode('search')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${
                      groundMode === 'search' ? 'bg-white text-[#1A1D20] shadow-sm' : 'text-[#5A5E63]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    Google Search Data
                  </button>
                </div>
              </div>

              <form onSubmit={handleGrounding} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={groundQuery}
                  onChange={(e) => setGroundQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={groundLoading}
                  className="px-5 py-3 bg-[#1A1D20] text-white text-sm font-semibold rounded-lg hover:bg-[#2F343A] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {groundLoading ? 'Querying...' : 'Explore Live Data'}
                </button>
              </form>

              {groundText && (
                <div className="space-y-4">
                  <div className="p-5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1A1D20] leading-relaxed whitespace-pre-wrap">
                    {groundText}
                  </div>
                  {groundSources.length > 0 && (
                    <div className="border-t border-[#E5E0D8] pt-4">
                      <p className="text-xs font-semibold text-[#5A5E63] mb-2">Verified Grounding Sources</p>
                      <ul className="space-y-1.5 text-xs">
                        {groundSources.map((src, idx) => (
                          <li key={idx}>
                            <a
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#8C5E14] font-medium hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>{src.title}</span>
                            </a>
                            {src.snippet && <p className="text-[#5A5E63] ml-5 mt-0.5">{src.snippet}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. Photo & Video Analyzer (gemini-4-argon) */}
          {tab === 'media-analyze' && (
            <div className="space-y-5">
              <p className="text-sm text-[#4A4E54]">
                Upload a wedding decor reference photo or venue walkthrough video clip to receive structured capacity, lighting, and catering recommendations.
              </p>
              <form onSubmit={handleMediaAnalyze} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg text-xs font-semibold text-[#1A1D20] cursor-pointer hover:bg-[#F3F1EC]">
                    <Upload className="w-4 h-4 text-[#8C5E14]" aria-hidden="true" />
                    <span>{mediaFileInfo ? mediaFileInfo.name : 'Upload Photo or Video'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const encoded = await readFileAsBase64(file);
                        setMediaFileInfo({ name: file.name, ...encoded });
                      }}
                    />
                  </label>
                  <span className="text-xs text-[#5A5E63]">
                    Supports JPEG, PNG, WebP images and MP4/WebM clips (under 15 MB).
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                />

                <button
                  type="submit"
                  disabled={analysisLoading}
                  className="px-5 py-3 bg-[#1A1D20] text-white text-sm font-semibold rounded-lg hover:bg-[#2F343A] disabled:opacity-60"
                >
                  {analysisLoading ? 'Analyzing media...' : 'Analyze Photo / Video'}
                </button>
              </form>

              {analysisResult && (
                <div className="p-5 rounded-lg bg-[#FAF9F6] border border-[#E5E0D8] text-sm text-[#1A1D20] leading-relaxed whitespace-pre-wrap">
                  {analysisResult}
                </div>
              )}
            </div>
          )}

          {/* 5. High-Quality Visual Studio & Video Animator */}
          {tab === 'visual-studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Custom Image Generator */}
              <form onSubmit={handleGenerateVisual} className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#8C5E14]" aria-hidden="true" />
                  <h3 className="font-semibold text-base text-[#1A1D20]">
                    Event & Suite Concept Generator
                  </h3>
                </div>
                <textarea
                  rows={3}
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5E63] mb-1">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as (typeof ASPECT_RATIOS)[number])}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5E63] mb-1">Resolution</label>
                    <select
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value as (typeof IMAGE_SIZES)[number])}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                    >
                      {IMAGE_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A5E63] mb-1">Quality Tier</label>
                    <select
                      value={qualityTier}
                      onChange={(e) => setQualityTier(e.target.value as 'standard' | 'studio')}
                      className="w-full px-2.5 py-2 text-xs bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                    >
                      <option value="standard">Fast Studio</option>
                      <option value="studio">Pro Preview</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={visualLoading}
                  className="w-full py-2.5 bg-[#1A1D20] text-white text-xs font-semibold rounded-lg hover:bg-[#2F343A] disabled:opacity-60"
                >
                  {visualLoading ? 'Rendering concept...' : 'Generate Visual Concept'}
                </button>
                {generatedImageUrl && (
                  <div className="rounded-lg overflow-hidden border border-[#E5E0D8]">
                    <img src={generatedImageUrl} alt="Generated hospitality concept" className="w-full h-auto" />
                  </div>
                )}
              </form>

              {/* Image-to-Video Showcase Animator */}
              <form onSubmit={handleAnimateVideo} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#8C5E14]" aria-hidden="true" />
                  <h3 className="font-semibold text-base text-[#1A1D20]">
                    Animate Photo into Property Reel
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg text-xs font-semibold text-[#1A1D20] cursor-pointer hover:bg-[#F3F1EC]">
                    <Upload className="w-3.5 h-3.5 text-[#8C5E14]" aria-hidden="true" />
                    <span>{videoSourceFile ? videoSourceFile.name : 'Choose Photo (or use Hotel Facade)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const enc = await readFileAsBase64(f);
                        setVideoSourceFile({ base64: enc.base64, mimeType: enc.mimeType, name: f.name });
                      }}
                    />
                  </label>
                  <select
                    value={videoAspect}
                    onChange={(e) => setVideoAspect(e.target.value as '16:9' | '9:16')}
                    className="px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Portrait</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={videoMotionPrompt}
                  onChange={(e) => setVideoMotionPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D1C5] rounded-lg"
                />
                <button
                  type="submit"
                  disabled={videoLoading}
                  className="w-full py-2.5 bg-[#8C5E14] text-white text-xs font-semibold rounded-lg hover:bg-[#734C0E] disabled:opacity-60"
                >
                  {videoLoading ? 'Animating reel (may take ~1–2 mins)...' : 'Animate Photo to Video'}
                </button>
                {generatedVideoUrl && (
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full rounded-lg border border-[#E5E0D8]"
                  />
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
