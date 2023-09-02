import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import jwtDecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UtilityServices {
  // static numeroCasuale(min: number, max: number): number {
  //     return Math.floor(Math.random() * max) + min
  // }

  /**
   * Funzione che crea hash sha512 di una stringa
   * @param str una stringa da cifrare
   * @returns stringa cifrata
   */
  static hash(str: string): string {
    const tmp = sha512(str);
    return tmp;
  }

  /**
   * Funzione che leggi i dati dal token
   * @param token string che rappresenta il token
   * @returns un oggetto (da migliorare questa documentazione)
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
   * Funzione che calcola l'hash sha512 della password legata al sale
   * @param password string che rappresenta la password
   * @param salt string che rappresenta un'altra stringa da legare alla password
   * @returns string che rappresenta hash sha512 della password unita al sale
   */
  static nascondiPassword(password: string, salt: string): string {
    const tmp: string = salt + password;
    const hash: string = sha512(tmp);
    return hash;
  }
}
