import { DOCUMENT, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { SiteHeader } from './components/site-header/site-header';
import { SiteFooter } from './components/site-footer/site-footer';
import { BRAND } from './data/brand';

const STORE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BRAND.name,
  legalName: BRAND.legalName,
  url: BRAND.siteUrl,
  telephone: BRAND.phone,
  email: BRAND.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BRAND.street,
    addressLocality: BRAND.city,
    addressRegion: BRAND.province,
    postalCode: BRAND.postalCode,
    addressCountry: 'IT',
  },
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
})
export class App {
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    this.meta.updateTag({ property: 'og:site_name', content: BRAND.name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(STORE_JSON_LD);
    this.doc.head.appendChild(script);
  }
}
