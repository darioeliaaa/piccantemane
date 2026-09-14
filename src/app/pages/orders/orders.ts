import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { SeoService } from '../../seo.service';
import { ORDERS, OrderStatus, STATUS_LABEL } from '../../data/orders';

/**
 * Il pannello che vede il negoziante, non il cliente: lo stato di ogni
 * ordine, il tracking, il totale. È la voce "Pannello gestione ordini"
 * del listino E-Commerce Base — qui su dati d'esempio, in una consegna
 * vera collegato agli ordini reali del checkout.
 */
@Component({
  selector: 'app-orders',
  imports: [DecimalPipe],
  templateUrl: './orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders {
  readonly orders = ORDERS;
  readonly statusLabel = STATUS_LABEL;
  readonly filter = signal<OrderStatus | 'tutti'>('tutti');

  readonly filtered = computed(() =>
    this.filter() === 'tutti' ? this.orders : this.orders.filter((o) => o.status === this.filter()),
  );

  readonly counts = computed(() => {
    const map: Record<string, number> = { tutti: this.orders.length };
    for (const status of Object.keys(STATUS_LABEL) as OrderStatus[]) {
      map[status] = this.orders.filter((o) => o.status === status).length;
    }
    return map;
  });

  statusClass(status: OrderStatus): string {
    return `status-pill status-pill--${status === 'lavorazione' ? 'lavorazione' : status}`;
  }

  constructor() {
    inject(SeoService).apply({
      path: '/registro-ordini',
      title: 'Registro Ordini — Pannello Negoziante | Piccantomane',
      description: 'Il pannello di gestione ordini: stato, tracking e storico delle spedizioni Piccantomane.',
    });
  }
}
