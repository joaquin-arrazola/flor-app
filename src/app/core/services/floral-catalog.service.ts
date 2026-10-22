import { Injectable, computed, signal } from '@angular/core';
import {
  BouquetSizeId,
  BouquetSizeOption,
  ColorPaletteId,
  ColorPaletteOption,
  CuratedPreset,
  DeliveryDay,
  FlowerVariety,
  StemSelection,
  SubscriptionFrequency,
  SubscriptionOrderPayload,
  WrappingOption,
  WrappingStyleId
} from '../models/floral.models';

@Injectable({
  providedIn: 'root'
})
export class FloralCatalogService {
  /**
   * Referencia del endpoint base para el futuro backend en Java:
   * ej., `${environment.apiUrl}/api/v1/subscriptions`
   */
  readonly apiEndpointPreview = '/api/v1/client/subscriptions';

  readonly frequencies: {
    id: SubscriptionFrequency;
    label: string;
    cadenceText: string;
    discountPercent: number;
    badge?: string;
    perks: string[];
  }[] = [
    {
      id: 'WEEKLY',
      label: 'Atelier Semanal',
      cadenceText: '4 entregas frescas cada mes',
      discountPercent: 15,
      badge: 'Más Popular · Ahorra 15%',
      perks: [
        '15% de descuento en cada ramo y tallos adicionales',
        'Jarrón de cerámica artesanal de cortesía en tu 1.ª entrega',
        'Salta o pausa cualquier semana con 1 clic'
      ]
    },
    {
      id: 'BIWEEKLY',
      label: 'Cada Dos Semanas',
      cadenceText: '2 entregas seleccionadas al mes',
      discountPercent: 10,
      badge: 'Ahorra 10%',
      perks: [
        '10% de descuento en cada ramo',
        'Equilibrio ideal para tallos de temporada de larga duración',
        'Cambia las variedades de flores antes de cada envío'
      ]
    },
    {
      id: 'MONTHLY',
      label: 'Ritual Mensual',
      cadenceText: '1 caja botánica de autor cada mes',
      discountPercent: 0,
      perks: [
        'Incluye guía de edición de temporada y nutriente floral',
        'Personaliza tus tallos hasta 48 h antes de la entrega',
        'Cancela o cambia al plan semanal cuando quieras'
      ]
    }
  ];

  readonly sizes: BouquetSizeOption[] = [
    {
      id: 'PETITE',
      name: 'Ramo Petite',
      tagline: 'Arreglo íntimo y ligero para escritorios o mesas de noche',
      stemQuota: 12,
      basePrice: 44,
      recommendedFor: 'Mesa de noche, Estudio en casa, Rincón de lectura'
    },
    {
      id: 'CLASSIC',
      name: 'Clásico de Autor',
      tagline: 'Centro de mesa botánico abundante con texturas en capas',
      stemQuota: 20,
      basePrice: 64,
      recommendedFor: 'Comedor, Isla de cocina, Sala principal'
    },
    {
      id: 'ATELIER_LUXE',
      name: 'Atelier Grand Luxe',
      tagline: 'Pieza arquitectónica imponente con tallos de jardín exclusivos',
      stemQuota: 30,
      basePrice: 92,
      recommendedFor: 'Recibidor principal, Mesa de eventos, Regalo especial'
    }
  ];

  readonly palettes: ColorPaletteOption[] = [
    {
      id: 'PASTEL_MEADOW',
      name: 'Pradera Matinal',
      description: 'Rosa empolvado, crema suave, lavanda silvestre y eucalipto plateado',
      swatches: ['#F4ACB7', '#FCEFB4', '#C8B6FF', '#95B8A6']
    },
    {
      id: 'WARM_TERRACOTTA',
      name: 'Terracota al Sol',
      description: 'Ranúnculos damasco, siena tostado, ocre miel y ramas de olivo',
      swatches: ['#E07A5F', '#F2CC8F', '#D4A373', '#606C38']
    },
    {
      id: 'WHITE_BOTANICAL',
      name: 'Alabastro y Salvia',
      description: 'Pétalos marfil impecables, anémonas blancas y exuberante follaje esmeralda',
      swatches: ['#FAF9F6', '#E8E4D9', '#A3B18A', '#3A5A40']
    },
    {
      id: 'VIBRANT_GARDEN',
      name: 'Invernadero Silvestre',
      description: 'Coral vibrante, azul delfinio, frambuesa y botánicos luminosos',
      swatches: ['#FF6B6B', '#7209B7', '#4EA8DE', '#52B788']
    }
  ];

