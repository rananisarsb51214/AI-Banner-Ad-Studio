import React, { useRef, useState } from 'react';
import { BannerSize, AdCustomization } from '../types';
import { Download, Maximize2, Check, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BannerPreviewCardProps {
  bannerSize: BannerSize;
  customization: AdCustomization;
  onExpand: (bannerSize: BannerSize) => void;
  onSaveBanner: (bannerSize: BannerSize, dataUrl: string) => void;
}

export const BannerPreviewCard: React.FC<BannerPreviewCardProps> = ({
  bannerSize,
  customization,
  onExpand,
  onSaveBanner,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Calculate preview scale so large sizes fit neatly in the card grid
  // Standard container width in preview card is ~360px max
  const maxWidth = 340;
  const scale = Math.min(1, maxWidth / bannerSize.width);
  const previewWidth = bannerSize.width * scale;
  const previewHeight = bannerSize.height * scale;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bannerRef.current) return;
    setIsDownloading(true);
    try {
      // Temporarily scale up for high quality export at exact dimensions
      const canvas = await html2canvas(bannerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${bannerSize.id}-${bannerSize.width}x${bannerSize.height}.png`;
      link.href = dataUrl;
      link.click();

      onSaveBanner(bannerSize, dataUrl);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to export banner:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const { primary, secondary, accent, background, text } = customization.selectedColorPalette;
  const isDarkBg = background.toLowerCase() < '#888888';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">{bannerSize.name}</h4>
          <span className="text-[10px] font-mono text-slate-500">
            {bannerSize.width} × {bannerSize.height}px • {bannerSize.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onExpand(bannerSize)}
            title="Expand Preview"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download PNG"
            className="p-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1"
          >
            {downloadSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Banner Preview Stage */}
      <div className="p-4 bg-slate-100 flex items-center justify-center flex-1 min-h-[220px] relative overflow-hidden group">
        <div
          style={{
            width: previewWidth,
            height: previewHeight,
            position: 'relative',
          }}
          className="shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform group-hover:scale-[1.01]"
          onClick={() => onExpand(bannerSize)}
        >
          {/* Hidden exact-size DOM node for html2canvas export */}
          <div
            ref={bannerRef}
            style={{
              width: bannerSize.width,
              height: bannerSize.height,
              backgroundColor: background,
              color: text,
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: bannerSize.width < 300 || bannerSize.height < 100 ? '8px' : '20px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Background Image / Overlay */}
            {customization.imageUrl && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${customization.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: customization.layoutStyle === 'minimal' ? 0.25 : 0.45,
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  customization.layoutStyle === 'bold'
                    ? `linear-gradient(135deg, ${primary}cc, ${secondary}cc)`
                    : customization.layoutStyle === 'luxury'
                    ? `radial-gradient(circle, transparent 30%, ${background}ee 90%)`
                    : `linear-gradient(to top, ${background}ee, ${background}88)`,
                zIndex: 1,
              }}
            />

            {/* Content Layouts */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: Math.max(10, bannerSize.height * 0.08),
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: primary,
                  background: isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {customization.brandName || 'Brand'}
              </span>
              {customization.badgeText && (
                <span
                  style={{
                    fontSize: Math.max(9, bannerSize.height * 0.07),
                    fontWeight: 700,
                    background: accent,
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {customization.badgeText}
                </span>
              )}
            </div>

            <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
              <h2
                style={{
                  fontSize: Math.min(Math.max(12, bannerSize.height * 0.22), bannerSize.width * 0.07),
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: bannerSize.height > 150 ? '8px' : '2px',
                  color: text,
                  textShadow: isDarkBg ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                }}
              >
                {customization.headline}
              </h2>
              {bannerSize.height > 120 && customization.subheading && (
                <p
                  style={{
                    fontSize: Math.min(Math.max(9, bannerSize.height * 0.12), bannerSize.width * 0.035),
                    opacity: 0.9,
                    color: text,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {customization.subheading}
                </p>
              )}
            </div>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{
                  backgroundColor: primary,
                  color: '#ffffff',
                  fontSize: Math.max(10, bannerSize.height * 0.09),
                  fontWeight: 700,
                  padding: bannerSize.height < 100 ? '4px 10px' : '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                }}
              >
                {customization.ctaText || 'Shop Now'} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
