import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { SHIPPING } from '../../data/brand';

@Component({
  selector: 'app-shipping',
  imports: [RouterLink],
  templateUrl: './shipping.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shipping {
  readonly shipping = SHIPPING;

  constructor() {
    inject(SeoService).apply({
      path: '/spedizioni',
      title: 'Spedizioni e Resi | Piccantomane',
      description: 'Costi di spedizione, tempi di consegna e politica di reso per gli ordini Piccantomane.',
    });
  }
}
