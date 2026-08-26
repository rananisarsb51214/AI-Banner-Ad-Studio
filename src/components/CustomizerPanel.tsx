import React, { useState } from 'react';
import { AdCustomization, ProductAnalysis } from '../types';
import { Sparkles, Palette, Type, Layout, Image as ImageIcon, RefreshCw, Check } from 'lucide-react';

interface CustomizerPanelProps {
  analysis: ProductAnalysis;
  customization: AdCustomization;
  onChange: (updated: AdCustomization) => void;
  onRegenerateImage: (customPrompt?: string) => void;
  onRegenerateCopy: () => void;
  isGeneratingImage: boolean;
  isGeneratingCopy: boolean;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  analysis,
  customization,
  onChange,
  onRegenerateImage,
  onRegenerateCopy,
  isGeneratingImage,
  isGeneratingCopy,
}) => {
  const [customImagePrompt, setCustomImagePrompt] = useState(analysis.imagePrompt);

  const presets = [
    { name: 'Vibrant Tech', primary: '#4f46e5', secondary: '#9333ea', accent: '#ec4899', background: '#0f172a', text: '#ffffff' },
    { name: 'Sunset Glow', primary: '#ea580c', secondary: '#db2777', accent: '#facc15', background: '#1c1917', text: '#ffffff' },
    { name: 'Clean Modern', primary: '#0284c7', secondary: '#0d9488', accent: '#38bdf8', background: '#f8fafc', text: '#0f172a' },
    { name: 'Luxury Dark', primary: '#d4af37', secondary: '#78716c', accent: '#fef08a', background: '#09090b', text: '#fafafa' },
    { name: 'Eco Fresh', primary: '#16a34a', secondary: '#0d9488', accent: '#4ade80', background: '#f0fdf4', text: '#14532d' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            Ad Studio Customization Suite
          </h3>
          <p className="text-xs text-slate-500">Fine-tune copy, color schemes, layout templates, and AI background imagery</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerateCopy}
            disabled={isGeneratingCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
            New AI Copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Copy Editing */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-500" />
            Ad Copy & Messaging
          </h4>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              value={customization.headline}
              onChange={(e) => onChange({ ...customization, headline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {analysis.headlines.map((h, i) => (
                <button
                  key={i}
                  onClick={() => onChange({ ...customization, headline: h })}
                  className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2 py-0.5 rounded truncate max-w-[200px] transition-all"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Subheading</label>
            <input
              type="text"
              value={customization.subheading}
              onChange={(e) => onChange({ ...customization, subheading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">CTA Button</label>
              <input
                type="text"
                value={customization.ctaText}
                onChange={(e) => onChange({ ...customization, ctaText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={customization.badgeText}
                onChange={(e) => onChange({ ...customization, badgeText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Layout & Colors */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            Layout Template & Palette
          </h4>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Layout Structure</label>
            <div className="grid grid-cols-3 gap-2">
              {(['modern', 'bold', 'split', 'minimal', 'luxury'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => onChange({ ...customization, layoutStyle: style })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    customization.layoutStyle === style
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Color Palettes</label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  title={p.name}
                  onClick={() =>
                    onChange({
                      ...customization,
                      selectedColorPalette: {
                        primary: p.primary,
                        secondary: p.secondary,
                        accent: p.accent,
                        background: p.background,
                        text: p.text,
                      },
                    })
                  }
                  className="h-10 rounded-lg border-2 overflow-hidden flex flex-col shadow-sm transition-transform hover:scale-105"
                  style={{ borderColor: customization.selectedColorPalette.primary === p.primary ? '#4f46e5' : '#e2e8f0' }}
                >
                  <div className="flex-1" style={{ backgroundColor: p.primary }}></div>
                  <div className="flex-1" style={{ backgroundColor: p.accent }}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.selectedColorPalette.primary}
                  onChange={(e) =>
                    onChange({
                      ...customization,
                      selectedColorPalette: { ...customization.selectedColorPalette, primary: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-700">{customization.selectedColorPalette.primary}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.selectedColorPalette.background}
                  onChange={(e) =>
                    onChange({
                      ...customization,
                      selectedColorPalette: { ...customization.selectedColorPalette, background: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-700">{customization.selectedColorPalette.background}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: AI Image Generator Controls */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            AI Background Visuals
          </h4>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Image Prompt</label>
            <textarea
              rows={3}
              value={customImagePrompt}
              onChange={(e) => setCustomImagePrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          <button
            onClick={() => onRegenerateImage(customImagePrompt)}
            disabled={isGeneratingImage}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                Generating Studio Image ({customization.imageSize})...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                Regenerate AI Visual
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
