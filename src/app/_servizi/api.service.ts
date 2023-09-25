import { Injectable } from '@angular/core';
import { Observable, catchError, concatMap, map, of, take, tap, throwError } from 'rxjs';
import { IRispostaServer } from '../_interfacce/IRispostaServer.interface';
import { Immagine } from '../_types/Immagine.type';
import { Genere } from '../_types/Genere.type';
import { Film } from '../_types/Film.types';
import { ChiamataHTTP } from '../_types/ChiamataHTTP.type';
import { HttpClient } from '@angular/common/http';
import { UtilityServices } from './utility.services';
import { ParametriSaveAuth } from '../_types/ParametriSaveAuth.type';
import { HttpHeaders } from '@angular/common/http';
import { Auth } from '../_types/Auth.type';
import { AuthService } from './auth.service';

/**
 * Servizio per la gestione delle chiamate API al server.
 * Questo servizio fornisce funzioni per effettuare richieste HTTP a diverse risorse sul server.
 *
 * @@Injectable({ providedIn: 'root' })
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // METODI PER LE CHIAMATE API

  /**
   * Funzione per chiamare l'elenco dei generi dei Film
   *
   * @returns Observable
   */
  public getFile(): Observable<IRispostaServer> {
    const risorsa: string[] = ['file'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
 * Funzione per chiamare l'elenco dei generi dei Film
 *
 * @returns Observable
 */
  public getGeneri(): Observable<IRispostaServer> {
    const risorsa: string[] = ['category'];
    return this.richiestaGenerica(risorsa, 'GET');
  }


  /**
   * Funzione per chiamare l'elenco dei Films
   *
   * @returns Observable
   */
  public getFilms(): Observable<IRispostaServer> {
    const risorsa: string[] = ['film'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * Funzione ritorna l'elenco dei Films appartamenti ad un genere
   *
   * @param idCategory id della Categoria scelta
   * @returns Observable
   */
  public getFilmsDaGenere(idCategory: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ['category', idCategory, 'film'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * La funzione ritorna i dati di un singolo Film
   *
   * @param id id identificativo del Film scelto
   * @returns Observable
   */
  public getFilm(idFilm: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ['film', idFilm];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * La funzione ritorna i dati di un singola Categoria
   *
   * @param id id identificativo dellla Genere Scelto
   * @returns Observable
   */
  public getGenere(idCategory: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ['category', idCategory];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // LINGUE

  /**
   * Funzione richiamare elenco Tipo Indirizzi
   *
   * @returns Observable
   */

  public getLingue(): Observable<IRispostaServer> {
    const risorsa: string[] = ['lingue'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // NAZIONI

  /**
   * Funzione richiamare elenco Tipo Indirizzi
   *
   * @returns Observable
   */

  public getNazioni(): Observable<IRispostaServer> {
    const risorsa: string[] = ['nazioni'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // COMUNI

  /**
   * Funzione richiamare elenco Tipo Indirizzi
   *
   * @returns Observable
   */

  public getComuni(): Observable<IRispostaServer> {
    const risorsa: string[] = ['comuniItaliani'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // TIPOLOGIE INDIRIZZI - RECAPITI

  /**
   * Funzione richiamare elenco Tipo Indirizzi
   *
   * @returns Observable
   */

  public getTipoIndirizzi(): Observable<IRispostaServer> {
    const risorsa: string[] = ['tipoIndirizzi'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * Funzione richiamare elenco Tipo Indirizzo
   *
   * @returns Observable
   */

  public getTipoIndirizzo(idTipoIndirizzo: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['tipoIndirizzi', idTipoIndirizzo];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * Funzione richiamare elenco Tipo Recapiti
   *
   * @returns Observable
   */

  public getTipoRecapiti(): Observable<IRispostaServer> {
    const risorsa: string[] = ['tipoRecapiti'];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  /**
   * Funzione richiamare elenco Tipo Recapito
   *
   * @returns Observable
   */

  public getTipoRecapito(idTipoRecapito: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['tipoRecapito', idTipoRecapito];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // CERCA USER ESISTENTE

  public getSearchUserClient(auth: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['searchUserClient', auth];
    return this.richiestaGenerica(risorsa, 'GET');
  }

  // UPLOAD FILE

  public upload(dati: FormData): Observable<IRispostaServer> {
    const risorsa: string[] = ['upload'];
    return this.richiestaGenerica(risorsa, 'POST', dati);
  }

  // REGISTRAZIONE UTENTE

  /**
   * Funzione per la Registrazione di un Utente su UserClient
   *
   * @returns Observable
   */

  public postRegistrazioneUserClient(
    parametri: Partial<ParametriSaveAuth>): Observable<IRispostaServer> {
    const risorsa: string[] = ['registrazione'];
    return this.richiestaGenerica(risorsa, 'POST', parametri);
  }

  //###########################################################################

  /**
 * Calcola l'URL completo per una risorsa data.
 *
 * @param risorsa Array di stringhe e numeri che rappresenta la risorsa desiderata.
 * @returns Una stringa che rappresenta l'URL completo per la risorsa.
 */
  protected calcolaRisorsa(risorsa: (string | number)[]): string {
    const server: string =
      'https://www.developpo.com/developpoOndemandBE/public/api';
    const versione: string = 'v1';
    let url = server + '/' + versione + '/';
    // risorsa.forEach(x => { url = url + x + "/" })
    url = url + risorsa.join('/'); //risorsa.join prende l'array e l'unisce
    return url;
  }

  /**
   * Effettua una richiesta HTTP generica al server.
   *
   * @param risorsa Array di stringhe e numeri che rappresenta la risorsa desiderata.
   * @param tipo Tipo di richiesta HTTP (GET, POST, PUT, DELETE).
   * @param parametri Parametri da passare all'endpoint (opzionale).
   * @returns Un Observable che contiene la risposta del server.
   */
  protected richiestaGenerica(risorsa: (string | number)[], tipo: ChiamataHTTP, parametri: Object | null = null): Observable<IRispostaServer> {

    const url = this.calcolaRisorsa(risorsa)

    switch (tipo) {
      case "GET": console.log("PASSO GET",)
        return this.http.get<IRispostaServer>(url)
        break

      case "POST": if (parametri !== null) {
        console.log("PASSO POST", url)
        return this.http.post<IRispostaServer>(url, parametri).pipe(tap(x => console.log("SERVICE", x)))
      } else {
        const objErrore = { data: null, message: null, error: "NO_PARAMETRI" }
        const obs$ = new Observable<IRispostaServer>(subscriber => subscriber.next(objErrore))
        return obs$
      }
        break

      case "PUT": if (parametri !== null) {
        console.log("PASSO PUT", url)
        return this.http.put<IRispostaServer>(url, parametri).pipe(tap(x => console.log("SERVICE", x)))
      } else {
        const objErrore = { data: null, message: null, error: "NO_PARAMETRI" }
        const obs$ = new Observable<IRispostaServer>(subscriber => subscriber.next(objErrore))
        return obs$
      }
        break

      case "DELETE": console.log("PASSO DELETE", url)
        return this.http.delete<IRispostaServer>(url)
        break

      default: console.log("PASSO DEFAULT")
        return this.http.get<IRispostaServer>(url)
        break
    }
  }


  //###### FASE LOGIN ##################

  /**
   * Funzione per inviare la richiesta di autenticazione dell'utente al server.
   *
   * @param hashUtente Una stringa che rappresenta l'utente (hash utente).
   * @returns Un Observable contenente la risposta del server.
   */
  public getLoginFase1(hashUtente: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['signClient', hashUtente];
    const rit = this.richiestaGenerica(risorsa, 'GET');
    return rit;
  }

  /**
   * Funzione per inviare al server l'hash dell'utente e l'hash cifrato della password.
   *
   * @param hashUtente Una stringa che rappresenta l'utente (hash utente).
   * @param hashPassword Una stringa che rappresenta l'hash SHA-512 della password unita al sale.
   * @returns Un Observable contenente la risposta del server.
   */
  public getLoginFase2(
    hashUtente: string,
    hashPassword: string
  ): Observable<IRispostaServer> {
    const risorsa: string[] = ['signClient', hashUtente, hashPassword];
    const rit = this.richiestaGenerica(risorsa, 'GET');
    return rit;
  }

  /**
   * Funzione che effettua il login dell'utente.
   *
   * @param utente Una stringa che rappresenta l'utente nel database di autenticazione (hash utente).
   * @param password Una stringa che rappresenta la password.
   * @returns Un Observable contenente la risposta del server.
   */
  public login(utente: string, password: string): Observable<IRispostaServer> {
    const hashUtente: string = UtilityServices.hash(utente);
    const hashPassword: string = UtilityServices.hash(password);
    // console.log('HashPassword: ', hashPassword, hashUtente);
    const controllo$ = this.getLoginFase1(hashUtente).pipe(
      take(1),
      tap((x) => console.log('DatiFase1:', x)),
      map((rit: IRispostaServer): string => {
        const salt: string = rit.data.salt;
        // console.log ("rit", rit.data)
        const passwordNascosta = UtilityServices.nascondiPassword(
          hashPassword,
          salt
        );
        // console.log ("hash", passwordNascosta, "sale", sale)
        return passwordNascosta;
      }),
      concatMap((passwordNascosta: string) => {
        return this.getLoginFase2(hashUtente, passwordNascosta)
      })
    );
    return controllo$;
  }
}