  readonly flowers: FlowerVariety[] = [
    {
      id: 'ranunculus-butterfly',
      name: 'Ranúnculo Mariposa',
      botanicalName: 'Ranunculus asiaticus',
      role: 'FOCAL',
      season: 'Primavera / Otoño',
      priceSupplementPerStem: 1.5,
      colors: ['WARM_TERRACOTTA', 'PASTEL_MEADOW', 'VIBRANT_GARDEN'],
      colorHex: '#E07A5F',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
      description: 'Pétalos delicados como seda con una extraordinaria vida en jarrón.'
    },
    {
      id: 'garden-rose-juliet',
      name: 'Rosa de Jardín Inglesa',
      botanicalName: 'Rosa ausjameson',
      role: 'FOCAL',
      season: 'Invernadero todo el año',
      priceSupplementPerStem: 2.0,
      colors: ['PASTEL_MEADOW', 'WARM_TERRACOTTA', 'WHITE_BOTANICAL'],
      colorHex: '#F3B3A6',
      scentLevel: 'Intenso',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      description: 'Rosetas profundas con cálida fragancia a durazno y té.'
    },
    {
      id: 'anemone-panda',
      name: 'Anémona Francesa',
      botanicalName: 'Anemone coronaria',
      role: 'FOCAL',
      season: 'Temporada fresca',
      priceSupplementPerStem: 1.0,
      colors: ['WHITE_BOTANICAL', 'PASTEL_MEADOW'],
      colorHex: '#F4F1EA',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
      description: 'Pétalos color marfil que rodean un dramático centro de terciopelo oscuro.'
    },
    {
      id: 'cafe-au-lait-dahlia',
      name: 'Dalia Café au Lait',
      botanicalName: 'Dahlia pinnata',
      role: 'FOCAL',
      season: 'Finales de Verano / Otoño',
      priceSupplementPerStem: 2.5,
      colors: ['WARM_TERRACOTTA', 'PASTEL_MEADOW'],
      colorHex: '#E6CCB2',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
      description: 'Flores majestuosas de herencia en tonos caramelo cremoso y rubor.'
    },
    {
      id: 'sweet-pea-spencer',
      name: 'Guisante de Olor Heirloom',
      botanicalName: 'Lathyrus odoratus',
      role: 'SECONDARY',
      season: 'Primavera / Inicio de Verano',
      priceSupplementPerStem: 0,
      colors: ['PASTEL_MEADOW', 'VIBRANT_GARDEN'],
      colorHex: '#CDB4DB',
      scentLevel: 'Intenso',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
      description: 'Tallos ondulados y perfumados que aportan movimiento y romanticismo.'
    },
    {
      id: 'cosmos-apricot',
      name: 'Cosmos Damasco Limonada',
      botanicalName: 'Cosmos bipinnatus',
      role: 'SECONDARY',
      season: 'Verano / Otoño',
      priceSupplementPerStem: 0,
      colors: ['WARM_TERRACOTTA', 'PASTEL_MEADOW', 'VIBRANT_GARDEN'],
      colorHex: '#F6BD60',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=600&q=80',
      description: 'Tallos silvestres danzantes que brindan ligereza sobre las flores focales.'
    },
    {
      id: 'white-lisianthus',
      name: 'Lisianthus Doble',
      botanicalName: 'Eustoma grandiflorum',
      role: 'SECONDARY',
      season: 'Todo el año',
      priceSupplementPerStem: 0.5,
      colors: ['WHITE_BOTANICAL', 'PASTEL_MEADOW', 'VIBRANT_GARDEN'],
      colorHex: '#FAF3DD',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
      description: 'Flores multicapa de textura delicada que se mantienen frescas hasta 14 días.'
    },
    {
      id: 'silver-dollar-eucalyptus',
      name: 'Eucalipto Dólar de Plata',
      botanicalName: 'Eucalyptus polyanthemos',
      role: 'FOLIAGE',
      season: 'Todo el año',
      priceSupplementPerStem: 0,
      colors: ['WHITE_BOTANICAL', 'PASTEL_MEADOW', 'WARM_TERRACOTTA', 'VIBRANT_GARDEN'],
      colorHex: '#84A59D',
      scentLevel: 'Fragante',
      imageUrl: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=600&q=80',
      description: 'Follaje aromático verde salvia que enmarca cada tallo con naturalidad.'
    },
    {
      id: 'olive-branch',
      name: 'Rama de Olivo Mediterráneo',
      botanicalName: 'Olea europaea',
      role: 'FOLIAGE',
      season: 'Todo el año',
      priceSupplementPerStem: 0,
      colors: ['WARM_TERRACOTTA', 'WHITE_BOTANICAL'],
      colorHex: '#606C38',
      scentLevel: 'Sutil',
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80',
      description: 'Ramas arquitectónicas verde plateado para una silueta orgánica provenzal.'
    }
  ];

