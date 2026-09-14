import { RenderMode, ServerRoute } from '@angular/ssr';

import { PRODUCTS } from './data/products';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'prodotto/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PRODUCTS.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
