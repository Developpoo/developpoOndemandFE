import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, concatMap, delay, map, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/_types/Card.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit, OnDestroy {

  idFilm: string | null
  films: Card[] = []
  elem$!: Observable<IRispostaServer>
  private distruggi$ = new Subject<void>()

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.idFilm = this.route.snapshot.paramMap.get("idFilm")
    if (this.idFilm !== null) {
      this.elem$ = this.api.getFilmsDaGenere(parseInt(this.idFilm))
    }
  }

  ngOnInit(): void {
    this.elem$.pipe(
      delay(1000),
      tap(x => console.log("TAP", x))
    ).subscribe(this.osservoFilms())


    // this.recuperaDati().pipe(
    //   delay(1000)
    // ).subscribe(this.osservoFilms())
  }

  ngOnDestroy(): void {
    // this.distruggi$.next()
  }

  private recuperaDati(): Observable<IRispostaServer> {
    return this.route.params.pipe(
      map(x => x['idFilm']),
      tap(x => console.log("%c Recupero ID " + x, "color:0000AA")),
      concatMap((x: string, index: number): Observable<IRispostaServer> => {
        return this.api.getFilmsDaGenere(parseInt(x))
      }),
      takeUntil(this.distruggi$)
    )
  }

  //########################################
  // Observer
  //########################################

  private osservoFilms() {
    return {
      next: (rit: IRispostaServer) => {
        this.films = []
        const elementi = rit.data
        for (let i = 0; i < elementi.length; i++) {
          const tmpImg: Immagine = {
            src: elementi[i].img.src,
            alt: elementi[i].img.alt
          }
          const card: Card = {
            immagine: tmpImg,
            descrizione: elementi[i].descrizione,
            titolo: elementi[i].titolo,
            bottone: undefined
          }
          this.films.push(card)
        }
      },
      error: (err: any) => console.error("Errore", err),
      complete: () => { console.log("%c COMPLETATO", "color:#00AA00") }
    }
  }
}
