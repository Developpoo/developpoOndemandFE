import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../_types/Auth.type';

/**
 * Servizio per la gestione dell'autenticazione utente e la gestione dei dati di autenticazione.
 * Questo servizio offre funzioni per leggere, impostare e memorizzare l'oggetto Auth in localStorage e sessionStorage.
 * Inoltre, fornisce un oggetto BehaviorSubject per osservare le modifiche all'oggetto Auth.
 *
 * @@Injectable({ providedIn: 'root' })
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static auth: Auth;
  private obsAuth$: BehaviorSubject<Auth>;
  // private token: string | null = null;

  /**
   * Costruttore del servizio AuthService.
   * Inizializza l'oggetto Auth utilizzando i dati memorizzati in sessionStorage.
   * Inizializza anche un BehaviorSubject con l'oggetto Auth.
   */
  constructor() {
    // AuthService.auth = this.leggiAuthDaLocalStorage();
    AuthService.auth = this.leggiAuthDaSessionStorage();
    this.obsAuth$ = new BehaviorSubject<Auth>(AuthService.auth);
  }

  /**
 * Ottiene l'oggetto BehaviorSubject che rappresenta lo stato dell'autenticazione.
 *
 * @returns Un oggetto BehaviorSubject che rappresenta l'oggetto Auth.
 */
  leggiObsAuth() {
    return this.obsAuth$;
  }

  /**
 * Imposta l'oggetto Auth e aggiorna l'oggetto BehaviorSubject con i nuovi dati.
 *
 * @param dati I nuovi dati di autenticazione da impostare.
 */
  settaObsAuth(dati: Auth): void {
    AuthService.auth = dati;
    this.obsAuth$.next(dati);
  }

  /**
   * Legge l'oggetto Auth dalla memoria localStorage.
   *
   * @returns Un oggetto Auth letto da localStorage. Se non è presente, restituisce un oggetto Auth vuoto.
   */
  leggiAuthDaLocalStorage(): Auth {
    const tmp: string | null = localStorage.getItem('auth');
    let auth: Auth;
    if (tmp !== null) {
      auth = JSON.parse(tmp); // qui abbiamo una stringa che ricondifico in un oggetto il contrario di stringify
    } else {
      auth = {
        idLingua: 1,
        idUserClient: null,
        idUserRole: null,
        idUserStatus: null,
        token: null,
        nome: null,
        ability: null,
      };
    }
    return auth;
  }

  /**
   * Legge l'oggetto Auth dalla memoria sessionStorage.
   *
   * @returns Un oggetto Auth letto da sessionStorage. Se non è presente, restituisce un oggetto Auth vuoto.
   */
  leggiAuthDaSessionStorage(): Auth {
    const tmp: string | null = sessionStorage.getItem('auth');
    let auth: Auth;
    if (tmp !== null) {
      auth = JSON.parse(tmp); // qui abbiamo una stringa che ricondifico in un oggetto il contrario di stringify
    } else {
      auth = {
        idLingua: 1,
        idUserClient: null,
        idUserRole: null,
        idUserStatus: null,
        token: null,
        nome: null,
        ability: null,
      };
    }
    return auth;
  }

  /**
   * Scrive l'oggetto Auth nella memoria localStorage.
   *
   * @param auth L'oggetto Auth da scrivere in localStorage.
   */
  scriviAuthSuLocalStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth); //prendo il valore di auth e lo faccio diventare una stringa json
    localStorage.setItem('auth', tmp); // assegno un chiave valore auth tmp
  }


  /**
   * Scrive l'oggetto Auth nella memoria sessionStorage.
   *
   * @param auth L'oggetto Auth da scrivere in sessionStorage.
   */
  scriviAuthSuSessionStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth); //prendo il valore di auth e lo faccio diventare una stringa json
    sessionStorage.setItem('auth', tmp); // assegno un chiave valore auth tmp
  }
}
