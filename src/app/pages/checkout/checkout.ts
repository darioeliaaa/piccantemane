import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../seo.service';
import { CartService, CartLine } from '../../cart/cart.service';
import { SHIPPING } from '../../data/brand';

interface ConfirmedOrder {
  id: string;
  eta: string;
  lines: CartLine[];
  total: number;
}

/**
 * Il checkout, presentato come una dichiarazione di spedizione. Non c'è un
 * vero Stripe dietro: è un progetto dimostrativo, e il modulo di pagamento
 * lo dice chiaramente. Quello che è reale è la logica — validazione,
 * generazione dell'ordine, svuotamento del carrello — pronta per essere
 * agganciata a un gateway vero il giorno in cui servirà davvero.
 */
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  readonly cart = inject(CartService);
  private readonly fb = inject(FormBuilder);

  readonly confirmedOrder = signal<ConfirmedOrder | null>(null);

  readonly shippingCost = computed(() =>
    this.cart.subtotal() >= SHIPPING.freeAbove || this.cart.subtotal() === 0 ? 0 : SHIPPING.standardCost,
  );
  readonly total = computed(() => this.cart.subtotal() + this.shippingCost());

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    indirizzo: ['', Validators.required],
    citta: ['', Validators.required],
    cap: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    provincia: ['', [Validators.required, Validators.maxLength(2)]],
    note: [''],
    cardNumber: ['', [Validators.required, Validators.pattern(/^[\d\s]{12,19}$/)]],
    cardExpiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cardCvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    consent: [false, Validators.requiredTrue],
  });

  submit(): void {
    if (this.form.invalid || this.cart.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const lines = this.cart.items();
    const total = this.total();
    const id = 'PM-' + Math.floor(10000 + Math.random() * 89999);
    const eta = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
    });

    this.confirmedOrder.set({ id, eta, lines, total });
    this.cart.clear();
    this.form.reset({ provincia: '' });
  }

  constructor() {
    inject(SeoService).apply({
      path: '/checkout',
      title: 'Checkout | Piccantomane',
      description: 'Completa il tuo ordine Piccantomane — progetto dimostrativo, nessun pagamento reale.',
    });
  }
}
