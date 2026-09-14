import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HAZARD_LABEL, Product } from '../../data/products';
import { lineById } from '../../data/lines';

/**
 * La bottiglia non è una fotografia — è un'etichetta disegnata. Ogni salsa
 * diventa una sagoma colorata col colore reale del prodotto e una fascia
 * centrale in stile placard di sicurezza, con la classe di rischio al posto
 * del nome scritto a mano. Zero immagini esterne: solo forma e colore,
 * come le mappe e i diagrammi degli altri progetti dimostrativi.
 */
@Component({
  selector: 'app-bottle-placard',
  templateUrl: './bottle-placard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottlePlacard {
  readonly product = input.required<Product>();

  readonly roman = computed(() => HAZARD_LABEL[this.product().hazardClass]);
  readonly patternId = computed(() => `stripes-${this.product().slug}`);
  readonly lineAbbr = computed(() => lineById(this.product().line).name.replace('Linea ', '').toUpperCase());
}
