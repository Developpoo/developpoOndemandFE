import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, concatMap, delay, map, switchMap, takeUntil, tap } from 'rxjs';
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

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recuperaDati().subscribe(this.osservoFilms())
  }

  ngOnDestroy(): void {
    this.distruggi$.next()
  }

  private recuperaDati(): Observable<IRispostaServer> {
    console.log("ROUTE", this.route.params)
    return this.route.params.pipe(
      map(x => x['id']),
      tap(x => console.log("%c Recupero ID " + x, "color:0000AA")),
      concatMap((x: string, index: number): Observable<IRispostaServer> => {
        return this.api.getFilmsDaGenere(+(x))
        // return this.api.getFilmsFile()
      }),
      takeUntil(this.distruggi$)
    )
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

            const tmpImg: Immagine = {
              idFile: elementi[i].idFile,
              src: elementi[i].src,
              alt: elementi[i].alt,
              title: elementi[i].title
            }
            const bottone: Bottone = {
              testo: "Visualizza",
              title: "Visualizza " + elementi[i].nome,
              icona: elementi[i].icona,
              tipo: "button",
              emitId: null,
              link: "/genere/" + elementi[i].idFilm
            }
            const card: Card = {
              immagine: tmpImg,
              descrizione: elementi[i].descrizione,
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