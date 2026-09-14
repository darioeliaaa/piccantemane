import { ChangeDetectionStrategy, Component, DOCUMENT, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader implements OnDestroy {
  readonly cart = inject(CartService);
  readonly menuOpen = signal(false);

  private readonly doc = inject(DOCUMENT);

  toggleMenu(open: boolean): void {
    this.menuOpen.set(open);
    this.doc.body.style.overflow = open ? 'hidden' : '';
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
  }
}
