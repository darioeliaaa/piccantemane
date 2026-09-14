import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const MAX_LOG = Math.log10(2_200_000); // poco sopra il Carolina Reaper puro
const MIN_LOG = Math.log10(1_000); // sotto la Diamante '68

// Centro e raggi scelti perché a radius 172 (dove vivono le etichette) il
// punto più estremo — angolo 0° o 180° — resti dentro il viewBox anche
// contando la metà della larghezza del testo più lungo ("HABANERO").
const CX = 200;
const CY = 195;
const BAND_RADIUS = 125;
const TICK_INNER = 140;
const TICK_OUTER = 156;
const LABEL_RADIUS = 172;
const NEEDLE_RADIUS = 110;

const BANDS = [
  { upTo: 15_000, label: 'Gestibile', cls: 'hg-badge--mild' },
  { upTo: 100_000, label: 'Impegnativa', cls: 'hg-badge--med' },
  { upTo: 500_000, label: 'Estrema', cls: 'hg-badge--hot' },
  { upTo: Infinity, label: 'Fuori scala', cls: 'hg-badge--extreme' },
];

const REFERENCES = [
  { shu: 5_000, label: 'Jalapeño' },
  { shu: 300_000, label: 'Habanero' },
  { shu: 1_600_000, label: 'Reaper' },
];

/**
 * Un manometro industriale al posto del solito termometro col disegnino
 * del peperoncino. La scala è logaritmica perché lo SHU lo è per natura —
 * lineare, la Diamante '68 e la Riserva Extrema finirebbero a un millimetro
 * di distanza sullo stesso ago.
 */
@Component({
  selector: 'app-heat-gauge',
  imports: [DecimalPipe],
  templateUrl: './heat-gauge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatGauge {
  readonly shu = input.required<number>();

  private readonly fraction = computed(() => {
    const log = Math.log10(Math.max(this.shu(), 1000));
    return Math.min(1, Math.max(0, (log - MIN_LOG) / (MAX_LOG - MIN_LOG)));
  });

  /** L'ago copre un semicerchio, da 180° (sinistra) a 0° (destra). */
  readonly needleAngle = computed(() => 180 - this.fraction() * 180);

  readonly needleTip = computed(() => this.pointOnArc(this.needleAngle(), NEEDLE_RADIUS));

  readonly band = computed(() => BANDS.find((b) => this.shu() <= b.upTo)!);

  readonly center = { x: CX, y: CY };

  readonly ticks = REFERENCES.map((ref) => {
    const fraction = this.fractionFor(ref.shu);
    const angle = 180 - fraction * 180;
    return {
      ...ref,
      inner: this.pointOnArc(angle, TICK_INNER),
      outer: this.pointOnArc(angle, TICK_OUTER),
      labelAt: this.pointOnArc(angle, LABEL_RADIUS),
    };
  });

  readonly arcBands = (() => {
    const stops = [MIN_LOG, Math.log10(15_000), Math.log10(100_000), Math.log10(500_000), MAX_LOG];
    const classes = ['hg-arc--mild', 'hg-arc--med', 'hg-arc--hot', 'hg-arc--extreme'];
    const result: { d: string; cls: string }[] = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const f0 = (stops[i] - MIN_LOG) / (MAX_LOG - MIN_LOG);
      const f1 = (stops[i + 1] - MIN_LOG) / (MAX_LOG - MIN_LOG);
      const a0 = 180 - f0 * 180;
      const a1 = 180 - f1 * 180;
      const p0 = this.pointOnArc(a0, BAND_RADIUS);
      const p1 = this.pointOnArc(a1, BAND_RADIUS);
      result.push({ d: `M${p0.x},${p0.y} A${BAND_RADIUS},${BAND_RADIUS} 0 0 1 ${p1.x},${p1.y}`, cls: classes[i] });
    }
    return result;
  })();

  private fractionFor(shu: number): number {
    const log = Math.log10(shu);
    return Math.min(1, Math.max(0, (log - MIN_LOG) / (MAX_LOG - MIN_LOG)));
  }

  private pointOnArc(angleDeg: number, radius: number): { x: number; y: number } {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: +(CX + radius * Math.cos(rad)).toFixed(2),
      y: +(CY - radius * Math.sin(rad)).toFixed(2),
    };
  }
}
