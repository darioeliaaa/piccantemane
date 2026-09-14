export type LineId = 'calabrese' | 'affumicata' | 'fermentata' | 'reaper';

export interface ProductLine {
  id: LineId;
  name: string;
  short: string;
  color: string;
  description: string;
  method: string;
}

/**
 * Le quattro linee di produzione. Ognuna ha un colore che diventa
 * l'accento della sua fetta di catalogo — la stessa logica di --vino in
 * Sìdero, applicata qui alle etichette invece che alle pagine vino.
 */
export const LINES: ProductLine[] = [
  {
    id: 'calabrese',
    name: 'Linea Calabrese',
    short: 'Il classico, senza scorciatoie',
    color: '#c1481c',
    description:
      'Peperoncino di Diamante fresco, raccolto a mano tra agosto e settembre e lavorato entro 48 ore. È la linea che definisce tutte le altre.',
    method: 'Peperoncino fresco, aceto di vino, sale marino. Nessuna cottura oltre i 70°.',
  },
  {
    id: 'affumicata',
    name: 'Linea Affumicata',
    short: 'Sedici ore su legna d’ulivo',
    color: '#8a5a2b',
    description:
      'Peperoncini affumicati a freddo su legna di ulivo potato a mano, la stessa che si usa per affumicare la soppressata in molte case della zona.',
    method: 'Affumicatura a freddo 16h, poi fermentazione breve e riduzione lenta.',
  },
  {
    id: 'fermentata',
    name: 'Linea Fermentata',
    short: 'Nessun aceto, solo tempo',
    color: '#9a9433',
    description:
      'Lacto-fermentazione in salamoia da 27 a 45 giorni. Niente aceto: l’acidità la fa il tempo, non la bottiglia.',
    method: 'Fermentazione in salamoia al 3,5%, poi frullata con la sua stessa salamoia.',
  },
  {
    id: 'reaper',
    name: 'Linea Reaper',
    short: 'Sopra ogni soglia ragionevole',
    color: '#3a0a08',
    description:
      'Carolina Reaper e Ghost Pepper coltivati in serra, in lotti piccoli e irregolari. Non è pensata per l’uso quotidiano, ed è scritto in etichetta.',
    method: 'Peperoncini extra-piccanti, riduzione lunga, imbottigliata in lotti da meno di 200 pezzi.',
  },
];

export function lineById(id: LineId): ProductLine {
  return LINES.find((l) => l.id === id)!;
}
