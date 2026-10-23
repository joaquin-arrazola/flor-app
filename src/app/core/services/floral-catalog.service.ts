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
      label: 'Suscripción Semanal',
      cadenceText: '4 entregas al mes · Día del Club',
      discountPercent: 12.5,
      badge: 'Más Popular · 210 Bs/mes',
      perks: [
        'Plan El Club Esencial a 210 Bs/mes (52.50 Bs/entrega)',
        '4 entregas al mes concentradas en el Día del Club para máxima frescura',
        'Jarrón de cerámica artesanal de cortesía en tu primera entrega',
        'Tarjeta informativa del productor local y consejos para alargar el ramo',
        'Empaque 100% ecológico (kraft y cordel de yute biodegradable)',
        'Salta entregas o pausa cuando quieras con 1 clic'
      ]
    },
    {
      id: 'BIWEEKLY',
      label: 'Suscripción Quincenal',
      cadenceText: '2 entregas al mes · Durabilidad Óptima',
      discountPercent: 0,
      badge: 'Ideal para Iniciar · 120 Bs/mes',
      perks: [
        'Plan Quincenal Esencial a 120 Bs/mes (60 Bs por entrega)',
        '2 entregas mensuales para crear el hábito floral en casa',
        'Flores frescas locales seleccionadas por su durabilidad de 12–14 días',
        'Tarjeta informativa del productor local y nutriente ecológico',
        'Personaliza o cambia tus tallos antes de cada cosecha'
      ]
    },
    {
      id: 'MONTHLY',
      label: 'Ritual Mensual',
      cadenceText: '1 entrega botánica de autor al mes',
      discountPercent: 0,
      badge: 'Caja de Temporada',
      perks: [
        '1 caja botánica abundante cada mes con la floración estacional de altura',
        'Compra directa a agricultores y cooperativas florícolas locales a precio justo',
        'Empaque 100% ecológico y compostable sin plásticos de un solo uso',
        'Cancela o cambia al plan semanal cuando quieras'
      ]
    }
  ];

  readonly sizes: BouquetSizeOption[] = [
    {
      id: 'PETITE',
      name: 'Rincón Petite',
      tagline: 'Arreglo fresco y ligero de temporada para mesas de noche o escritorios',
      stemQuota: 10,
      basePrice: 40,
      recommendedFor: 'Mesa de noche, Escritorio, Rincón de lectura'
    },
    {
      id: 'CLASSIC',
      name: 'Plan El Club / Esencial',
      tagline: 'Producto estrella: ramo abundante para el espacio principal con flores focales destacadas y combinación estacional',
      stemQuota: 18,
      basePrice: 60,
      recommendedFor: 'Espacio principal del hogar, Sala, Comedor'
    },
    {
      id: 'ATELIER_LUXE',
      name: 'Plan Rincón Verde / Dúo',
      tagline: 'Selección equilibrada de flores de temporada y verde ornamental para jarrón mediano o dos rincones de la casa',
      stemQuota: 26,
      basePrice: 85.71,
      recommendedFor: 'Dos rincones de la casa, Jarrón mediano o dos jarrones'
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
      name: 'Empaque 100% Ecológico (Kraft y Cordel Biodegradable)',
      description: 'Papel kraft natural reciclable atado con yute y cordel biodegradable. Cero plásticos de un solo uso.',
      price: 0,
      firstDeliveryFreeOnWeekly: false,
      badge: 'Incluido · Sustentable'
    },
    {
      id: 'CERAMIC_VASE',
      name: 'Jarrón Artesanal de Cerámica Local',
      description: 'Vasija de gres mate elaborada a mano por alfareros y artesanos locales para arreglos del Club.',
      price: 20,
      firstDeliveryFreeOnWeekly: true,
      badge: 'Gratis en Plan Semanal'
    },
    {
      id: 'FLUTED_GLASS',
      name: 'Florero Boticario de Vidrio Reciclado',
      description: 'Vasija de vidrio reciclado acanalado que realza la luz y textura del follaje local.',
      price: 15,
      firstDeliveryFreeOnWeekly: false
    }
  ];

  readonly curatedPresets: CuratedPreset[] = [
    {
      id: 'preset-club-esencial',
      name: 'Plan El Club / Esencial',
      seasonTag: 'Producto Estrella · 210 Bs/mes',
      description: 'Ramo abundante para el espacio principal del hogar con flores focales destacadas y combinación estacional de temporada.',
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      frequency: 'WEEKLY',
      sizeId: 'CLASSIC',
      paletteId: 'WARM_TERRACOTTA',
      wrappingId: 'CERAMIC_VASE',
      stems: [
        { flowerId: 'ranunculus-butterfly', count: 5 },
        { flowerId: 'cafe-au-lait-dahlia', count: 3 },
        { flowerId: 'cosmos-apricot', count: 5 },
        { flowerId: 'olive-branch', count: 5 }
      ],
      startingPrice: 52.5
    },
    {
      id: 'preset-rincon-verde-duo',
      name: 'Plan Rincón Verde / Dúo',
      seasonTag: 'Doble Rincón · 300 Bs/mes',
      description: 'Selección equilibrada de flores de temporada y verde ornamental para jarrón mediano o dos rincones de la casa.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      frequency: 'WEEKLY',
      sizeId: 'ATELIER_LUXE',
      paletteId: 'PASTEL_MEADOW',
      wrappingId: 'KRAFT_LINEN',
      stems: [
        { flowerId: 'garden-rose-juliet', count: 7 },
        { flowerId: 'ranunculus-butterfly', count: 6 },
        { flowerId: 'sweet-pea-spencer', count: 6 },
        { flowerId: 'silver-dollar-eucalyptus', count: 7 }
      ],
      startingPrice: 75
    },
    {
      id: 'preset-quincenal-esencial',
      name: 'Plan Quincenal Esencial',
      seasonTag: 'Inicio Floral · 120 Bs/mes',
      description: 'Flores locales seleccionadas por su durabilidad natural de 12–14 días para disfrutar de flores frescas cada dos semanas.',
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
      frequency: 'BIWEEKLY',
      sizeId: 'CLASSIC',
      paletteId: 'WHITE_BOTANICAL',
      wrappingId: 'KRAFT_LINEN',
      stems: [
        { flowerId: 'anemone-panda', count: 5 },
        { flowerId: 'white-lisianthus', count: 5 },
        { flowerId: 'cosmos-apricot', count: 4 },
        { flowerId: 'silver-dollar-eucalyptus', count: 4 }
      ],
      startingPrice: 60
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
  readonly giftNote = signal<string>('Que estas flores frescas de agricultores locales iluminen cada semana en casa.');

  readonly stemSelections = signal<StemSelection[]>([
    { flowerId: 'ranunculus-butterfly', count: 5 },
    { flowerId: 'garden-rose-juliet', count: 4 },
    { flowerId: 'cosmos-apricot', count: 4 },
    { flowerId: 'silver-dollar-eucalyptus', count: 5 }
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
        { flowerId: 'cosmos-apricot', count: 5 },
        { flowerId: 'olive-branch', count: 5 }
      ],
      deliveryDay: 'Viernes',
      nextDeliveryDate: 'Viernes (Día del Club)',
      recipientName: 'Clara Vance',
      deliveryAddress: 'Av. Jardín Botánico 742, Dpto. 4B',
      giftNote: 'Ramo semanal para el espacio principal',
      unitPricePerDelivery: 52.5,
      discountAppliedPercent: 12.5
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
