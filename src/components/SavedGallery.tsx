import React from 'react';
import { Download, Trash2, Sparkles, Layers } from 'lucide-react';
import { BannerSize } from '../types';

interface SavedBanner {
  id: string;
  bannerName: string;
  dimensions: string;
  dataUrl: string;
  createdAt: string;
}

interface SavedGalleryProps {
  savedBanners: SavedBanner[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const SavedGallery: React.FC<SavedGalleryProps> = ({ savedBanners, onDelete, onClearAll }) => {
  if (savedBanners.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm my-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Banners Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Generate your ad suite and click download on any banner size to save high-resolution PNGs here for your campaigns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Saved Banner Assets ({savedBanners.length})</h3>
          <p className="text-xs text-slate-500">Your generated and downloaded high-resolution ad banners</p>
        </div>
        <button
          onClick={onClearAll}
          className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedBanners.map((banner) => (
          <div key={banner.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="p-4 bg-slate-100 flex items-center justify-center h-48 relative">
              <img
                src={banner.dataUrl}
                alt={banner.bannerName}
                className="max-h-full max-w-full object-contain rounded shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 flex items-center justify-between border-t border-slate-200 bg-white">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{banner.bannerName}</h4>
                <span className="text-[10px] font-mono text-slate-500">{banner.dimensions}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={banner.dataUrl}
                  download={`${banner.bannerName}.png`}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                  title="Download PNG"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onDelete(banner.id)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
