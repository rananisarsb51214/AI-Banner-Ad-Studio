import React, { useRef, useState } from 'react';
import { BannerSize, AdCustomization } from '../types';
import { X, Download, Check, Sparkles, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BannerDetailModalProps {
  bannerSize: BannerSize | null;
  customization: AdCustomization;
  onClose: () => void;
  onSaveBanner: (bannerSize: BannerSize, dataUrl: string) => void;
}

export const BannerDetailModal: React.FC<BannerDetailModalProps> = ({
  bannerSize,
  customization,
  onClose,
  onSaveBanner,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!bannerSize) return null;

  const handleDownload = async () => {
    if (!bannerRef.current) return;
    setIsDownloading(true);
    try {
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

  const htmlSnippet = `<div style="width:${bannerSize.width}px;height:${bannerSize.height}px;background:${customization.selectedColorPalette.background};color:${customization.selectedColorPalette.text};position:relative;overflow:hidden;font-family:sans-serif;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
  <h2 style="font-size:20px;font-weight:bold;">${customization.headline}</h2>
  <a href="#" style="background:${customization.selectedColorPalette.primary};color:#fff;padding:8px 16px;text-decoration:none;border-radius:4px;display:inline-block;">${customization.ctaText}</a>
</div>`;

  const { primary, secondary, accent, background, text } = customization.selectedColorPalette;
  const isDarkBg = background.toLowerCase() < '#888888';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-base font-bold text-zinc-900">{bannerSize.name} Inspection</h3>
            <span className="text-xs font-mono text-zinc-500">
              Dimensions: {bannerSize.width} × {bannerSize.height}px ({bannerSize.category})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-auto flex flex-col items-center justify-center bg-zinc-900/90">
          <div className="shadow-2xl rounded-xl overflow-hidden relative border border-white/10 max-w-full">
            <div
              ref={bannerRef}
              style={{
                width: bannerSize.width,
                height: bannerSize.height,
                backgroundColor: background,
                color: text,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: bannerSize.width < 300 || bannerSize.height < 100 ? '12px' : '28px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
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

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: Math.max(12, bannerSize.height * 0.08),
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: primary,
                    background: isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {customization.brandName || 'Brand'}
                </span>
                {customization.badgeText && (
                  <span
                    style={{
                      fontSize: Math.max(10, bannerSize.height * 0.07),
                      fontWeight: 700,
                      background: accent,
                      color: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {customization.badgeText}
                  </span>
                )}
              </div>

              <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
                <h2
                  style={{
                    fontSize: Math.min(Math.max(16, bannerSize.height * 0.22), bannerSize.width * 0.07),
                    fontWeight: 900,
                    lineHeight: 1.15,
                    marginBottom: '12px',
                    color: text,
                    textShadow: isDarkBg ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                  }}
                >
                  {customization.headline}
                </h2>
                {customization.subheading && (
                  <p
                    style={{
                      fontSize: Math.min(Math.max(11, bannerSize.height * 0.12), bannerSize.width * 0.035),
                      opacity: 0.9,
                      color: text,
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
                    fontSize: Math.max(12, bannerSize.height * 0.09),
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  {customization.ctaText || 'Shop Now'} →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(htmlSnippet);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied HTML!' : 'Copy HTML5 Snippet'}
            </button>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Downloaded Successfully!
              </>
            ) : isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rendering PNG...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download High-Res PNG
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
