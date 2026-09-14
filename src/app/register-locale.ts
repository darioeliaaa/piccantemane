import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

/**
 * Senza questo, ogni DecimalPipe con locale 'it' esplicito lancia un
 * RuntimeError (NG02100, InvalidPipeArgument) perché Angular non porta la
 * tabella dati della locale italiana di default — solo l'inglese è
 * integrato nel core. In produzione il messaggio viene azzerato e resta
 * solo il codice numerico, quindi va importato UNA VOLTA prima del
 * bootstrap, sia lato client che lato server (SSR/prerendering).
 */
registerLocaleData(localeIt);
