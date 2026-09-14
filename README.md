# ☣️ Piccantomane — Salse Piccanti da Diamante

Demo — fascia **E-Commerce Base (1.000€)** del listino. Angular 22 standalone,
zoneless, SSR con prerendering di **20 pagine statiche**, carrello persistente,
checkout completo con validazione reale e **3D vero via Three.js** — non SVG
spacciati per 3D, una bottiglia in vetro procedurale che si trascina con il
mouse e uno sfondo a fuoco procedurale animato nell'hero.

Un produttore immaginario di salse piccanti artigianali a Diamante (CS) —
la vera "Città del Peperoncino" calabrese. L'idea di partenza era evitare
la solita estetica da e-commerce gourmet — foto di bottiglia in controluce,
sfondo bianco, badge "piccante 🌶️🌶️🌶️" — e trattare ogni salsa come una
sostanza da classificare sul serio: **classe di rischio, gradi Scoville
reali, scheda di sicurezza**. Il linguaggio visivo prende in prestito quello
delle etichette di pericolo chimico (il diamante di classificazione, le
bande nero/giallo, i moduli di spedizione), reso in chiave cinematografica
scura — fondo quasi nero, accenti al neon ambra/rosso — non più la carta
chiara degli altri progetti dimostrativi.

## Cosa dimostra della fascia

| Voce di listino | Dove si vede |
|---|---|
| Catalogo con varianti (formato) | 12 prodotti, 4 linee, formati 50/100/250 ml con prezzi diversi |
| Carrello e pagamenti | `CartService` persistente (signal + localStorage, SSR-safe), checkout con Reactive Forms e modulo di pagamento simulato dichiarato come demo |
| Pannello gestione ordini | `/registro-ordini` — manifesto ordini in stile backoffice, filtrabile per stato, con tracking |
| Indicatore di piccantezza visivo | Non il solito termometro: un **manometro Scoville** su scala logaritmica e un **diamante di degustazione** a quattro assi (piccantezza, aroma, acidità, persistenza) |

## Il 3D, per davvero

- **`BottleViewer`** (pagina prodotto + hero): una bottiglia costruita con
  `THREE.LatheGeometry` da un profilo disegnato a mano (nessun modello
  scaricato), vetro con `MeshPhysicalMaterial` a transmission reale e
  ambiente PBR (`RoomEnvironment` + `PMREMGenerator`) per i riflessi, cappuccio
  e un'etichetta avvolta come texture disegnata a runtime su `<canvas>` —
  la stessa identica composizione grafica del bottle-placard SVG piatto,
  ma vera geometria. Si trascina per ruotarla, gira da sola quando è ferma.
- **`FireField`** (sfondo hero): un piano fullscreen con uno shader GLSL
  fatto in casa — fbm su rumore a valore, cinque ottave — non un video di
  fuoco scaricato da uno stock. Alpha basso ai bordi così si fonde nel nero
  della pagina invece di sembrare un rettangolo incollato sopra.
- **`Tilt`** (card prodotto, tile linee): la stessa logica del `TiltCard`
  del portfolio che ospita questa demo — inclinazione 3D via CSS che segue
  il cursore, senza una riga di WebGL.

Due bug reali emersi verificando questi componenti, entrambi istruttivi:
l'etichetta della bottiglia usciva bianca perché `document.fonts.ready` non
veniva atteso prima di disegnare il testo su canvas (Anton non era ancora
caricato, e il fallback per quel frame era invisibile), e il testo finiva
comunque sul retro della bottiglia per via dell'avvolgimento UV di default
di `CylinderGeometry` — corretto con un mezzo giro (`rotation.y = Math.PI`)
sulla mesh dell'etichetta.

## Il sistema visivo, spiegato

Ogni prodotto è un'etichetta disegnata (SVG, zero foto), colorata col colore
reale della salsa, con una fascia centrale in stile placard di sicurezza al
posto del nome scritto a mano — mostra la **classe di rischio** (I–V,
calcolata dallo SHU). La scheda prodotto aggiunge:

- **Manometro Scoville**: scala logaritmica da 1.000 a 2.200.000 SHU, con
  tacche di riferimento su pepi noti (Jalapeño, Habanero, Reaper) — lineare
  sarebbe inutile, la Diamante '68 e la Riserva Extrema finirebbero a un
  millimetro di distanza sullo stesso ago.
