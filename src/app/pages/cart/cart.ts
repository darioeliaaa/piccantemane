import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { CartService } from '../../cart/cart.service';
import { SHIPPING } from '../../data/brand';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  readonly cart = inject(CartService);
  readonly shipping = SHIPPING;

  readonly shippingCost = computed(() =>
    this.cart.subtotal() >= SHIPPING.freeAbove || this.cart.subtotal() === 0 ? 0 : SHIPPING.standardCost,
  );

  readonly total = computed(() => this.cart.subtotal() + this.shippingCost());

  readonly missingForFree = computed(() => Math.max(0, SHIPPING.freeAbove - this.cart.subtotal()));

  constructor() {
    inject(SeoService).apply({
      path: '/carrello',
      title: 'Carrello | Piccantomane',
      description: 'Il tuo carrello Piccantomane.',
    });
  }
}
