export type SubscriptionFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export type BouquetSizeId = 'PETITE' | 'CLASSIC' | 'ATELIER_LUXE';

export type ColorPaletteId = 'PASTEL_MEADOW' | 'WARM_TERRACOTTA' | 'WHITE_BOTANICAL' | 'VIBRANT_GARDEN';

export type WrappingStyleId = 'KRAFT_LINEN' | 'CERAMIC_VASE' | 'FLUTED_GLASS';

export type StemRole = 'FOCAL' | 'SECONDARY' | 'FOLIAGE';

export type DeliveryDay = 'Martes' | 'Jueves' | 'Viernes' | 'Sábado';

export interface BouquetSizeOption {
  id: BouquetSizeId;
  name: string;
  tagline: string;
  stemQuota: number;
  basePrice: number;
  recommendedFor: string;
}

export interface ColorPaletteOption {
  id: ColorPaletteId;
  name: string;
  description: string;
  swatches: string[];
}

export interface FlowerVariety {
  id: string;
  name: string;
  botanicalName: string;
  role: StemRole;
  season: string;
  priceSupplementPerStem: number;
  colors: ColorPaletteId[];
  colorHex: string;
  scentLevel: 'Sutil' | 'Fragante' | 'Intenso';
  imageUrl: string;
  description: string;
}

export interface WrappingOption {
  id: WrappingStyleId;
  name: string;
  description: string;
  price: number;
  firstDeliveryFreeOnWeekly: boolean;
  badge?: string;
}

export interface StemSelection {
  flowerId: string;
  count: number;
}

export interface CuratedPreset {
  id: string;
  name: string;
  seasonTag: string;
  description: string;
  imageUrl: string;
  frequency: SubscriptionFrequency;
  sizeId: BouquetSizeId;
  paletteId: ColorPaletteId;
  wrappingId: WrappingStyleId;
  stems: StemSelection[];
  startingPrice: number;
}

export interface SubscriptionOrderPayload {
  id: string;
  createdAtIso: string;
  status: 'ACTIVE' | 'PAUSED' | 'SKIPPED_NEXT';
  frequency: SubscriptionFrequency;
  sizeId: BouquetSizeId;
  paletteId: ColorPaletteId;
  wrappingId: WrappingStyleId;
  stems: StemSelection[];
  deliveryDay: DeliveryDay;
  nextDeliveryDate: string;
  recipientName: string;
  deliveryAddress: string;
  giftNote: string;
  unitPricePerDelivery: number;
  discountAppliedPercent: number;
}
