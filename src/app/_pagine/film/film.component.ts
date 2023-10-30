import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, concatMap, delay, forkJoin, map, switchMap, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Bottone } from 'src/app/_types/Bottone.type';
import { Card } from 'src/app/_types/Card.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit, OnDestroy {

  films: Card[] = [];
  private distruggi$ = new Subject<void>()

  constructor(private api: ApiService, private route: ActivatedRoute, private cd: ChangeDetectorRef) { }

  /**
   * Questo componente gestisce la visualizzazione dei film in base al genere.
   * Recupera i dati del genere dai parametri dell'URL e carica i film corrispondenti.
   */

  ngOnInit(): void {
    // Richiama il metodo per recuperare i dati e osservarli
    this.recuperaDati().subscribe(this.osservoFilms());
    console.log(this.films);
  }

  ngOnDestroy(): void {
    // Notifica la distruzione del componente
    this.distruggi$.next();
  }

  private recuperaDati(): Observable<IRispostaServer> {
    // Recupera il parametro 'id' dalla route
    return this.route.params.pipe(
      map(x => x['id']),
      tap(x => console.log("%c Recupero ID " + x, "color:0000AA")),
      concatMap((x: string, index: number): Observable<IRispostaServer> => {
        // Utilizza il servizio ApiService per recuperare i film in base al genere
        return this.api.getFilmsDaGenere(+(x))
      }),
      takeUntil(this.distruggi$)
    );
  }

  //########################################
  // Observer FILMS
  //########################################

  private osservoFilms() {
    return {
      next: (rit: IRispostaServer) => {
        console.log("Funzione 'next' chiamata con la risposta", rit);
        this.films = [];

        // Verifica se 'data' esiste e ha una lunghezza prima di iterare
        if (rit.data && rit.data.length > 0) {
          const elementi = rit.data;
          for (let i = 0; i < elementi.length; i++) {

            console.log("ELEMENTI", elementi)

            // Crea un oggetto Immagine per l'elemento corrente
            const tmpImg: Immagine = {
              idFile: elementi[i].idFile,
              idTipoFile: elementi[0].idTipoFile,
              src: elementi[i].src,
              alt: elementi[i].alt,
              title: elementi[i].title
            }

            // Crea un oggetto Bottone per il pulsante "Visualizza"
            const bottone: Bottone = {
              testo: "Visualizza",
              title: "Visualizza " + elementi[i].title,
              icona: elementi[i].icona,
              tipo: "button",
              emitId: null,
              link: "/filmVideo/" + elementi[i].idFilm
            }

            // Crea un oggetto Card per il film corrente e lo aggiunge all'array films
            const card: Card = {
              immagine: tmpImg,
              // descrizione: elementi[i].descrizione,
              descrizione: "",
              titolo: elementi[i].titolo,
              bottone: bottone
            }
            this.films.push(card)
          }
        } else {
          console.log("L'array 'elementi' è vuoto o indefinito.");
        }
      },
      error: (err: any) => console.error("Errore", err),
      complete: () => { console.log("%c COMPLETATO", "color:#00AA00") }
    }
  }
}