  readonly wrappings: WrappingOption[] = [
    {
      id: 'KRAFT_LINEN',
      name: 'Papel Kraft Botánico y Cinta de Lino Crudo',
      description: 'Papel kraft francés compostable atado con lino belga sin blanquear y envoltura hidratante.',
      price: 0,
      firstDeliveryFreeOnWeekly: false,
      badge: 'Incluido'
    },
    {
      id: 'CERAMIC_VASE',
      name: 'Jarrón Artesanal de Gres Mate',
      description: 'Vasija de cerámica moteada color crema torneada a mano para arreglos en espiral.',
      price: 18,
      firstDeliveryFreeOnWeekly: true,
      badge: 'Gratis en Plan Semanal'
    },
    {
      id: 'FLUTED_GLASS',
      name: 'Garrafa Boticaria de Vidrio Ámbar Estriado',
      description: 'Vasija de vidrio reciclado acanalado que captura la cálida luz de la tarde.',
      price: 14,
      firstDeliveryFreeOnWeekly: false
    }
  ];

  readonly curatedPresets: CuratedPreset[] = [
    {
      id: 'preset-terracotta-solstice',
      name: 'Solsticio Terracota',
      seasonTag: 'Edición Cosecha de Otoño',
      description: 'Ranúnculos mariposa, dalias Café au Lait, cosmos damasco y ramas de olivo silvestre.',
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      frequency: 'WEEKLY',
      sizeId: 'CLASSIC',
      paletteId: 'WARM_TERRACOTTA',
      wrappingId: 'CERAMIC_VASE',
      stems: [
        { flowerId: 'ranunculus-butterfly', count: 5 },
        { flowerId: 'cafe-au-lait-dahlia', count: 3 },
        { flowerId: 'cosmos-apricot', count: 6 },
        { flowerId: 'olive-branch', count: 6 }
      ],
      startingPrice: 54
    },
    {
      id: 'preset-alabaster-sanctuary',
      name: 'Santuario de Alabastro',
      seasonTag: 'Firma Minimalista',
      description: 'Anémonas francesas blancas, lisianthus doble marfil y aromático eucalipto plateado.',
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      frequency: 'MONTHLY',
      sizeId: 'CLASSIC',
      paletteId: 'WHITE_BOTANICAL',
      wrappingId: 'KRAFT_LINEN',
      stems: [
        { flowerId: 'anemone-panda', count: 6 },
        { flowerId: 'white-lisianthus', count: 8 },
        { flowerId: 'silver-dollar-eucalyptus', count: 6 }
      ],
      startingPrice: 64
    },
    {
      id: 'preset-morning-conservatory',
      name: 'Invernadero Matinal Inglés',
      seasonTag: 'Herencia Fragante',
      description: 'Fragantes rosas de jardín Juliet, guisantes de olor rizados y suave follaje de pradera.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      frequency: 'WEEKLY',
      sizeId: 'ATELIER_LUXE',
      paletteId: 'PASTEL_MEADOW',
      wrappingId: 'CERAMIC_VASE',
      stems: [
        { flowerId: 'garden-rose-juliet', count: 8 },
        { flowerId: 'ranunculus-butterfly', count: 6 },
        { flowerId: 'sweet-pea-spencer', count: 8 },
        { flowerId: 'silver-dollar-eucalyptus', count: 8 }
      ],
      startingPrice: 78
    }
  ];

  // Estado reactivo del configurador (Signals)
  readonly selectedFrequency = signal<SubscriptionFrequency>('WEEKLY');
  readonly selectedSizeId = signal<BouquetSizeId>('CLASSIC');
  readonly selectedPaletteId = signal<ColorPaletteId>('WARM_TERRACOTTA');
  readonly selectedWrappingId = signal<WrappingStyleId>('CERAMIC_VASE');
  readonly selectedDeliveryDay = signal<DeliveryDay>('Viernes');
  readonly recipientName = signal<string>('Clara Vance');
  readonly deliveryAddress = signal<string>('Av. Jardín Botánico 742, Dpto. 4B');
  readonly giftNote = signal<string>('Que estas flores frescas iluminen cada semana en casa.');

