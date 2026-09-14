export const BRAND = {
  legalName: 'Piccantomane S.r.l. Agricola',
  name: 'Piccantomane',
  street: 'Via Poseidone, 44',
  postalCode: '87023',
  city: 'Diamante',
  province: 'CS',
  region: 'Calabria',
  country: 'Italia',
  phone: '+39 0985 000 000',
  email: 'ordini@piccantomane.it',
  vat: 'IT 00000000000',
  founded: '1968',
  // Deve combaciare con il dominio reale del deploy: da qui passano
  // canonical, og:url, sitemap e robots.txt. Il progetto Vercel è
  // "piccantemane" (con la e), non "piccantomane" come il marchio.
  siteUrl: 'https://piccantemane.vercel.app',
};

export const SHIPPING = {
  standardCost: 5.9,
  freeAbove: 45,
  days: '3 — 5 giorni lavorativi',
  extremeNote:
    'I formati della Linea Reaper viaggiano in una scatola separata dal resto dell’ordine, sigillata a parte.',
};

export interface Founder {
  name: string;
  role: string;
  note: string;
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Vincenzo Le Rose',
    role: 'Fondatore, 1968',
    note: 'Cominciò vendendo la Diamante ’68 porta a porta durante il Festival del Peperoncino.',
  },
  {
    name: 'Assunta Le Rose',
    role: 'Ricette, dal 1968',
    note: 'La ricetta della ’68 è ancora la sua, scritta a mano su un quaderno che teniamo in cassaforte, non per scenografia.',
  },
  {
    name: 'Pietro Le Rose',
    role: 'Linea Reaper, dal 2019',
    note: 'Ha convinto i genitori a piantare Carolina Reaper "solo per vedere cosa succede". È successo che vendiamo ancora tutto in tre settimane.',
  },
];
