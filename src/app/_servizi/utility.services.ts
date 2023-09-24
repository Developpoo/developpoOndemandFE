import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import jwtDecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UtilityServices {
  // static numeroCasuale(min: number, max: number): number {
  //     return Math.floor(Math.random() * max) + min
  // }

  /**
   * Funzione che calcola l'hash SHA-512 di una stringa.
   *
   * @param str Una stringa da cifrare.
   * @returns La stringa cifrata in formato SHA-512.
   */
  static hash(str: string): string {
    const tmp = sha512(str);
    return tmp;
  }

  /**
   * Funzione che legge i dati dal token JWT (JSON Web Token).
   *
   * @param token Una stringa che rappresenta il token JWT.
   * @returns Un oggetto contenente i dati estratti dal token.
   *          Restituisce null se il token non è valido o non può essere letto.
   */
  static leggiToken(token: string): any {
    try {
      // console.log("token", token)
      return jwtDecode(token);
    } catch (error) {
      console.error('ERRORE DI LETTURA DEL TOKEN');
      return null;
    }
  }

  /**
   * Funzione che calcola l'hash SHA-512 della password concatenata con il sale.
   *
   * @param password Una stringa che rappresenta la password.
   * @param salt Una stringa che rappresenta un valore aggiuntivo da concatenare alla password.
   * @returns La stringa che rappresenta l'hash SHA-512 della password concatenata con il sale.
   */
  static nascondiPassword(password: string, salt: string): string {
    const tmp: string = salt + password;
    const hash: string = sha512(tmp);
    return hash;
  }

}
