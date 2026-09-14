import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Comparsa allo scroll, SSR-safe: vive solo in afterNextRender. */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement as HTMLElement;

      if (!('IntersectionObserver' in window)) {
        node.classList.add('shown');
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('shown');
              io.unobserve(entry.target);
            }
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
      );

      io.observe(node);
    });
  }
}
