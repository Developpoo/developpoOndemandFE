import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/_types/Card.type';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Observable } from 'rxjs';
import { concatMap, map, catchError, tap } from 'rxjs/operators';
import { Bottone } from 'src/app/_types/Bottone.type';
import { CategoryFile } from 'src/app/_types/CategoryFile.type';
import { Genere } from 'src/app/_types/Genere.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-genere',
  templateUrl: './genere.component.html',
  styleUrls: ['./genere.component.scss']
})
export class GenereComponent implements OnInit {

  generi: Card[] = [];
  error: string = '';
  dati: any;
  cat$!: Observable<IRispostaServer>;

  constructor(private api: ApiService,) { }

  /**
   * Questo componente gestisce la visualizzazione dei generi di film.
   * Recupera i dati dei generi e dei file correlati da un'API e crea le Card per la visualizzazione.
   */

  ngOnInit(): void {
    // Concatena le chiamate API e gestisci gli errori
    this.cat$ = this.getGeneri().pipe(
      concatMap((catData) => {
        return this.getFile().pipe(
          map((fileData) => {
            try {
              // Verifica la validità JSON
              const catDataJson = JSON.parse(JSON.stringify(catData));
              const fileDataJson = JSON.parse(JSON.stringify(fileData));

              // Combina i dati e crea le Card
              this.dati = this.combinaDati(catDataJson.data, fileDataJson.data);
              this.generi = this.creaCardDaDati(this.dati);

              // Restituisci catDataJson per passarlo alla successiva sottoscrizione
              return catDataJson;
            } catch (e) {
              console.error("Errore durante l'analisi della risposta da getFile()");
              this.error = 'Errore durante la richiesta API: risposta non valida';
              throw e; // Rilancia l'errore per gestirlo nella sottoscrizione successiva
            }
          }),
          catchError((err) => {
            console.error(err);
            this.error = 'Errore durante la richiesta API: ' + err.message;
            throw err;
          })
        );
      })
    );

    // Sottoscrizione all'Observable
    this.cat$.subscribe({
      next: (response: IRispostaServer): void => {
        console.log("NEXT HTTP:", response);
        // Continua con l'analisi dei dati
        // Assicurati che l'array generi sia popolato
        console.log("NEXT Generi:", this.generi);
      },
      error: (err: any) => {
        console.error("ERRORE", err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => console.log("Completo")
    });
  }

  // Metodo per ottenere i dati dei generi da un'API
  getGeneri(): Observable<IRispostaServer> {
    return this.api.getGeneri().pipe(
      tap((response) => {
        console.log("Risposta HTTP per Generi:", response);
      })
    );
  }

  // Metodo per ottenere i dati dei file da un'API
  getFile(): Observable<IRispostaServer> {
    return this.api.getFile().pipe(
      tap((response) => {
        console.log("Risposta HTTP per File:", response);
      })
    );
  }

  // Metodo per combinare i dati dei generi e dei file
  private combinaDati(catData: Genere[], fileData: any[]): CategoryFile[] {
    const datiCombinati: CategoryFile[] = [];
    for (const categoria of catData) {
      const fileCorrispondente = fileData.find((file) => file.idFile === categoria.idFile);
      if (fileCorrispondente) {
        datiCombinati.push({
          idFile: fileCorrispondente.idFile,
          nome: categoria.nome,
          idCategory: categoria,
          src: fileCorrispondente.src,
          alt: fileCorrispondente.alt,
          title: fileCorrispondente.title,
        });
      }
    }
    console.log("stampa datiCombinati", datiCombinati);
    return datiCombinati;
  }

  // Metodo per creare le Card dai dati combinati
  private creaCardDaDati(dati: any[]): Card[] {
    const generi: Card[] = [];
    for (const dato of dati) {
      const tmpImg: Immagine = {
        idFile: dato.idFile,
        idTipoFile: 1,
        src: dato.src,
        alt: dato.alt,
        title: dato.title
      };
      const bottone: Bottone = {
        testo: "Visualizza",
        title: "Visualizza " + dato.nome,
        icona: dato.idCategory.icona,
        tipo: "button",
        emitId: null,
        link: "/genere/" + dato.idCategory.idCategory
      };
      const card: Card = {
        immagine: tmpImg,
        descrizione: '',
        titolo: dato.nome,
        bottone: bottone
      };
      generi.push(card);

      console.log("Card creata:", card);
    }
    // METTO IN ORDINE ALFABETICO LE CARD
    generi.sort((a, b) => {
      if (a.titolo && b.titolo) {
        return a.titolo.localeCompare(b.titolo);
      } else if (a.titolo) {
        return -1; // a viene prima se b.titolo è null
      } else if (b.titolo) {
        return 1;  // b viene prima se a.titolo è null
      } else {
        return 0;  // entrambi sono null, quindi non cambia l'ordine
      }
    });

    console.log("Dati delle card:", generi);
    return generi;
  }

}
