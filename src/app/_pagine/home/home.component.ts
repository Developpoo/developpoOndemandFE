import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, concatMap, map, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';
import { Bottone } from 'src/app/_types/Bottone.type';
import { Card } from 'src/app/_types/Card.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()
  films: Card[] = [];
  private distruggi$ = new Subject<void>()

  constructor(private authService: AuthService, private api: ApiService, private route: ActivatedRoute) { }

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
        return this.api.getFilmsFile()
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


          // Ordina i film dal più recente al più antico in base a 'idFilm'
          elementi.sort((a: { idFilm: number; }, b: { idFilm: number; }) => b.idFilm - a.idFilm);

          for (let i = 0; i < elementi.length; i++) {
            const film = elementi[i];
            console.log("ELEMENTO", film);

            // Assicurati che 'files' esista e che abbia elementi al suo interno
            if (film.files && film.files.length > 0) {
              // Supponiamo che la prima immagine sia quella che vogliamo mostrare
              const fileImmagine = film.files.find((f: { idTipoFile: number; }) => f.idTipoFile === 1); // Trova il file che è un'immagine, in base a idTipoFile


              // Se c'è un file immagine, procedi
              if (fileImmagine) {
                // Crea un oggetto Immagine per l'elemento corrente
                const tmpImg: Immagine = {
                  idFile: fileImmagine.idFile,
                  idTipoFile: fileImmagine.idTipoFile,
                  src: fileImmagine.src,
                  alt: fileImmagine.alt || 'Immagine di default', // Aggiungi un alt di default se non presente
                  title: fileImmagine.title
                }

                // Crea un oggetto Bottone per il pulsante "Visualizza"
                const bottone: Bottone = {
                  testo: "Visualizza",
                  title: "Visualizza " + film.titolo,
                  icona: 'icona-default', // Aggiungi un'icona di default se non presente
                  tipo: "button",
                  emitId: null,
                  link: "/filmVideo/" + film.idFilm
                }

                // Crea un oggetto Card per il film corrente e lo aggiunge all'array films
                const card: Card = {
                  immagine: tmpImg,
                  // descrizione: film.descrizione || '', 
                  descrizione: null,
                  // titolo: film.titolo,
                  titolo: null,
                  bottone: bottone
                }
                this.films.push(card);
              } else {
                console.log(`Nessun file immagine trovato per il film: ${film.titolo}`);
              }
            } else {
              console.log(`Nessun file associato al film: ${film.titolo}`);
            }
          }
        } else {
          console.log("L'array 'data' è vuoto o indefinito.");
        }
      },
      error: (err: any) => console.error("Errore", err),
      complete: () => { console.log("%c COMPLETATO", "color:#00AA00") }
    }
  }

}
