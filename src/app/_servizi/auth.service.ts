import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from '../_types/Auth.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static auth: Auth;
  private obsAuth$: BehaviorSubject<Auth>;
  // private token: string | null = null;

  constructor() {
    // AuthService.auth = this.leggiAuthDaLocalStorage();
    AuthService.auth = this.leggiAuthDaSessionStorage();
    this.obsAuth$ = new BehaviorSubject<Auth>(AuthService.auth);
  }

  leggiObsAuth() {
    return this.obsAuth$;
  }

  settaObsAuth(dati: Auth): void {
    AuthService.auth = dati;
    this.obsAuth$.next(dati);
  }

  /************************************************ */
  /**
   * Funzione serve a leggere Auth se presente in localStorage
   * @returns Ritorna un oggetto Auth
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

  /************************************************ */
  /**
   * Funzione serve a leggere Auth se presente in localStorage
   * @returns Ritorna un oggetto Auth
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

  //******************************************** */
  /**
   * Funzione che scrive auth su localStorage
   * @param auth è un oggetto Auth da scrivere
   */

  scriviAuthSuLocalStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth); //prendo il valore di auth e lo faccio diventare una stringa json
    localStorage.setItem('auth', tmp); // assegno un chiave valore auth tmp
  }


  //******************************************** */
  /**
   * Funzione che scrive auth su localStorage
   * @param auth è un oggetto Auth da scrivere
   */

  scriviAuthSuSessionStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth); //prendo il valore di auth e lo faccio diventare una stringa json
    sessionStorage.setItem('auth', tmp); // assegno un chiave valore auth tmp
  }
}
