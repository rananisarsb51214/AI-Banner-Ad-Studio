import React from 'react';
import { Sparkles, Layers, Wand2, Download } from 'lucide-react';

interface HeaderProps {
  onLoadPreset: (presetName: string) => void;
  activeTab: 'studio' | 'gallery';
  setActiveTab: (tab: 'studio' | 'gallery') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onLoadPreset, activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              BannerCraft AI
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Gemini 3 Pro
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'studio' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Ad Studio
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Saved Banners ({savedCount})
            </button>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm">
              <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
              Quick Presets
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Load Sample Products
              </div>
              <button
                onClick={() => onLoadPreset('Eco-Friendly Smart Water Bottle')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all"
              >
                🌿 AuraFlow Smart Bottle
              </button>
              <button
                onClick={() => onLoadPreset('SaaS AI Analytics Dashboard')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all"
              >
                ⚡ MetricPulse SaaS AI
              </button>
              <button
                onClick={() => onLoadPreset('Luxury Organic Skincare Serum')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all"
              >
                ✨ Lumina Gold Serum
              </button>
              <button
                onClick={() => onLoadPreset('Wireless Noise Cancelling Headphones')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all"
              >
                🎧 SonicPro Max Audio
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
