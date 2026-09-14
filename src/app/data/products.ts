import { LineId } from './lines';

export interface DiamondProfile {
  /** Ognuno 0–4. Non è piccantezza (quella ha già la sua scala SHU) — è il gusto. */
  piccantezza: number;
  aroma: number;
  acidita: number;
  persistenza: number;
}

export interface Format {
  size: string;
  ml: number;
  price: number;
}

export interface Product {
  slug: string;
  line: LineId;
  name: string;
  tagline: string;
  /** Scoville Heat Units — reali per ordine di grandezza, non a caso. */
  shu: number;
  /** Classe di rischio I–V, calcolata dallo SHU ma memorizzata per chiarezza. */
  hazardClass: 1 | 2 | 3 | 4 | 5;
  peppers: string;
  description: string;
  ingredients: string[];
  pairings: string[];
  warning: string;
  lot: string;
  profile: DiamondProfile;
  color: string;
  /** Versione luminosa del colore: l'alone dietro la bottiglia. */
  glow: string;
  formats: Format[];
}

export const PRODUCTS: Product[] = [
  // ── Linea Calabrese ──────────────────────────────────────────────
  {
    slug: 'diamante-68',
    line: 'calabrese',
    name: 'Diamante ’68',
    tagline: 'Il punto di partenza, non il traguardo.',
    shu: 12000,
    hazardClass: 1,
    peppers: 'Peperoncino di Diamante',
    description:
      'La prima salsa che abbiamo imbottigliato, nel 1968 secondo la ricetta di famiglia, e quella che non abbiamo mai voluto cambiare. Piccantezza onesta, senza rincorrere il numero più alto.',
    ingredients: ['Peperoncino di Diamante', 'Aceto di vino bianco', 'Sale marino', 'Aglio'],
    pairings: ['Uova al tegamino', 'Pizza margherita', 'Formaggio fresco'],
    warning: 'Uso quotidiano consentito senza restrizioni particolari.',
    lot: 'LOT-CAL-01',
    profile: { piccantezza: 2, aroma: 2, acidita: 3, persistenza: 1 },
    color: '#c1481c',
    glow: '#ff6a2a',
    formats: [
      { size: '100 ml', ml: 100, price: 7.5 },
      { size: '250 ml', ml: 250, price: 14 },
    ],
  },
  {
    slug: 'doppio-taglio',
    line: 'calabrese',
    name: 'Doppio Taglio',
    tagline: 'Due volte il peperoncino, la metà delle scuse.',
    shu: 32000,
    hazardClass: 2,
    peppers: 'Peperoncino di Diamante, Cayenna',
    description:
      'La stessa base della ’68, con la quantità di peperoncino raddoppiata e la cayenna a spingere in coda. Non è una salsa "extra" — è quella che chiediamo quando la ’68 non basta più.',
    ingredients: ['Peperoncino di Diamante', 'Cayenna', 'Aceto di vino bianco', 'Sale marino'],
    pairings: ['Salsiccia alla griglia', 'Taralli', 'Uova strapazzate'],
    warning: 'Assaggiare con un cucchiaino prima di condire l’intero piatto.',
    lot: 'LOT-CAL-02',
    profile: { piccantezza: 3, aroma: 2, acidita: 3, persistenza: 2 },
    color: '#a83816',
    glow: '#ff5a20',
    formats: [
      { size: '100 ml', ml: 100, price: 8 },
      { size: '250 ml', ml: 250, price: 15 },
    ],
  },
  {
    slug: 'contrabbando',
    line: 'calabrese',
    name: 'Contrabbando',
    tagline: 'Non dichiarato in dogana per un motivo.',
    shu: 58000,
    hazardClass: 3,
    peppers: 'Peperoncino di Diamante, Habanero',
    description:
      'Il punto in cui la linea Calabrese smette di essere un condimento e comincia a essere un rischio calcolato. Nasce da un lotto sperimentale che non dovevamo vendere, e che i clienti hanno preteso indietro.',
    ingredients: ['Peperoncino di Diamante', 'Habanero', 'Aceto di vino rosso', 'Sale marino', 'Aglio nero'],
    pairings: ['Ndujia su crostino', 'Zuppa di legumi', 'Carne alla brace'],
    warning: 'Non usare a mani nude senza lavarle subito dopo. Non avvicinare agli occhi.',
    lot: 'LOT-CAL-03',
    profile: { piccantezza: 4, aroma: 3, acidita: 3, persistenza: 3 },
    color: '#7a2410',
    glow: '#ff4a18',
    formats: [
      { size: '100 ml', ml: 100, price: 9.5 },
      { size: '250 ml', ml: 250, price: 17.5 },
    ],
  },

  // ── Linea Affumicata ─────────────────────────────────────────────
  {
    slug: 'fumo-di-ulivo',
    line: 'affumicata',
    name: 'Fumo di Ulivo',
    tagline: 'Affumicata sedici ore sopra legna d’ulivo potato a mano.',
    shu: 9000,
    hazardClass: 1,
    peppers: 'Peperoncino di Diamante affumicato',
    description:
      'La legna viene dalla potatura dei nostri ulivi, a gennaio. Il peperoncino resta appeso sopra la brace per sedici ore, non di più: oltre, il fumo copre il frutto invece di accompagnarlo.',
    ingredients: ['Peperoncino affumicato', 'Aceto di mele', 'Sale marino', 'Zucchero di canna'],
    pairings: ['Formaggio stagionato', 'Carne alla brace', 'Patate al forno'],
    warning: 'Uso quotidiano consentito senza restrizioni particolari.',
    lot: 'LOT-AFF-01',
    profile: { piccantezza: 1, aroma: 4, acidita: 2, persistenza: 2 },
    color: '#8a5a2b',
    glow: '#d99248',
    formats: [
      { size: '100 ml', ml: 100, price: 8.5 },
      { size: '250 ml', ml: 250, price: 16 },
    ],
  },
  {
    slug: 'brace-lenta',
    line: 'affumicata',
    name: 'Brace Lenta',
    tagline: 'Più tempo sul fuoco, più tempo in bocca.',
    shu: 24000,
    hazardClass: 2,
    peppers: 'Peperoncino di Diamante affumicato, Jalapeño affumicato',
    description:
      'Ventiquattro ore di affumicatura invece di sedici, e una parte di jalapeño che porta una nota più verde sotto il fumo. È quella che consigliamo a chi dice di non amare il piccante ma ama il barbecue.',
    ingredients: ['Peperoncino affumicato', 'Jalapeño affumicato', 'Aceto di mele', 'Melassa'],
    pairings: ['Costine', 'Hamburger', 'Fagioli stufati'],
    warning: 'Assaggiare con un cucchiaino prima di condire l’intero piatto.',
    lot: 'LOT-AFF-02',
    profile: { piccantezza: 2, aroma: 4, acidita: 2, persistenza: 3 },
    color: '#734a24',
    glow: '#c47f38',
    formats: [
      { size: '100 ml', ml: 100, price: 9 },
      { size: '250 ml', ml: 250, price: 16.5 },
    ],
  },
  {
    slug: 'cenere-nera',
    line: 'affumicata',
    name: 'Cenere Nera',
    tagline: 'Quando il fumo smette di essere un aroma.',
    shu: 61000,
    hazardClass: 3,
    peppers: 'Peperoncino di Diamante affumicato, Habanero affumicato',
    description:
      'Habanero affumicato insieme al Diamante, ridotto fino a diventare quasi nero. Il fumo qui non accompagna il piccante: lo porta avanti lui.',
    ingredients: ['Peperoncino affumicato', 'Habanero affumicato', 'Aceto di mele', 'Sale affumicato'],
    pairings: ['Carne rossa alla brace', 'Formaggi erborinati', 'Chili con carne'],
    warning: 'Non usare a mani nude senza lavarle subito dopo. Non avvicinare agli occhi.',
    lot: 'LOT-AFF-03',
    profile: { piccantezza: 3, aroma: 4, acidita: 2, persistenza: 4 },
    color: '#4a2e17',
    glow: '#a06a30',
    formats: [
      { size: '100 ml', ml: 100, price: 10.5 },
      { size: '250 ml', ml: 250, price: 19 },
    ],
  },

  // ── Linea Fermentata ─────────────────────────────────────────────
  {
    slug: 'acido-ventisette',
    line: 'fermentata',
    name: 'Acido Ventisette',
    tagline: 'Ventisette giorni in salamoia, zero aceto in etichetta.',
    shu: 15000,
    hazardClass: 1,
    peppers: 'Peperoncino di Diamante fermentato',
    description:
      'Ventisette giorni è il tempo minimo perché la fermentazione dia un’acidità pulita invece che spenta. Meno di così, e si sente ancora il sale crudo.',
    ingredients: ['Peperoncino fermentato 27 giorni', 'Sale marino', 'Aglio'],
    pairings: ['Tacos', 'Riso in bianco', 'Pesce al vapore'],
    warning: 'Uso quotidiano consentito senza restrizioni particolari.',
    lot: 'LOT-FER-01',
    profile: { piccantezza: 2, aroma: 2, acidita: 4, persistenza: 1 },
    color: '#9a9433',
    glow: '#e3da4e',
    formats: [
      { size: '100 ml', ml: 100, price: 8.5 },
      { size: '250 ml', ml: 250, price: 16 },
    ],
  },
  {
    slug: 'lacrima-gialla',
    line: 'fermentata',
    name: 'Lacrima Gialla',
    tagline: 'Il colore non promette dolcezza.',
    shu: 41000,
    hazardClass: 2,
    peppers: 'Peperoncino giallo fermentato, Habanero giallo',
    description:
      'Fermentata quaranta giorni con peperoncini gialli, che ingannano tutti: il colore fa pensare a qualcosa di delicato, e invece l’habanero giallo dietro non transige.',
    ingredients: ['Peperoncino giallo fermentato', 'Habanero giallo', 'Sale marino', 'Senape in grani'],
    pairings: ['Pollo alla griglia', 'Avocado toast', 'Ceviche'],
    warning: 'Assaggiare con un cucchiaino prima di condire l’intero piatto.',
    lot: 'LOT-FER-02',
    profile: { piccantezza: 3, aroma: 2, acidita: 4, persistenza: 2 },
    color: '#b5a642',
    glow: '#f5df55',
    formats: [
      { size: '100 ml', ml: 100, price: 9 },
      { size: '250 ml', ml: 250, price: 16.5 },
    ],
  },
  {
    slug: 'sciabordata',
    line: 'fermentata',
    name: 'Sciabordata',
    tagline: 'Si chiama così perché la bottiglia va scossa, non capovolta.',
    shu: 89000,
    hazardClass: 3,
    peppers: 'Peperoncino di Diamante fermentato, Scotch Bonnet',
    description:
      'Quarantacinque giorni di fermentazione con Scotch Bonnet, poco filtrata apposta: si separa in bottiglia, e va scossa bene prima di ogni uso. È il modo in cui sappiamo che non abbiamo aggiunto addensanti.',
    ingredients: ['Peperoncino fermentato 45 giorni', 'Scotch Bonnet', 'Sale marino', 'Mango'],
    pairings: ['Pollo jerk', 'Frutti di mare crudi', 'Insalata di cavolo'],
    warning: 'Non usare a mani nude senza lavarle subito dopo. Non avvicinare agli occhi.',
    lot: 'LOT-FER-03',
    profile: { piccantezza: 4, aroma: 3, acidita: 4, persistenza: 3 },
    color: '#8a7a1e',
    glow: '#d6c02f',
    formats: [
      { size: '100 ml', ml: 100, price: 10.5 },
      { size: '250 ml', ml: 250, price: 19.5 },
    ],
  },

  // ── Linea Reaper ─────────────────────────────────────────────────
  {
    slug: 'ultimo-avviso',
    line: 'reaper',
    name: 'Ultimo Avviso',
    tagline: 'L’ultima etichetta che leggerai prima di scegliere comunque di provarla.',
    shu: 320000,
    hazardClass: 4,
    peppers: 'Ghost Pepper',
    description:
      'La porta d’ingresso alla linea Reaper, ed è comunque otto volte più piccante del punto più alto della linea Calabrese. La chiamiamo "porta d’ingresso" per abitudine, non perché sia facile.',
    ingredients: ['Ghost Pepper', 'Aceto distillato', 'Sale marino', 'Succo di lime'],
    pairings: ['Una goccia su una pizza intera', 'Chili', 'Wings'],
    warning: 'Tenere lontano da bambini, occhi e portate delicate. Non ingerire a cucchiaiate.',
    lot: 'LOT-RPR-01',
    profile: { piccantezza: 4, aroma: 3, acidita: 3, persistenza: 4 },
    color: '#5a1210',
    glow: '#e0342a',
    formats: [
      { size: '50 ml', ml: 50, price: 11 },
      { size: '100 ml', ml: 100, price: 19 },
    ],
  },
  {
    slug: 'punto-di-non-ritorno',
    line: 'reaper',
    name: 'Punto di Non Ritorno',
    tagline: 'Nessuno ne ha mai riordinato una bottiglia da 250 ml.',
    shu: 890000,
    hazardClass: 4,
    peppers: 'Carolina Reaper, Ghost Pepper',
    description:
      'Carolina Reaper e Ghost Pepper insieme, ridotti lentamente per non perdere la parte fruttata che il Reaper ha davvero, sepolta sotto tutto il resto. La sentirai per forse due secondi.',
    ingredients: ['Carolina Reaper', 'Ghost Pepper', 'Aceto distillato', 'Ananas'],
    pairings: ['Una goccia, non di più', 'Marinate estreme', 'Sfide tra amici'],
    warning: 'Tenere lontano da bambini, occhi e portate delicate. Non ingerire a cucchiaiate.',
    lot: 'LOT-RPR-02',
    profile: { piccantezza: 4, aroma: 3, acidita: 2, persistenza: 4 },
    color: '#420c0a',
    glow: '#d02a22',
    formats: [
      { size: '50 ml', ml: 50, price: 13 },
      { size: '100 ml', ml: 100, price: 22 },
    ],
  },
  {
    slug: 'riserva-extrema',
    line: 'reaper',
    name: 'Riserva Extrema — Lotto Unico',
    tagline: 'Non è più una salsa. È una dichiarazione.',
    shu: 1650000,
    hazardClass: 5,
    peppers: 'Carolina Reaper puro, essiccato e macinato in azienda',
    description:
      'Un solo lotto, meno di 200 bottiglie, Carolina Reaper puro senza nient’altro a diluirlo se non l’aceto necessario a renderlo liquido. Non la consigliamo. La vendiamo comunque, con un modulo di consenso in etichetta.',
    ingredients: ['Carolina Reaper', 'Aceto distillato', 'Sale marino'],
    pairings: ['Nessuno, onestamente', 'Una goccia su un cucchiaio d’olio', 'Solo per chi ha già finito tutto il resto'],
    warning: 'Richiede consenso informato. Non adatta a un uso alimentare regolare. Un adulto alla volta.',
    lot: 'LOT-RPR-X1',
    profile: { piccantezza: 4, aroma: 2, acidita: 2, persistenza: 4 },
    color: '#1a0605',
    glow: '#c42219',
    formats: [{ size: '50 ml', ml: 50, price: 18 }],
  },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByLine(line: LineId): Product[] {
  return PRODUCTS.filter((p) => p.line === line);
}

/** I–V a partire dalla classe salvata, per non ricalcolarla ovunque. */
export const HAZARD_LABEL: Record<Product['hazardClass'], string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
};
