import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { SeoService } from '../../seo.service';
import { PRODUCTS } from '../../data/products';
import { LineId, LINES } from '../../data/lines';
import { ProductCard } from '../../components/product-card/product-card';

type SortMode = 'shu-asc' | 'shu-desc' | 'nome';

/**
 * Il catalogo. Il filtro per linea è uno stato locale (signal), non
 * manipolazione del DOM — la stessa logica della galleria di TREDICI —
 * ma parte anche da un query param `linea` per i link diretti dal footer
 * e dalla home, grazie a withComponentInputBinding.
 */
@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  templateUrl: './shop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  readonly linea = input<string>('');

  readonly lines = LINES;
  readonly total = PRODUCTS.length;
  readonly active = signal<LineId | 'tutte'>('tutte');
  readonly sort = signal<SortMode>('nome');

  readonly filtered = computed(() => {
    const line = this.active();
    const base = line === 'tutte' ? PRODUCTS : PRODUCTS.filter((p) => p.line === line);
    const sorted = [...base];
    switch (this.sort()) {
      case 'shu-asc':
        sorted.sort((a, b) => a.shu - b.shu);
        break;
      case 'shu-desc':
        sorted.sort((a, b) => b.shu - a.shu);
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  });

  constructor() {
    effect(() => {
      const initial = this.linea();
      if (initial && LINES.some((l) => l.id === initial)) {
        this.active.set(initial as LineId);
      }
    });

    inject(SeoService).apply({
      path: '/negozio',
      title: 'Negozio — Tutte le Salse | Piccantomane',
      description:
        'Il catalogo completo: quattro linee di produzione, dalla Diamante \'68 alla Riserva Extrema. Classe di rischio e gradi Scoville per ogni etichetta.',
    });
  }
}
