import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { PRODUCTS } from '../../data/products';
import { LINES } from '../../data/lines';
import { ProductCard } from '../../components/product-card/product-card';
import { HazardDiamond } from '../../components/hazard-diamond/hazard-diamond';
import { FireField } from '../../components/fire-field/fire-field';
import { BottleViewer } from '../../components/bottle-viewer/bottle-viewer';
import { Reveal } from '../../directives/reveal';
import { Tilt } from '../../directives/tilt';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, HazardDiamond, FireField, BottleViewer, Reveal, Tilt],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly lines = LINES;
  readonly featured = ['diamante-68', 'ultimo-avviso', 'fumo-di-ulivo', 'sciabordata', 'contrabbando', 'riserva-extrema']
    .map((slug) => PRODUCTS.find((p) => p.slug === slug)!);

  readonly heroProduct = PRODUCTS.find((p) => p.slug === 'riserva-extrema')!;

  readonly sampleProfile = { piccantezza: 4, aroma: 3, acidita: 2, persistenza: 4 };

  constructor() {
    inject(SeoService).apply({
      path: '/',
      title: 'Piccantomane — Salse Piccanti da Diamante, Calabria',
      description:
        'Salse piccanti artigianali dalla Città del Peperoncino: quattro linee di produzione, classe di rischio in etichetta, gradi Scoville reali. Spedizione in tutta Italia.',
    });
  }
}
