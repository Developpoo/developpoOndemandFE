import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/_types/Card.type';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Observable, Observer, concatMap, delay, map, of } from 'rxjs';
import { CategoryFile } from 'src/app/_types/CategoryFile.type';
import { File } from 'src/app/_types/File.type';
import { Bottone } from 'src/app/_types/Bottone.type';

@Component({
  selector: 'app-genere',
  templateUrl: './genere.component.html',
  styleUrls: ['./genere.component.scss']
})
export class GenereComponent implements OnInit {

  generi: Card[] = []; // Un array per immagazzinare i dati dei generi
  error: string = ''; // Variabile per gestire gli errori
  cat: any; // Contiene i dati dei generi
  file: any; // Contiene i dati dei file
  dati: any; // Contiene i dati combinati dei generi e dei file
  cat$: Observable<IRispostaServer>

  constructor(private api: ApiService) {
    this.cat$ = this.dati
  }

  ngOnInit(): void {
    const oss: Observer<any> = {
      next: (rit) => {
        this.dati = rit;
        console.log(this.dati);
        // Aggiungi qui la logica per gestire i dati ottenuti, se necessario
      },
      error: (err) => {
        console.error(err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => console.log("Completo")
    }

    const obs$: Observable<any> = this.getGeneri()
      .pipe(
        map((ris) => {
          this.cat = ris.data;
          return ris
        }),
        concatMap((ris: IRispostaServer, index: number): Observable<IRispostaServer> => {
          return this.getFile()
        }),
        map((ris) => {
          this.file = ris.data;
          let dati: CategoryFile[] = []
          for (let i = 0; i < ris.data.length; i++) {
            const item = ris.data[i]
            const obj = this.cat?.find((elemento: { id: number; }) => elemento.id === item.idCat)
            const tmp: CategoryFile = {
              idFile: item.idFile,
              nome: item.nome,
              idCategory: obj
            }
            dati.push(tmp);
          }
          return dati;
        })
      );

    obs$.subscribe(oss);

    this.cat$.pipe(
      delay(1000)
    ).subscribe(this.osservoCat())
  }

  getGeneri(): Observable<IRispostaServer> {
    return this.api.getGeneri();
  }

  getFile(): Observable<IRispostaServer> {
    return this.api.getFile();
  }

  //########################################
  // Observer
  //########################################

  private osservoCat() {
    return {
      next: (rit: IRispostaServer) => {
        console.log("NEXT", rit)
        const elementi = rit.data
        for (let i = 0; i < elementi.length; i++) {
          // const tmpImg: Immagine = elementi[i].img
          const tmpImg: File = {
            idFile: elementi[i].idFile,
            idTipo: 1,
            src: elementi[i].src,
            alt: elementi[i].alt,
            title: elementi[i].title,
            nome: '',
            descrizione: '',
            formato: ''
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
          this.generi.push(card)
        }
      },
      error: (err: any) => {
        console.error("ERRORE", err)
      },
      complete: () => { console.log("%c COMPLETATO", "color:#00AA00") }
    }
  }
}