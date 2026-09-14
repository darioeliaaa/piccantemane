import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SeoService } from '../../seo.service';
import { BRAND } from '../../data/brand';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  readonly brand = BRAND;
  readonly phoneHref = `tel:${BRAND.phone.replace(/\s/g, '')}`;
  private readonly fb = inject(FormBuilder);

  readonly sent = signal(false);

  readonly subjects = ['Un ordine', 'Un prodotto', 'Diventare rivenditori', 'Stampa', 'Altro'];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sent.set(true);
  }

  constructor() {
    inject(SeoService).apply({
      path: '/contatti',
      title: 'Contatti | Piccantomane',
      description: 'Scrivici per un ordine, una domanda su un prodotto o per diventare rivenditori.',
    });
  }
}
