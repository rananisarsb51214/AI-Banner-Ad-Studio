export interface BannerSize {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'IAB Standard' | 'Mobile' | 'Social Media';
  description: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ProductAnalysis {
  brandName: string;
  productTitle: string;
  category: string;
  targetAudience: string;
  headlines: string[];
  subheadings: string[];
  callToActions: string[];
  badges: string[];
  colorPalette: ColorPalette;
  imagePrompt: string;
}

export interface AdCustomization {
  headline: string;
  subheading: string;
  ctaText: string;
  badgeText: string;
  brandName: string;
  selectedColorPalette: ColorPalette;
  layoutStyle: 'modern' | 'bold' | 'split' | 'minimal' | 'luxury';
  imageUrl: string;
  logoUrl?: string;
  aspectRatio: string;
  imageSize: '1K' | '2K' | '4K';
  imageModel: string;
}
