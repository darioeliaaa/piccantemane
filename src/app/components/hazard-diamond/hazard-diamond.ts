import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DiamondProfile } from '../../data/products';

/**
 * Il "diamante di degustazione": stessa geometria del diamante NFPA 704
 * (quello vero, sui bidoni chimici — quattro losanghe colorate attorno a un
 * centro), riletta come scheda di gusto. Non è piccantezza — quella ha già
 * la sua scala Scoville altrove — è il profilo: aroma, acidità, persistenza
 * e sì, anche piccantezza, ma qui letta come componente del gusto e non
 * come rischio. Sostituisce le solite cinque stelline con qualcosa che
 * almeno somiglia a un dato reale.
 */
@Component({
  selector: 'app-hazard-diamond',
  templateUrl: './hazard-diamond.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HazardDiamond {
  readonly profile = input.required<DiamondProfile>();
  readonly size = input<'sm' | 'lg'>('lg');
}
