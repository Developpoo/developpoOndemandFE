import { Injectable } from '@angular/core';
import { Observable, concatMap, map, of, take, tap } from 'rxjs';
import { IRispostaServer } from '../_interfacce/IRispostaServer.interface';
import { Immagine } from '../_types/Immagine.type';
import { Genere } from '../_types/Genere.type';
import { Film } from '../_types/Film.types';
import { ChiamataHTTP } from '../_types/ChiamataHTTP.type';
import { HttpClient } from '@angular/common/http';
import { UtilityServices } from './utility.services';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Funzione per chiamare l'elenco dei generi dei Film
   * 
   * @returns Observable
   */
  public getGeneri(): Observable<IRispostaServer> {
    const risorsa:string[]=["generi"]
    return this.richiestaGenerica(risorsa, "GET")
  }

  /**
 * Funzione per chiamare l'elenco dei Films
 * 
 * @returns Observable
 */
  public getFilms(): Observable<IRispostaServer> {
    const risorsa: string[] = ["film"]; // Modifica l'endpoint se necessario
    return this.richiestaGenerica(risorsa, "GET");
  }

  /**
   * Funzione ritorna l'elenco dei Films appartamenti ad un genere
   * 
   * @param idCat id della Categoria scelta
   * @returns Observable
   */
  public getFilmsDaGenere(idCat: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ["generi", idCat, "film"]; // Modifica l'endpoint se necessario
    return this.richiestaGenerica(risorsa, "GET");
  }

  /**
   * La funzione ritorna i dati di un singolo Film
   * 
   * @param id id identificativo del Film scelto
   * @returns Observable
   */
  public getFilm(id: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ["films", id]; // Modifica l'endpoint se necessario
    return this.richiestaGenerica(risorsa, "GET");
  }

  /**
  * La funzione ritorna i dati di un singola Categoria
  * 
  * @param id id identificativo dellla Genere Scelto
  * @returns Observable
  */
  public getGenere(id: number): Observable<IRispostaServer> {
    const risorsa: (string | number)[] = ["generi", id]; // Modifica l'endpoint se necessario
    return this.richiestaGenerica(risorsa, "GET");
  }

  //###########################################################################

  /**
     * @param risorsa (string!number)[]
     * @returns string stringa che rappresenta l'endpoint del serve
     */


  protected calcolaRisorsa(risorsa: (string | number)[]): string {
    const server: string = "https://www.developpo.com/developpoOndemandBE/public/api" //http://127.0.0.1:8000/api dopo modifica con proxy
    const versione: string = "v1"
    let url = server + "/" + versione + "/"
    risorsa.forEach(x => { url = url + x + "/" })
    url = url + risorsa.join("/")
    return url
  }

  /**
     * @param risorsa (string!number)[] Risorsa di cui voglio sapere i dati 
     * @param tipo string GET | POST | PUT | DELETE tipo di chiamata Http
     * @param parametri Oblect |null Parametri da passare all'endpoint
     * @returns Observable
     */

  protected richiestaGenerica(risorsa: (string | number)[], tipo: ChiamataHTTP, parametri: Object | null = null): Observable<IRispostaServer> {

    const url = this.calcolaRisorsa(risorsa)

    switch (tipo) {
      case "GET": 
      console.log("Passo da qui 1")
        return this.http.get<IRispostaServer>(url)
        break

      case "POST": 
      if (parametri !== null) {
        console.log("Passo da qui 2")
        return this.http.post<IRispostaServer>(url, parametri).pipe(tap(x => console.log("SERVICE", x)))
      } else {
        const objErrore = { data: null, message: null, error: "NO_PARAMETRI" }
        const obs$ = new Observable<IRispostaServer>(subscriber => subscriber.next(objErrore))
        return obs$
      }
        break

      case "PUT": 
      if (parametri !== null) {
        console.log("Passo da qui 4")
        return this.http.put<IRispostaServer>(url, parametri).pipe(tap(x => console.log("SERVICE MODIFCA", x)))
      } else {
        const objErrore = { data: null, message: null, error: "NO_PARAMETRI" }
        const obs$ = new Observable<IRispostaServer>(subscriber => subscriber.next(objErrore))
        return obs$
      }
        break

      case "DELETE": 
      console.log("PASSO DA QUI 5")
        return this.http.delete<IRispostaServer>(url)
        break

      default: 
      console.log("Passo da qui 3")
        return this.http.get<IRispostaServer>(url)
        break
    }
  }

  //###### FASE LOGIN ##################

   /**
   * Funzione che manda l'untente al server per l'autenticazioni
   * @param hashUtente stringa che rappresenta l'utente
   * @returns  Observable
   */

   public getLoginFase1(hashUtente: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["signClient", hashUtente]
    const rit = this.richiestaGenerica(risorsa, "GET")
    return rit
  }

  /**
   * Funzione che manda hash utente e hash password cifrata al server
   * @param hashUtente stringa che rappresenta l'utente
   * @param hashPassword stringa che rappresenta l'hash sha512 della password unita al sale
   * @returns Observable
   */

  public getLoginFase2(hashUtente: string, hashPassword: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["signClient", hashUtente, hashPassword]
    const rit = this.richiestaGenerica(risorsa, "GET")
    return rit
  }


  /**
   * Funzione che effettua il Login
   * @param utente stringa che rappresenta l'utente
   * @param password stringa che rappresenta la password
   * @returns Observable
   */
  public login(utente: string, password: string): Observable<IRispostaServer> {
    const hashUtente: string = UtilityServices.hash(utente)
    const hashPassword: string = UtilityServices.hash(password)
    const controllo$ = this.getLoginFase1(hashUtente).pipe(
      take(1),
      tap(x => console.log("Dati:", x)),
      map((rit: IRispostaServer): string => {
        const sale: string = rit.data.sale
        const passwordNascosta = UtilityServices.nascondiPassword(hashPassword, sale)
        return passwordNascosta
      }),
      concatMap((passwordNascosta: string) => {
        return this.getLoginFase2(hashUtente, passwordNascosta)
      })
    )
    return controllo$
  }

  /**
     * Funzione richiamare elenco Tipo Indirizzi
     * 
     * @returns Observable
     */

  public getTipoIndirizzi(): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipoIndirizzi"]
    return this.richiestaGenerica(risorsa, "GET")
  }
}
