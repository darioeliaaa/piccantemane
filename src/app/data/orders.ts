export type OrderStatus = 'lavorazione' | 'transito' | 'consegnato' | 'reso';

export interface OrderRow {
  id: string;
  date: string;
  customer: string;
  city: string;
  items: string;
  total: number;
  status: OrderStatus;
  tracking: string | null;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  lavorazione: 'In lavorazione',
  transito: 'In transito',
  consegnato: 'Consegnato',
  reso: 'Reso',
};

/**
 * Il "registro ordini" del negoziante — dati d'esempio, non un backend
 * reale. In una consegna vera questa tabella arriverebbe da un pannello
 * ordini collegato al checkout; qui mostra la forma che avrebbe.
 */
export const ORDERS: OrderRow[] = [
  { id: 'PM-24091', date: '2026-09-08', customer: 'Marco Ferraro', city: 'Torino', items: 'Contrabbando ×2, Fumo di Ulivo ×1', total: 34.5, status: 'consegnato', tracking: 'IT80234871205' },
  { id: 'PM-24092', date: '2026-09-08', customer: 'Elisa Conforti', city: 'Milano', items: 'Ultimo Avviso ×1', total: 19, status: 'consegnato', tracking: 'IT80234871298' },
  { id: 'PM-24093', date: '2026-09-09', customer: 'Giuseppe Vallone', city: 'Diamante', items: "Diamante '68 ×3, Acido Ventisette ×2", total: 39.5, status: 'consegnato', tracking: 'IT80234872011' },
  { id: 'PM-24094', date: '2026-09-10', customer: 'Anna Ruggiero', city: 'Bologna', items: 'Lacrima Gialla ×1, Brace Lenta ×1', total: 17.5, status: 'transito', tracking: 'IT80234873456' },
  { id: 'PM-24095', date: '2026-09-10', customer: 'Davide Colace', city: 'Roma', items: 'Riserva Extrema ×1', total: 18, status: 'transito', tracking: 'IT80234873501' },
  { id: 'PM-24096', date: '2026-09-11', customer: 'Chiara Petrucci', city: 'Firenze', items: 'Doppio Taglio ×2, Sciabordata ×1', total: 27, status: 'transito', tracking: 'IT80234874120' },
  { id: 'PM-24097', date: '2026-09-11', customer: 'Luca Sammarco', city: 'Cosenza', items: 'Cenere Nera ×1, Fumo di Ulivo ×2', total: 27.5, status: 'lavorazione', tracking: null },
  { id: 'PM-24098', date: '2026-09-12', customer: 'Ilenia Barbieri', city: 'Napoli', items: 'Punto di Non Ritorno ×1', total: 22, status: 'lavorazione', tracking: null },
  { id: 'PM-24099', date: '2026-09-12', customer: 'Simone Greco', city: 'Bari', items: "Diamante '68 ×4", total: 30, status: 'lavorazione', tracking: null },
  { id: 'PM-24100', date: '2026-09-07', customer: 'Federica Nardi', city: 'Genova', items: 'Ultimo Avviso ×1', total: 19, status: 'reso', tracking: 'IT80234870987' },
];
