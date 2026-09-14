import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  input,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { HAZARD_LABEL, Product } from '../../data/products';
import { lineById } from '../../data/lines';

/** Profilo della bottiglia: (raggio, altezza), dal fondo al collo. */
const BOTTLE_PROFILE: [number, number][] = [
  [0.001, 0],
  [0.78, 0.05],
  [0.8, 0.3],
  [0.8, 3.4],
  [0.76, 4.0],
  [0.6, 4.6],
  [0.34, 5.15],
  [0.28, 5.2],
  [0.28, 6.15],
  [0.32, 6.2],
];

const CAP_Y = 6.5;

/**
 * La bottiglia interattiva: geometria Lathe procedurale (nessun modello
 * scaricato), materiale in vetro colorato con transmission reale, e
 * un'etichetta avvolta come texture disegnata su canvas — stessa idea
 * grafica del bottle-placard piatto, ma sul serio in 3D. Si trascina per
 * ruotarla; da ferma gira da sola, piano.
 */
@Component({
  selector: 'app-bottle-viewer',
  template: `
    <div class="bottle-viewer" [style.--glow]="product().glow">
      <div #host style="position: absolute; inset: 0"></div>
      <span class="bottle-viewer__hint">Trascina per ruotare ↻</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottleViewer implements OnDestroy {
  readonly product = input.required<Product>();

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');

  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.PerspectiveCamera;
  private group?: THREE.Group;
  private pmrem?: THREE.PMREMGenerator;
  private resizeObserver?: ResizeObserver;
  private rafId = 0;
  private ready = false;

  private isDragging = false;
  private lastX = 0;
  private velocity = 0;
  private readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly disposables: { dispose(): void }[] = [];
  private labelTexture?: THREE.CanvasTexture;
  private labelMaterial?: THREE.MeshBasicMaterial;

  constructor() {
    afterNextRender(() => {
      this.init();
      this.ready = true;

      // I font arrivano dopo: l'etichetta si ridisegna quando Anton è
      // pronto, invece di bloccare la costruzione dell'intera scena. Così la
      // bottiglia c'è dal primo frame e il testo si completa un attimo dopo,
      // anziché lasciare un buco nero finché la rete non ha finito.
      document.fonts?.ready
        .then(() => this.refreshLabel())
        .catch(() => undefined);
    });

    // Se il prodotto cambia (schede correlate viste in sequenza), la
    // bottiglia già montata si ricolora invece di essere ricostruita.
    effect(() => {
      const product = this.product();
      if (!this.ready || !this.group) return;
      this.applyProduct(product);
    });
  }

  /**
   * Ridisegna la texture dell'etichetta con i font ormai caricati. Serve
   * perché il testo su canvas non aspetta i @font-face: se Anton non è
   * ancora arrivato, fillText lo sostituisce e il numero romano esce
   * invisibile per quel frame.
   */
  private refreshLabel(): void {
    const material = this.labelMaterial;
    if (!material) return;

    this.labelTexture?.dispose();
    this.labelTexture = new THREE.CanvasTexture(this.drawLabel(this.product()));
    this.labelTexture.colorSpace = THREE.SRGBColorSpace;
    material.map = this.labelTexture;
    material.needsUpdate = true;
  }

  private init(): void {
    const el = this.host().nativeElement;
    const { clientWidth: w, clientHeight: h } = el;
    if (w === 0 || h === 0) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();

    this.pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // La bottiglia è alta 6,8 unità: con fov 30° servono ~14,5 unità di
    // distanza perché ci stia tutta in altezza (2·d·tan(fov/2) ≥ altezza).
    // A 8,4 com'era prima ne entravano meno di 5 e il fondo restava tagliato.
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 3.4, 14.5);
    camera.lookAt(0, 3.4, 0);
    this.camera = camera;

    const key = new THREE.DirectionalLight(0xfff2df, 1.5);
    key.position.set(2.6, 4.2, 3.2);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffb703, 1.2);
    rim.position.set(-3, 2.4, -2.2);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0x3a2717, 0.7));

    const group = new THREE.Group();
    scene.add(group);
    this.group = group;
    this.applyProduct(this.product());

    const dom = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      dom.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      const delta = e.clientX - this.lastX;
      this.lastX = e.clientX;
      this.velocity = delta * 0.012;
      group.rotation.y += this.velocity;
    };
    const onPointerUp = () => {
      this.isDragging = false;
    };
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('pointerleave', onPointerUp);
    this.disposables.push({
      dispose: () => {
        dom.removeEventListener('pointerdown', onPointerDown);
        dom.removeEventListener('pointermove', onPointerMove);
        dom.removeEventListener('pointerup', onPointerUp);
        dom.removeEventListener('pointercancel', onPointerUp);
        dom.removeEventListener('pointerleave', onPointerUp);
      },
    });

    const clock = new THREE.Clock();
    const render = () => {
      const dt = clock.getDelta();
      if (!this.isDragging) {
        if (!this.reducedMotion) group.rotation.y += 0.18 * dt;
        this.velocity *= 0.9;
      }
      renderer.render(scene, camera);
      this.rafId = requestAnimationFrame(render);
    };
    render();

    this.resizeObserver = new ResizeObserver(() => {
      const { clientWidth: nw, clientHeight: nh } = el;
      if (nw === 0 || nh === 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    this.resizeObserver.observe(el);
  }

  private applyProduct(product: Product): void {
    const group = this.group;
    if (!group) return;

    group.clear();

    const points = BOTTLE_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
    const bodyGeo = new THREE.LatheGeometry(points, 48);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(product.color),
      transmission: 0.88,
      thickness: 0.6,
      roughness: 0.12,
      ior: 1.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      metalness: 0,
    });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    const capGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.6, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.55, metalness: 0.15 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = CAP_Y;
    group.add(cap);

    this.labelTexture?.dispose();
    this.labelTexture = new THREE.CanvasTexture(this.drawLabel(product));
    this.labelTexture.colorSpace = THREE.SRGBColorSpace;

    const labelGeo = new THREE.CylinderGeometry(0.805, 0.805, 1.9, 64, 1, true);
    // MeshBasicMaterial apposta: senza risposta alla luce, il testo scuro
    // disegnato sul canvas resta leggibile esattamente com'è stato tracciato.
    // Con un materiale PBR l'ambiente e le due luci direzionali creavano un
    // riflesso speculare proprio al centro dell'etichetta — la stessa zona
    // dov'è il numero romano — che lo sbiancava fino a farlo sparire.
    const labelMat = new THREE.MeshBasicMaterial({ map: this.labelTexture });
    this.labelMaterial = labelMat;
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = 2.15;
    // Il centro del canvas (dove sta il numero romano) cade a u=0.5, che
    // sull'avvolgimento di default di CylinderGeometry guarda il retro
    // rispetto alla camera di partenza — senza questo mezzo giro il pezzo
    // importante dell'etichetta non è mai visibile finché non si trascina.
    label.rotation.y = Math.PI;
    group.add(label);

    // Dispose delle geometrie/materiali precedenti, non solo rimozione dalla
    // scena — altrimenti ogni cambio di scheda prodotto perde memoria GPU.
    for (const geo of this.meshResources.geometries) geo.dispose();
    for (const mat of this.meshResources.materials) mat.dispose();
    this.meshResources = {
      geometries: [bodyGeo, capGeo, labelGeo],
      materials: [bodyMat, capMat, labelMat],
    };
  }

  private meshResources: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] } = {
    geometries: [],
    materials: [],
  };

  private drawLabel(product: Product): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 420;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#f3ecd8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const stripe = (y: number, h: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y, canvas.width, h);
      ctx.clip();
      ctx.fillStyle = '#0d0a07';
      ctx.fillRect(0, y, canvas.width, h);
      ctx.fillStyle = '#ffc21e';
      const step = 34;
      for (let x = -canvas.height; x < canvas.width + canvas.height; x += step) {
        ctx.save();
        ctx.translate(x, y + h / 2);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-8, -canvas.height, 16, canvas.height * 2);
        ctx.restore();
      }
      ctx.restore();
    };
    stripe(0, 30);
    stripe(canvas.height - 30, 30);

    ctx.strokeStyle = '#171310';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#171310';

    ctx.font = '600 26px "IBM Plex Mono", monospace';
    ctx.globalAlpha = 0.65;
    ctx.fillText('CLASSE DI RISCHIO', canvas.width / 2, 100);
    ctx.globalAlpha = 1;

    ctx.font = '400 190px Anton, sans-serif';
    ctx.fillText(HAZARD_LABEL[product.hazardClass], canvas.width / 2, 300);

    ctx.strokeStyle = 'rgba(23,19,16,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 170, 330);
    ctx.lineTo(canvas.width / 2 + 170, 330);
    ctx.stroke();

    ctx.font = '600 24px "IBM Plex Mono", monospace';
    ctx.globalAlpha = 0.8;
    const lineName = lineById(product.line).name.replace('Linea ', '').toUpperCase();
    ctx.fillText(lineName, canvas.width / 2, 370);
    ctx.globalAlpha = 1;

    return canvas;
  }

  ngOnDestroy(): void {
    // In SSR/prerendering afterNextRender non esegue mai init(): senza
    // questa guardia, distruggere il componente chiamerebbe
    // cancelAnimationFrame su Node, dove non esiste, e romperebbe la build.
    if (!this.renderer) return;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    for (const d of this.disposables) d.dispose();
    for (const geo of this.meshResources.geometries) geo.dispose();
    for (const mat of this.meshResources.materials) mat.dispose();
    this.labelTexture?.dispose();
    this.pmrem?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
