import { Component, OnInit } from '@angular/core';
import { Observable, catchError, concatMap, delay, map, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Bottone } from 'src/app/_types/Bottone.type';
import { Card } from 'src/app/_types/Card.type';
import { CategoryFile } from 'src/app/_types/CategoryFile.type';
import { Genere } from 'src/app/_types/Genere.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-collezioni-film',
  templateUrl: './collezioni-film.component.html',
  styleUrls: ['./collezioni-film.component.scss']
})
export class CollezioniFilmComponent implements OnInit {

  generi: Card[] = [];
  error: string = '';
  dati: any;
  cat$!: Observable<IRispostaServer>;

  constructor(private api: ApiService) { }

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
      next: (response) => {
        console.log("Risposta HTTP:", response);
        // Continua con l'analisi dei dati
        // Assicurati che l'array generi sia popolato
        console.log("Generi:", this.generi);
      },
      error: (err) => {
        console.error(err);
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
        link: "/collezioni/elenco/" + dato.idCategory.idCategory
      };
      const card: Card = {
        immagine: tmpImg,
        descrizione: '',
        titolo: dato.nome,
        bottone: bottone
      };
      generi.push(card);

      // Aggiungi un log per verificare ogni card creata
      console.log("Card creata:", card);
    }
    console.log("Dati delle card:", generi);
    return generi;
  }
}