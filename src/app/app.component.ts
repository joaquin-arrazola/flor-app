import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloralCatalogService } from './core/services/floral-catalog.service';
import {
  BouquetSizeId,
  ColorPaletteId,
  CuratedPreset,
  DeliveryDay,
  StemRole,
  SubscriptionFrequency,
  SubscriptionOrderPayload,
  WrappingStyleId
} from './core/models/floral.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly catalog = inject(FloralCatalogService);

  readonly activeRoleFilter = signal<'ALL' | StemRole>('ALL');
  readonly showSubscriptionsDrawer = signal<boolean>(false);
  readonly showSubscriptionsButton = signal<boolean>(false);
  readonly showPayloadModal = signal<boolean>(false);
  readonly showMobileMenu = signal<boolean>(false);
  readonly showMobileBouquetSheet = signal<boolean>(false);
  readonly latestCreatedOrder = signal<SubscriptionOrderPayload | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly deliveryDays: DeliveryDay[] = [
    'Viernes',
    'Sábado',
    'Jueves',
    'Martes'
  ];

  readonly filteredFlowers = computed(() => {
    const role = this.activeRoleFilter();
    if (role === 'ALL') {
      return this.catalog.flowers;
    }
    return this.catalog.flowers.filter(f => f.role === role);
  });

  readonly quotaProgressPercent = computed(() => {
    const quota = this.catalog.currentSize().stemQuota;
    const current = this.catalog.totalSelectedStems();
    return Math.min(100, Math.round((current / quota) * 100));
  });

  readonly isQuotaComplete = computed(
    () => this.catalog.totalSelectedStems() === this.catalog.currentSize().stemQuota
  );

  // Genera coordenadas visuales para la vista previa SVG del ramo en vivo
  readonly visualBloomDots = computed(() => {
    const detailed = this.catalog.detailedStems();
    const dots: {
      cx: number;
      cy: number;
      r: number;
      fill: string;
      role: StemRole;
      name: string;
    }[] = [];

    let index = 0;
    const total = detailed.reduce((sum, s) => sum + s.count, 0) || 1;

    for (const item of detailed) {
      for (let i = 0; i < item.count; i++) {
        const angle = index * 2.39996;
        const radiusRatio = Math.sqrt((index + 0.5) / total);
        const maxRadius = 68;
        const cx = 140 + Math.cos(angle) * radiusRatio * maxRadius;
        const cy = 115 + Math.sin(angle) * radiusRatio * (maxRadius * 0.72);
        const r =
          item.flower.role === 'FOCAL'
            ? 15
            : item.flower.role === 'SECONDARY'
            ? 11
            : 9;

        dots.push({
          cx: Math.round(cx * 10) / 10,
          cy: Math.round(cy * 10) / 10,
          r,
          fill: item.flower.colorHex,
          role: item.flower.role,
          name: item.flower.name
        });
        index++;
      }
    }
    return dots;
  });

  selectFrequency(freq: SubscriptionFrequency): void {
    this.catalog.selectedFrequency.set(freq);
  }

  selectSize(sizeId: BouquetSizeId): void {
    this.catalog.setSize(sizeId);
  }

  selectPalette(paletteId: ColorPaletteId): void {
    this.catalog.applyPaletteRecommendation(paletteId);
    this.showToast(`Armonía de tallos "${this.catalog.currentPalette().name}" aplicada`);
  }

  selectWrapping(wrapId: WrappingStyleId): void {
    this.catalog.selectedWrappingId.set(wrapId);
  }

  applyPresetAndScroll(preset: CuratedPreset, targetEl: HTMLElement): void {
    this.catalog.loadPresetIntoConfigurator(preset);
    this.showMobileMenu.set(false);
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.showToast(`Diseño "${preset.name}" cargado en el Configurador Atelier`);
  }

  scrollToSection(targetEl: HTMLElement): void {
    this.showMobileMenu.set(false);
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  confirmSubscription(): void {
    this.showMobileBouquetSheet.set(false);
    const order = this.catalog.createSubscriptionFromCurrentConfig();
    this.latestCreatedOrder.set(order);
    this.showPayloadModal.set(true);
  }

  getFlowerName(flowerId: string): string {
    return this.catalog.flowers.find(f => f.id === flowerId)?.name ?? flowerId;
  }

  getRoleLabel(role: StemRole): string {
    switch (role) {
      case 'FOCAL':
        return 'FLOR FOCAL';
      case 'SECONDARY':
        return 'SECUNDARIA';
      case 'FOLIAGE':
        return 'FOLLAJE';
    }
  }

  getFrequencyLabel(freq: SubscriptionFrequency): string {
    switch (freq) {
      case 'WEEKLY':
        return 'Semanal';
      case 'BIWEEKLY':
        return 'Quincenal';
      case 'MONTHLY':
        return 'Mensual';
    }
  }

  getSizeLabel(sizeId: BouquetSizeId): string {
    return this.catalog.sizes.find(s => s.id === sizeId)?.name ?? sizeId;
  }

  getStatusLabel(status: 'ACTIVE' | 'PAUSED' | 'SKIPPED_NEXT'): string {
    switch (status) {
      case 'ACTIVE':
        return 'ACTIVA';
      case 'PAUSED':
        return 'PAUSADA';
      case 'SKIPPED_NEXT':
        return 'ENTREGA SALTADA';
    }
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3200);
  }
}
