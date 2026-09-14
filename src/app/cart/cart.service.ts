import { Injectable, afterNextRender, computed, effect, signal } from '@angular/core';

import { Product } from '../data/products';

export interface CartLine {
  slug: string;
  size: string;
  ml: number;
  price: number;
  name: string;
  color: string;
  line: string;
  qty: number;
}

const STORAGE_KEY = 'piccantomane.cart.v1';

/**
 * Il carrello parte sempre vuoto — in SSR perché localStorage non esiste,
 * e nel primo render del browser apposta: se lo leggesse subito nel
 * costruttore, l'HTML idratato non combacerebbe con quello prerenderizzato
 * (il server ha sempre mostrato "carrello vuoto") e Angular lo segnalerebbe
 * come mismatch di idratazione. Il contenuto vero arriva un istante dopo,
 * dentro afterNextRender, quando l'idratazione è già conclusa.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly lines = signal<CartLine[]>([]);
  private hydrated = false;

  readonly items = this.lines.asReadonly();

  readonly count = computed(() => this.lines().reduce((sum, l) => sum + l.qty, 0));

  readonly subtotal = computed(() => this.lines().reduce((sum, l) => sum + l.qty * l.price, 0));

  readonly hasReaper = computed(() => this.lines().some((l) => l.line === 'reaper'));

  constructor() {
    afterNextRender(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) this.lines.set(JSON.parse(raw) as CartLine[]);
      } catch {
        /* storage bloccata: il carrello resta vuoto per questa visita */
      } finally {
        this.hydrated = true;
      }
    });

    effect(() => {
      const snapshot = this.lines();
      if (!this.hydrated || typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        /* storage piena o bloccata: il carrello resta comunque in memoria */
      }
    });
  }

  add(product: Product, size: string, ml: number, price: number): void {
    this.lines.update((lines) => {
      const key = (l: CartLine) => l.slug === product.slug && l.size === size;
      const existing = lines.find(key);
      if (existing) {
        return lines.map((l) => (key(l) ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...lines,
        { slug: product.slug, size, ml, price, name: product.name, color: product.color, line: product.line, qty: 1 },
      ];
    });
  }

  setQty(slug: string, size: string, qty: number): void {
    if (qty <= 0) {
      this.remove(slug, size);
      return;
    }
    this.lines.update((lines) =>
      lines.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
    );
  }

  remove(slug: string, size: string): void {
    this.lines.update((lines) => lines.filter((l) => !(l.slug === slug && l.size === size)));
  }

  clear(): void {
    this.lines.set([]);
  }
}
