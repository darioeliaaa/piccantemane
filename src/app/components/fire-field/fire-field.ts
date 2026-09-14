import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, viewChild } from '@angular/core';
import * as THREE from 'three';

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// fbm su rumore a valore: niente libreria, un hash trigonometrico e cinque
// ottave bastano per un fuoco credibile senza pesare sulla GPU.
const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uResolution.x / uResolution.y;

    vec2 p = uv * 2.2;
    p.y -= uTime * 0.55;
    float n = fbm(p + fbm(p + uTime * 0.12));

    // Piena intensità per gran parte dell'altezza, si spegne solo vicino al
    // bordo alto — prima la sfumatura correva sull'intera altezza e le
    // fiamme restavano quasi invisibili sotto al titolo.
    float rise = 1.0 - smoothstep(0.5, 1.0, vUv.y);
    float intensity = smoothstep(0.08, 0.75, n) * rise;

    vec3 col = mix(vec3(0.02, 0.01, 0.0), vec3(1.0, 0.32, 0.02), intensity);
    col = mix(col, vec3(1.0, 0.8, 0.35), pow(intensity, 3.0) * 0.8);

    float alpha = clamp(intensity * 1.3, 0.0, 0.92);
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Lo sfondo dell'hero: una lastra di fuoco procedurale (fbm su rumore a
 * valore), non un video in loop scaricato da uno stock — a schermo intero
 * dietro il titolo, alpha basso ai bordi così si fonde nel nero della
 * pagina invece di sembrare un rettangolo incollato sopra.
 */
@Component({
  selector: 'app-fire-field',
  template: '<div #host class="hero-stage" aria-hidden="true"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FireField implements OnDestroy {
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');

  private renderer?: THREE.WebGLRenderer;
  private material?: THREE.ShaderMaterial;
  private geometry?: THREE.BufferGeometry;
  private resizeObserver?: ResizeObserver;
  private rafId = 0;
  private readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const el = this.host().nativeElement;
    const { clientWidth: w, clientHeight: h } = el;
    if (w === 0 || h === 0) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(w, h) },
      },
    });
    scene.add(new THREE.Mesh(this.geometry, this.material));

    const clock = new THREE.Clock();
    const render = () => {
      if (!this.reducedMotion) {
        this.material!.uniforms['uTime'].value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
      this.rafId = requestAnimationFrame(render);
    };
    render();

    this.resizeObserver = new ResizeObserver(() => {
      const { clientWidth: nw, clientHeight: nh } = el;
      if (nw === 0 || nh === 0) return;
      renderer.setSize(nw, nh);
      this.material!.uniforms['uResolution'].value.set(nw, nh);
    });
    this.resizeObserver.observe(el);
  }

  ngOnDestroy(): void {
    // afterNextRender non gira mai in SSR/prerendering: senza questa guardia
    // ngOnDestroy chiamerebbe cancelAnimationFrame su un ambiente Node dove
    // non esiste, facendo fallire la distruzione del componente in build.
    if (!this.renderer) return;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.material?.dispose();
    this.geometry?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
