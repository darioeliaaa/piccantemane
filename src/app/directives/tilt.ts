import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

const MAX_DEG = 7;

/**
 * Inclinazione 3D al passaggio del mouse — la stessa logica del TiltCard
 * del portfolio di chi ha commissionato questa demo, applicata qui alle
 * card prodotto. `perspective` sta nel CSS del genitore (o qui stesso via
 * transform-style), la rotazione la calcola la posizione del cursore.
 */
@Directive({
  selector: '[appTilt]',
  host: { class: 'tilt' },
})
export class Tilt {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      if (typeof matchMedia !== 'undefined' && matchMedia('(hover: none)').matches) return;

      const node = this.el.nativeElement;
      node.style.transformStyle = 'preserve-3d';

      const onMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        node.style.transform = `perspective(700px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg) translateZ(6px)`;
      };
      const onLeave = () => {
        node.style.transform = '';
      };

      node.addEventListener('pointermove', onMove);
      node.addEventListener('pointerleave', onLeave);
    });
  }
}
