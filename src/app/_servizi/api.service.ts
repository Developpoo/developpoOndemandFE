import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IRispostaServer } from '../_interfacce/IRispostaServer.interface';
import { Immagine } from '../_types/Immagine.type';
import { Genere } from '../_types/Genere.type';
import { Film } from '../_types/Film.types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  /**
   * Funzione per chiamare l'elenco dei generi dei Film
   * 
   * @returns Observable
   */
  public getGeneri(): Observable<IRispostaServer> {
    const rit: IRispostaServer = {
      data: this.fakeHttpCategorie(),
      error: null,
      message: null
    }
    return of(rit)
  }

  /**
 * Funzione per chiamare l'elenco dei Films
 * 
 * @returns Observable
 */
  public getFilms(): Observable<IRispostaServer> {
    const rit: IRispostaServer = {
      data: this.fakeHttpLibri(),
      error: null,
      message: null
    }
    return of(rit)
  }

  /**
   * Funzione ritorna l'elenco dei Films appartamenti ad un genere
   * 
   * @param idCat id della Categoria scelta
   * @returns Observable
   */
  public getFilmsDaGenere(idCat: number): Observable<IRispostaServer> {
    const tmp = this.fakeHttpLibri().filter(x => x.idCat === idCat)
    const rit: IRispostaServer = {
      data: tmp,
      error: null,
      message: null
    }
    return of(rit)
  }

  /**
   * La funzione ritorna i dati di un singolo Film
   * 
   * @param id id identificativo del Film scelto
   * @returns Observable
   */
  public getFilm(id: number): Observable<IRispostaServer> {
    const tmp = this.fakeHttpLibri().filter(x => x.id === id)
    const rit: IRispostaServer = {
      data: tmp,
      error: null,
      message: null
    }
    return of(rit)
  }

  /**
  * La funzione ritorna i dati di un singola Categoria
  * 
  * @param id id identificativo dellla Genere Scelto
  * @returns Observable
  */
  public getGenere(id: number): Observable<IRispostaServer> {
    const tmp = this.fakeHttpCategorie().filter(x => x.id === id)
    const rit: IRispostaServer = {
      data: tmp,
      error: null,
      message: null
    }
    return of(rit)
  }

  // ----------- Servizi fake per tirare fuori i dati ----------------------
  /***
   * La funzione ritorna un array di categorie simulando una chiamata HTTP
   * 
   * @returns Categoria []
   */

  private fakeHttpCategorie(): Genere[] {
    const img1: Immagine = { src: 'https://via.placeholder.com/360x200/FBADE3', alt: "Visualizza immagine Romantico" }
    const img2: Immagine = { src: 'https://via.placeholder.com/360x200/5880A8', alt: "Visualizza immagine Fantascienza" }
    const img3: Immagine = { src: 'https://via.placeholder.com/360x200/6DA75A', alt: "Visualizza immagine Avventura" }
    const img4: Immagine = { src: 'https://via.placeholder.com/360x200/6D005A', alt: "Visualizza immagine Fango" }

    const arrCat = [
      { id: 1, nome: "Romantico", img: img1 },
      { id: 2, nome: "Fantascienza", img: img2 },
      { id: 3, nome: "Avventura", img: img3 },
      { id: 4, nome: "Fango", img: img4 },
    ]
    return arrCat
  }

  /**
   * Funzione che ritorna un array di libri che simula una chiamata HTTP
   * 
   * @returns Libri []
   */

  private fakeHttpLibri(): Film[] {
    const img1: Immagine = { src: 'https://via.placeholder.com/240x150/DB9A00', alt: "Visualizza immagine Romantico" }
    const img2: Immagine = { src: 'https://via.placeholder.com/240x150/FBADE3', alt: "Visualizza immagine Avventura" }
    const img3: Immagine = { src: 'https://via.placeholder.com/240x150/FF7000', alt: "Visualizza immagine Fantascienza" }
    const img4: Immagine = { src: 'https://via.placeholder.com/240x150/9DA7FF', alt: "Visualizza immagine Avventura" }
    const img5: Immagine = { src: 'https://via.placeholder.com/240x150/9DA75A', alt: "Visualizza immagine Romantico" }
    const img6: Immagine = { src: 'https://via.placeholder.com/240x150/FAC700', alt: "Visualizza immagine Fanga" }
    const img7: Immagine = { src: 'https://via.placeholder.com/240x150/FF70EE', alt: "Visualizza immagine Fantascienza" }
    const img8: Immagine = { src: 'https://via.placeholder.com/240x150/6DA75A', alt: "Visualizza immagine Fantascienza" }
    const img9: Immagine = { src: 'https://via.placeholder.com/240x150/6DA750', alt: "Visualizza immagine Fantascienza" }

    const arrLibri: Film[] = [
      { id: 1, idCat: 1, titolo: "Libro Romantico", autore: "Mario Rossi", img: img1 },
      { id: 2, idCat: 3, titolo: "Libro Avventura", autore: "Paolo Rossi", img: img2 },
      { id: 3, idCat: 2, titolo: "Libro Fantascienza", autore: "Luca Bianchi", img: img3 },
      { id: 4, idCat: 3, titolo: "L'Avventura", autore: "Giuseppe Verdi", img: img4 },
      { id: 5, idCat: 1, titolo: "Il Romantismo", autore: "Sandro Sandri", img: img5 },
      { id: 6, idCat: 4, titolo: "Fanghilandia", autore: "Fango Fanghi", img: img6 },
      { id: 7, idCat: 2, titolo: "La Fantascienza", autore: "Mario Rossi", img: img7 },
      { id: 8, idCat: 2, titolo: "2001 odissea nello spazio", autore: "Mario Rossi", img: img8 },
      { id: 9, idCat: 4, titolo: "sti cazzi la fantascienza", autore: "Fango Fanghi", img: img9 }
    ]
    return arrLibri
  }

}
