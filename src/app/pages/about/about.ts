import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { FOUNDERS } from '../../data/brand';
import { LINES } from '../../data/lines';
import { Reveal } from '../../directives/reveal';

interface Principle {
  num: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink, Reveal],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly founders = FOUNDERS;
  readonly lines = LINES;

  readonly principles: Principle[] = [
    {
      num: '01',
      title: 'Un solo fornitore',
      text: 'Tutto il peperoncino di Diamante viene dallo stesso appezzamento di famiglia, quello di Vincenzo. Non scaliamo il fornitore, scaliamo la pazienza.',
    },
    {
      num: '02',
      title: 'Lotti piccoli, non industriali',
      text: 'La Riserva Extrema esce in meno di 200 bottiglie a lotto perché il Carolina Reaper che coltiviamo non basta per di più — e va bene così.',
    },
    {
      num: '03',
      title: "L'etichetta dice la verità",
      text: 'Classe di rischio e SHU non sono trovate di marketing: sono misurati, e se una salsa non regge il confronto con la vicina, lo scriviamo lo stesso.',
    },
  ];

  constructor() {
    inject(SeoService).apply({
      path: '/il-marchio',
      title: 'Il Marchio — Piccantomane, dal 1968 | Diamante, Calabria',
      description:
        'La storia di Piccantomane: da un quaderno di ricette del 1968 alle quattro linee di produzione di oggi, tra Diamante e il Festival del Peperoncino.',
    });
  }
}
