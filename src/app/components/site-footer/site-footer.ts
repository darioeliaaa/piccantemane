import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BRAND } from '../../data/brand';
import { LINES } from '../../data/lines';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'site-foot' },
})
export class SiteFooter {
  readonly brand = BRAND;
  readonly lines = LINES;
  readonly year = new Date().getFullYear();
  readonly phoneHref = `tel:${BRAND.phone.replace(/\s/g, '')}`;
}
