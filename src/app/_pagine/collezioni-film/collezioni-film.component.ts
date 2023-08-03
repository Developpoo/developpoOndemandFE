import { Component, OnInit } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Bottone } from 'src/app/_types/Bottone.type';
import { Card } from 'src/app/_types/Card.type';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-collezioni-film',
  templateUrl: './collezioni-film.component.html',
  styleUrls: ['./collezioni-film.component.scss']
})
export class CollezioniFilmComponent implements OnInit {

  categorie: Card[] = []
  cat$: Observable<IRispostaServer>

  constructor(private api: ApiService) {
    this.cat$ = this.api.getGeneri()
  }

  ngOnInit(): void {
    this.cat$.pipe(
      delay(1000)
    ).subscribe(this.osservoCat())
  }

  //########################################
  // Observer
  //########################################

  private osservoCat() {
    return {
      next: (rit: IRispostaServer) => {
        // console.log("NEXT", rit)
        const elementi = rit.data
        for (let i = 0; i < elementi.length; i++) {
          // const tmpImg:Immagine=elementi[1].img // se non ci fosse un fake DB si sarebbe adoperato questa stringa
          const tmpImg: Immagine = {
            src: elementi[i].img.src,
            alt: elementi[i].img.alt
          }
          const bott: Bottone = {
            testo: "Visualizza",
            title: "Visualizza " + elementi[i].nome,
            icona: null,
            tipo: "button",
            emitId: null,
            link: "/collezioni/elenco/" + elementi[i].id
          }
          const card: Card = {
            immagine: tmpImg,
            descrizione: '',
            titolo: elementi[i].nome,
            bottone: bott
          }
          this.categorie.push(card)
        }
      },
      error: (err: any) => {
        console.error("ERRORE", err)
      },
      complete: () => { console.log("%c COMPLETATO", "color:#00AA00") }
    }
  }
}