import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { HAZARD_LABEL, PRODUCTS, productBySlug } from '../../data/products';
import { lineById } from '../../data/lines';
import { CartService } from '../../cart/cart.service';
import { BottleViewer } from '../../components/bottle-viewer/bottle-viewer';
import { HazardDiamond } from '../../components/hazard-diamond/hazard-diamond';
import { HeatGauge } from '../../components/heat-gauge/heat-gauge';
import { ProductCard } from '../../components/product-card/product-card';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-product',
  imports: [RouterLink, DecimalPipe, BottleViewer, HazardDiamond, HeatGauge, ProductCard, Reveal],
  templateUrl: './product.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--line-color]': 'product()?.color' },
})
export class ProductPage {
  readonly slug = input.required<string>();
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

  readonly product = computed(() => productBySlug(this.slug()));
  readonly roman = computed(() => (this.product() ? HAZARD_LABEL[this.product()!.hazardClass] : ''));
  readonly line = computed(() => (this.product() ? lineById(this.product()!.line) : undefined));

  readonly selectedSize = signal<string>('');
  readonly justAdded = signal(false);

  readonly selectedFormat = computed(() => {
    const product = this.product();
    if (!product) return undefined;
    return product.formats.find((f) => f.size === this.selectedSize()) ?? product.formats[0];
  });

  readonly related = computed(() => {
    const product = this.product();
    if (!product) return [];
    return PRODUCTS.filter((p) => p.line === product.line && p.slug !== product.slug).slice(0, 3);
  });

  selectFormat(size: string): void {
    this.selectedSize.set(size);
  }

  addToCart(): void {
    const product = this.product();
    const format = this.selectedFormat();
    if (!product || !format) return;
    this.cart.add(product, format.size, format.ml, format.price);
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 2200);
  }

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) return;
      this.selectedSize.set(product.formats[0].size);

      this.seo.apply({
        path: `/prodotto/${product.slug}`,
        title: `${product.name} — ${lineById(product.line).name} | Piccantomane`,
        description: `${product.tagline} ${product.shu.toLocaleString('it-IT')} SHU, Classe di rischio ${HAZARD_LABEL[product.hazardClass]}. ${product.peppers}.`,
      });
    });
  }
}