  readonly stemSelections = signal<StemSelection[]>([
    { flowerId: 'ranunculus-butterfly', count: 5 },
    { flowerId: 'garden-rose-juliet', count: 4 },
    { flowerId: 'cosmos-apricot', count: 5 },
    { flowerId: 'silver-dollar-eucalyptus', count: 6 }
  ]);

  // Suscripciones activas del cliente
  readonly clientSubscriptions = signal<SubscriptionOrderPayload[]>([
    {
      id: 'SUB-2026-8941',
      createdAtIso: '2026-10-01T10:15:00Z',
      status: 'ACTIVE',
      frequency: 'WEEKLY',
      sizeId: 'CLASSIC',
      paletteId: 'WARM_TERRACOTTA',
      wrappingId: 'CERAMIC_VASE',
      stems: [
        { flowerId: 'ranunculus-butterfly', count: 5 },
        { flowerId: 'cafe-au-lait-dahlia', count: 3 },
        { flowerId: 'cosmos-apricot', count: 6 },
        { flowerId: 'olive-branch', count: 6 }
      ],
      deliveryDay: 'Viernes',
      nextDeliveryDate: 'Viernes, 23 de Oct',
      recipientName: 'Clara Vance',
      deliveryAddress: 'Av. Jardín Botánico 742, Dpto. 4B',
      giftNote: 'Centro de mesa de otoño',
      unitPricePerDelivery: 66.3,
      discountAppliedPercent: 15
    }
  ]);

  readonly currentSize = computed(() =>
    this.sizes.find(s => s.id === this.selectedSizeId()) ?? this.sizes[1]
  );

  readonly currentFrequency = computed(() =>
    this.frequencies.find(f => f.id === this.selectedFrequency()) ?? this.frequencies[0]
  );

  readonly currentPalette = computed(() =>
    this.palettes.find(p => p.id === this.selectedPaletteId()) ?? this.palettes[0]
  );

  readonly currentWrapping = computed(() =>
    this.wrappings.find(w => w.id === this.selectedWrappingId()) ?? this.wrappings[0]
  );

  readonly totalSelectedStems = computed(() =>
    this.stemSelections().reduce((sum, item) => sum + item.count, 0)
  );

  readonly detailedStems = computed(() =>
    this.stemSelections()
      .filter(s => s.count > 0)
      .map(s => {
        const flower = this.flowers.find(f => f.id === s.flowerId)!;
        return {
          ...s,
          flower
        };
      })
  );

  readonly stemSupplementsTotal = computed(() =>
    this.detailedStems().reduce(
      (sum, item) => sum + item.count * item.flower.priceSupplementPerStem,
      0
    )
  );

  readonly wrappingEffectivePrice = computed(() => {
    const wrap = this.currentWrapping();
    if (wrap.firstDeliveryFreeOnWeekly && this.selectedFrequency() === 'WEEKLY') {
      return 0;
    }
    return wrap.price;
  });

  readonly subtotalBeforeDiscount = computed(() =>
    this.currentSize().basePrice + this.stemSupplementsTotal() + this.wrappingEffectivePrice()
  );

  readonly discountAmount = computed(() => {
    const pct = this.currentFrequency().discountPercent;
    return +((this.currentSize().basePrice + this.stemSupplementsTotal()) * (pct / 100)).toFixed(2);
  });

  readonly finalPricePerDelivery = computed(() =>
    +(this.subtotalBeforeDiscount() - this.discountAmount()).toFixed(2)
  );

  readonly estimatedMonthlyTotal = computed(() => {
    const freq = this.selectedFrequency();
    const multiplier = freq === 'WEEKLY' ? 4 : freq === 'BIWEEKLY' ? 2 : 1;
    return +(this.finalPricePerDelivery() * multiplier).toFixed(2);
  });

  getFlowerCount(flowerId: string): number {
    return this.stemSelections().find(s => s.flowerId === flowerId)?.count ?? 0;
  }