- **Diamante di degustazione**: stessa geometria del diamante NFPA 704 (le
  losanghe sui bidoni chimici), riletta come scheda di gusto — non
  sostituisce lo SHU, è il resto del sapore.

## Stack

- **Angular 22** standalone e **zoneless**, tutto lo stato su signal
- **SSR + prerendering** (`@angular/ssr`), inclusa la pagina prodotto con
  `getPrerenderParams` sui 12 slug
- **CartService**: il carrello parte sempre vuoto in SSR e nel primo render
  del browser di proposito — legge `localStorage` solo dentro
  `afterNextRender`, altrimenti l'idratazione non combacerebbe con l'HTML
  prerenderizzato (il server mostra sempre "carrello vuoto")
- **Reactive Forms** su checkout (con validazione carta/CAP/email) e contatti
- Locale `it` registrata esplicitamente (`registerLocaleData`) — senza,
  ogni `DecimalPipe` con locale `'it'` lancia un RuntimeError silenzioso in
  produzione (NG02100, senza messaggio: ci sono già passato, vedi commit)
- **Three.js** per la bottiglia interattiva e lo sfondo a fuoco procedurale
  (`RoomEnvironment`/`PMREMGenerator` per l'ambiente PBR del vetro) — entrambi
  vivono solo dentro `afterNextRender`, con `ngOnDestroy` protetto da una
  guardia esplicita perché in SSR/prerendering quel codice non gira mai e
  richiamare `cancelAnimationFrame` su Node farebbe fallire la build
- Zero foto prodotto: bottiglie (SVG in lista, 3D vero in scheda), manometro
  e diamante sono tutti generati, mai fotografati

## Struttura

```
src/app/
  register-locale.ts             Side-effect: registra i dati locale 'it'
  app.ts / app.html               Header + <router-outlet/> + Footer, LD+JSON
  seo.service.ts                  Title, description, canonical
  cart/cart.service.ts            Carrello: signal + localStorage, SSR-safe
  directives/tilt.ts               Inclinazione 3D via CSS al passaggio del mouse
  data/                           Prodotti, linee, ordini d'esempio, anagrafica
  components/
    bottle-viewer/                 Bottiglia 3D interattiva (Three.js) — scheda prodotto
    fire-field/                     Sfondo a fuoco procedurale (Three.js) — hero
    bottle-placard/                L'etichetta SVG di ogni prodotto — card e liste
    hazard-diamond/                Il diamante di degustazione
    heat-gauge/                    Il manometro Scoville
    product-card/                  Card riusata in home, negozio, "stessa linea"
    site-header/ site-footer/
  pages/                          home negozio prodotto carrello checkout
                                  il-marchio spedizioni contatti registro-ordini
scripts/build-sitemap.mjs         sitemap.xml e robots.txt dalla build
```

## Sviluppo in locale

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

## Build e deploy

```bash
npm run build
```

Genera `dist/piccantomane/browser/` con 20 pagine già statiche, più
`sitemap.xml` e `robots.txt` generati leggendo le pagine appena
prerenderizzate. Su Vercel: import del repo, preset **Angular**, deploy.

### ⚠️ Il dominio va aggiornato a mano

`src/app/data/brand.ts` → `BRAND.siteUrl` è l'unico posto dove scrivere il
dominio di produzione: da lì passano canonical, og:url, sitemap e robots.txt.
Se non corrisponde al dominio reale del deploy, il sito **sembra**
funzionare ma ogni link condiviso porta su un indirizzo che non esiste —
già capitato una volta su Sìdero, non ripeterlo qui.

## Personalizzare per un cliente reale

| Cosa | Dove |
|---|---|
| Dominio | `data/brand.ts` → `BRAND.siteUrl` |
| Anagrafica, spedizioni | `data/brand.ts` |
| Prodotti, linee, prezzi | `data/products.ts`, `data/lines.ts` |
| Ordini del pannello negoziante | `data/orders.ts` — in una consegna vera arriverebbero dal checkout, non da un array statico |
| Pagamento reale | `pages/checkout/checkout.ts` — il form è già completo e validato, va solo agganciato a Stripe/PayPal in modalità live al posto della simulazione |
| Newsletter/CRM | `pages/checkout` — il modulo B2B-style è pronto per un webhook |

---

*Progetto dimostrativo — azienda, prodotti e ordini sono di fantasia.
Realizzato da Dario Elia.*
