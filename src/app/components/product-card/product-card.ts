import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HAZARD_LABEL, Product } from '../../data/products';
import { BottlePlacard } from '../bottle-placard/bottle-placard';
import { Tilt } from '../../directives/tilt';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, DecimalPipe, BottlePlacard, Tilt],
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();

  readonly roman = computed(() => HAZARD_LABEL[this.product().hazardClass]);
  readonly fromPrice = computed(() => Math.min(...this.product().formats.map((f) => f.price)));
}
