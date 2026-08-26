import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductInputSection } from './components/ProductInputSection';
import { CustomizerPanel } from './components/CustomizerPanel';
import { BannerPreviewCard } from './components/BannerPreviewCard';
import { BannerDetailModal } from './components/BannerDetailModal';
import { SavedGallery } from './components/SavedGallery';
import { STANDARD_BANNER_SIZES } from './data/bannerSizes';
import { ProductAnalysis, AdCustomization, BannerSize } from './types';
import { Sparkles, Layers, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

const DEFAULT_ANALYSIS: ProductAnalysis = {
  brandName: 'AuraFlow',
  productTitle: 'Smart Eco Water Bottle with Temp Display',
  category: 'Consumer Electronics & Lifestyle',
  targetAudience: 'Fitness enthusiasts, eco-conscious professionals, hikers',
  headlines: [
    'Stay Hydrated in Pure Style',
    'Smart Temperature Control on the Go',
    'Pure Refreshment, Zero Plastic Waste',
  ],
  subheadings: [
    'Keeps drinks ice-cold for 24h or hot for 12h with LED smart touch cap.',
    'Join 50,000+ satisfied customers upgrading their daily hydration.',
  ],
  callToActions: ['Shop Now', 'Claim 20% Off', 'Explore Bottle', 'Order Today'],
  badges: ['Best Seller', 'Free Shipping', '24h Cold', 'Eco Friendly'],
  colorPalette: {
    primary: '#4f46e5',
    secondary: '#9333ea',
    accent: '#ec4899',
    background: '#0f172a',
    text: '#ffffff',
  },
  imagePrompt: 'A sleek, premium stainless steel smart water bottle with glowing LED temperature display on the cap, standing on a minimalist reflective slate surface with lush green botanical background and soft cinematic studio lighting, commercial product photography, 4k resolution.',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>('studio');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<ProductAnalysis>(DEFAULT_ANALYSIS);
  const [customization, setCustomization] = useState<AdCustomization>({
    headline: DEFAULT_ANALYSIS.headlines[0],
    subheading: DEFAULT_ANALYSIS.subheadings[0],
    ctaText: DEFAULT_ANALYSIS.callToActions[0],
    badgeText: DEFAULT_ANALYSIS.badges[0],
    brandName: DEFAULT_ANALYSIS.brandName,
    selectedColorPalette: DEFAULT_ANALYSIS.colorPalette,
    layoutStyle: 'modern',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
    aspectRatio: '1:1',
    imageSize: '2K',
    imageModel: 'gemini-3-pro-image-preview',
  });

  const [selectedBannerForModal, setSelectedBannerForModal] = useState<BannerSize | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedBanners, setSavedBanners] = useState<any[]>([]);

  useEffect(() => {
    const loaded = localStorage.getItem('saved_banner_ads');
    if (loaded) {
      try {
        setSavedBanners(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveBanner = (bannerSize: BannerSize, dataUrl: string) => {
    const newSaved = [
      {
        id: `${Date.now()}-${bannerSize.id}`,
        bannerName: bannerSize.name,
        dimensions: `${bannerSize.width} × ${bannerSize.height}px`,
        dataUrl,
        createdAt: new Date().toLocaleDateString(),
      },
      ...savedBanners,
    ];
    setSavedBanners(newSaved);
    localStorage.setItem('saved_banner_ads', JSON.stringify(newSaved));
    setSuccessMessage(`Successfully saved ${bannerSize.name}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedBanners.filter((b) => b.id !== id);
    setSavedBanners(updated);
    localStorage.setItem('saved_banner_ads', JSON.stringify(updated));
  };

  const handleClearAllSaved = () => {
    setSavedBanners([]);
    localStorage.removeItem('saved_banner_ads');
  };

  const handleGenerate = async (formData: {
    url: string;
    description: string;
    brandName: string;
    model: string;
    imageSize: '1K' | '2K' | '4K';
    aspectRatio: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Analyze product via backend
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze product');
      }

      const data: ProductAnalysis = await res.json();
      setAnalysis(data);

      const brand = formData.brandName || data.brandName || 'Brand';
      setCustomization((prev) => ({
        ...prev,
        brandName: brand,
        headline: data.headlines?.[0] || 'Discover Premium Quality',
        subheading: data.subheadings?.[0] || '',
        ctaText: data.callToActions?.[0] || 'Shop Now',
        badgeText: data.badges?.[0] || 'Featured',
        selectedColorPalette: data.colorPalette || prev.selectedColorPalette,
        imageModel: formData.model,
        imageSize: formData.imageSize,
        aspectRatio: formData.aspectRatio,
      }));

      // 2. Generate AI Image using Gemini
      setIsGeneratingImage(true);
      const imgRes = await fetch('/api/generate-banner-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.imagePrompt,
          model: formData.model,
          aspectRatio: formData.aspectRatio,
          imageSize: formData.imageSize,
        }),
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData.imageUrl) {
          setCustomization((prev) => ({ ...prev, imageUrl: imgData.imageUrl }));
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during generation.');
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateImage = async (customPrompt?: string) => {
    setIsGeneratingImage(true);
    setErrorMessage(null);
    try {
      const promptToUse = customPrompt || analysis.imagePrompt;
      const imgRes = await fetch('/api/generate-banner-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          model: customization.imageModel,
          aspectRatio: customization.aspectRatio,
          imageSize: customization.imageSize,
        }),
      });

      if (!imgRes.ok) {
        const errData = await imgRes.json();
        throw new Error(errData.error || 'Failed to generate image');
      }

      const imgData = await imgRes.json();
      if (imgData.imageUrl) {
        setCustomization((prev) => ({ ...prev, imageUrl: imgData.imageUrl }));
        setSuccessMessage('Successfully generated new AI background image!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to regenerate image.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: analysis.productTitle,
          description: analysis.targetAudience,
          tone: 'persuasive and high-converting',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.headlines?.[0]) {
          setCustomization((prev) => ({
            ...prev,
            headline: data.headlines[0],
            subheading: data.subheadings?.[0] || prev.subheading,
            ctaText: data.callToActions?.[0] || prev.ctaText,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleLoadPreset = (presetName: string) => {
    if (presetName.includes('Smart Water Bottle')) {
      handleGenerate({
        url: 'https://auraflow.example.com',
        description: 'AuraFlow Smart Eco Water Bottle with LED temperature display, 24h cold insulation, and self-cleaning UV purification.',
        brandName: 'AuraFlow',
        model: 'gemini-3-pro-image-preview',
        imageSize: '2K',
        aspectRatio: '1:1',
      });
    } else if (presetName.includes('SaaS AI')) {
      handleGenerate({
        url: 'https://metricpulse.example.com',
        description: 'MetricPulse AI Business Intelligence SaaS platform with real-time predictive analytics, automated reporting, and beautiful interactive dashboards.',
        brandName: 'MetricPulse',
        model: 'gemini-3-pro-image-preview',
        imageSize: '2K',
        aspectRatio: '16:9',
      });
    } else if (presetName.includes('Skincare')) {
      handleGenerate({
        url: 'https://luminagold.example.com',
        description: 'Lumina Gold Anti-Aging Luxury Organic Facial Serum with 24k gold flakes, hyaluronic acid, and botanical stem cells for glowing skin.',
        brandName: 'Lumina Gold',
        model: 'gemini-3-pro-image-preview',
        imageSize: '2K',
        aspectRatio: '1:1',
      });
    } else if (presetName.includes('Headphones')) {
      handleGenerate({
        url: 'https://sonicpromax.example.com',
        description: 'SonicPro Max Wireless Active Noise Cancelling Over-Ear Headphones with 40-hour battery, Hi-Res spatial audio, and ultra-soft memory foam earcups.',
        brandName: 'SonicPro Max',
        model: 'gemini-3-pro-image-preview',
        imageSize: '2K',
        aspectRatio: '16:9',
      });
    }
  };

  const filteredSizes = STANDARD_BANNER_SIZES.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col">
      <Header
        onLoadPreset={handleLoadPreset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedBanners.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success / Error Banners */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {activeTab === 'gallery' ? (
          <SavedGallery
            savedBanners={savedBanners}
            onDelete={handleDeleteSaved}
            onClearAll={handleClearAllSaved}
          />
        ) : (
          <>
            <ProductInputSection
              onGenerate={handleGenerate}
              isLoading={isLoading}
              initialUrl="https://auraflow.example.com"
              initialDescription={DEFAULT_ANALYSIS.productTitle}
            />

            <CustomizerPanel
              analysis={analysis}
              customization={customization}
              onChange={setCustomization}
              onRegenerateImage={handleRegenerateImage}
              onRegenerateCopy={handleRegenerateCopy}
              isGeneratingImage={isGeneratingImage}
              isGeneratingCopy={isGeneratingCopy}
            />

            {/* Banner Grid Header & Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Standard Ad Sizes Suite ({filteredSizes.length})
                </h3>
                <p className="text-xs text-slate-500">Live preview across IAB standards, mobile, and social platforms</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-bold text-slate-700">
                {['All', 'IAB Standard', 'Mobile', 'Social Media'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded transition-all uppercase tracking-wider text-[10px] ${
                      selectedCategory === cat ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSizes.map((bannerSize) => (
                <BannerPreviewCard
                  key={bannerSize.id}
                  bannerSize={bannerSize}
                  customization={customization}
                  onExpand={(size) => setSelectedBannerForModal(size)}
                  onSaveBanner={handleSaveBanner}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Detail Inspection Modal */}
      <BannerDetailModal
        bannerSize={selectedBannerForModal}
        customization={customization}
        onClose={() => setSelectedBannerForModal(null)}
        onSaveBanner={handleSaveBanner}
      />

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 font-medium">
        <p>BannerCraft AI • Powered by Gemini 3 Pro & Flash Image AI</p>
      </footer>
    </div>
  );
}