  adjustStemCount(flowerId: string, delta: number): void {
    const quota = this.currentSize().stemQuota;
    const currentTotal = this.totalSelectedStems();
    if (delta > 0 && currentTotal >= quota) {
      return;
    }

    const currentList = [...this.stemSelections()];
    const idx = currentList.findIndex(s => s.flowerId === flowerId);
    if (idx > -1) {
      const nextCount = Math.max(0, currentList[idx].count + delta);
      if (nextCount === 0) {
        currentList.splice(idx, 1);
      } else {
        currentList[idx] = { ...currentList[idx], count: nextCount };
      }
    } else if (delta > 0) {
      currentList.push({ flowerId, count: delta });
    }
    this.stemSelections.set(currentList);
  }

  setSize(sizeId: BouquetSizeId): void {
    this.selectedSizeId.set(sizeId);
    const targetQuota = this.sizes.find(s => s.id === sizeId)?.stemQuota ?? 20;
    this.rebalanceStemsToQuota(targetQuota);
  }

  applyPaletteRecommendation(paletteId: ColorPaletteId): void {
    this.selectedPaletteId.set(paletteId);
    const quota = this.currentSize().stemQuota;
    const matchingFlowers = this.flowers.filter(f => f.colors.includes(paletteId));
    if (matchingFlowers.length === 0) return;

    const newSelections: StemSelection[] = [];
    let remaining = quota;
    matchingFlowers.forEach((flower, index) => {
      if (remaining <= 0) return;
      const share =
        index === matchingFlowers.length - 1
          ? remaining
          : Math.max(2, Math.floor(quota / matchingFlowers.length));
      const count = Math.min(remaining, share);
      newSelections.push({ flowerId: flower.id, count });
      remaining -= count;
    });
    this.stemSelections.set(newSelections);
  }

  loadPresetIntoConfigurator(preset: CuratedPreset): void {
    this.selectedFrequency.set(preset.frequency);
    this.selectedSizeId.set(preset.sizeId);
    this.selectedPaletteId.set(preset.paletteId);
    this.selectedWrappingId.set(preset.wrappingId);
    this.stemSelections.set(preset.stems.map(s => ({ ...s })));
  }

  private rebalanceStemsToQuota(quota: number): void {
    const current = [...this.stemSelections()];
    let total = current.reduce((acc, s) => acc + s.count, 0);
    if (total === quota) return;

    if (total > quota) {
      let excess = total - quota;
      for (let i = current.length - 1; i >= 0 && excess > 0; i--) {
        const deduct = Math.min(current[i].count, excess);
        current[i] = { ...current[i], count: current[i].count - deduct };
        excess -= deduct;
      }
      this.stemSelections.set(current.filter(s => s.count > 0));
    } else {
      const deficit = quota - total;
      if (current.length > 0) {
        current[0] = { ...current[0], count: current[0].count + deficit };
        this.stemSelections.set(current);
      } else {
        this.stemSelections.set([{ flowerId: 'ranunculus-butterfly', count: quota }]);
      }
    }
  }

  createSubscriptionFromCurrentConfig(): SubscriptionOrderPayload {
    const newOrder: SubscriptionOrderPayload = {
      id: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAtIso: new Date().toISOString(),
      status: 'ACTIVE',
      frequency: this.selectedFrequency(),
      sizeId: this.selectedSizeId(),
      paletteId: this.selectedPaletteId(),
      wrappingId: this.selectedWrappingId(),
      stems: this.stemSelections().map(s => ({ ...s })),
      deliveryDay: this.selectedDeliveryDay(),
      nextDeliveryDate: `Próximo ${this.selectedDeliveryDay()}`,
      recipientName: this.recipientName(),
      deliveryAddress: this.deliveryAddress(),
      giftNote: this.giftNote(),
      unitPricePerDelivery: this.finalPricePerDelivery(),
      discountAppliedPercent: this.currentFrequency().discountPercent
    };

    this.clientSubscriptions.update(list => [newOrder, ...list]);
    return newOrder;
  }

  toggleSubscriptionStatus(subId: string): void {
    this.clientSubscriptions.update(list =>
      list.map(sub => {
        if (sub.id !== subId) return sub;
        const nextStatus = sub.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...sub, status: nextStatus };
      })
    );
  }

  skipNextDelivery(subId: string): void {
    this.clientSubscriptions.update(list =>
      list.map(sub => {
        if (sub.id !== subId) return sub;
        return {
          ...sub,
          status: 'SKIPPED_NEXT',
          nextDeliveryDate: `Saltada · Se reanuda el siguiente ${sub.deliveryDay}`
        };
      })
    );
  }
}
