import React, { useState } from 'react';
import { Globe, FileText, Sparkles, Sliders, Loader2, Image as ImageIcon, Layers } from 'lucide-react';

interface ProductInputSectionProps {
  onGenerate: (data: {
    url: string;
    description: string;
    brandName: string;
    model: string;
    imageSize: '1K' | '2K' | '4K';
    aspectRatio: string;
  }) => void;
  isLoading: boolean;
  initialUrl?: string;
  initialDescription?: string;
}

export const ProductInputSection: React.FC<ProductInputSectionProps> = ({
  onGenerate,
  isLoading,
  initialUrl = '',
  initialDescription = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [description, setDescription] = useState(initialDescription);
  const [brandName, setBrandName] = useState('');
  const [model, setModel] = useState<'gemini-3.1-flash-image-preview' | 'gemini-3-pro-image-preview'>('gemini-3-pro-image-preview');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !description) {
      alert('Please enter a product URL or product description.');
      return;
    }
    onGenerate({ url, description, brandName, model, imageSize, aspectRatio });
  };

  return (
    <div className="bg-slate-900 text-white py-10 px-6 sm:px-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden border border-slate-800">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 3 Pro & Flash Image AI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Generate High-Converting Banner Ads
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Instantly create professional banner ad suites in all standard IAB and social sizes from any product link or description.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Product Landing Page URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product/smart-bottle"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Brand Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. AuraFlow"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Product Description & Key Selling Points
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product features, target audience, special discounts, or value proposition..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
          </div>

          {/* Advanced Model & Image Config */}
          <div className="border-t border-slate-700 pt-4 mt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-indigo-200 transition-colors mb-3 uppercase tracking-wider"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showAdvanced ? 'Hide Advanced Image AI Settings' : 'Configure Image AI Settings (Model, Quality, Aspect Ratio)'}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image Model</label>
                  <select
                    value={model}
                    onChange={(e: any) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="gemini-3-pro-image-preview">Gemini 3 Pro (Studio Quality)</option>
                    <option value="gemini-3.1-flash-image-preview">Gemini 3.1 Flash (Fast & Vibrant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image Resolution</label>
                  <select
                    value={imageSize}
                    onChange={(e: any) => setImageSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1K">1K HD Standard</option>
                    <option value="2K">2K Ultra HD</option>
                    <option value="4K">4K Cinematic Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Base Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical Story</option>
                    <option value="4:3">4:3 Standard</option>
                    <option value="3:4">3:4 Portrait</option>
                    <option value="3:2">3:2 Photo</option>
                    <option value="2:3">2:3 Poster</option>
                    <option value="21:9">21:9 Cinematic</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Product & Generating Banner Suite...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate All Standard Banner Ads
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
