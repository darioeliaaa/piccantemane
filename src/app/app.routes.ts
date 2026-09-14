import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'negozio', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  {
    path: 'prodotto/:slug',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage),
  },
  { path: 'carrello', loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout) },
  { path: 'il-marchio', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'spedizioni', loadComponent: () => import('./pages/shipping/shipping').then((m) => m.Shipping) },
  { path: 'contatti', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  {
    path: 'registro-ordini',
    loadComponent: () => import('./pages/orders/orders').then((m) => m.Orders),
  },
  { path: '**', redirectTo: '' },
];
