import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/_types/Card.type';
import { catchError, concatMap } from 'rxjs/operators';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-genere',
  templateUrl: './genere.component.html',
  styleUrls: ['./genere.component.scss']
})
export class GenereComponent implements OnInit {


  generi: Card[] = [];
  error: string = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getGeneri()
      .pipe(
        concatMap((generiResponse: IRispostaServer) => {
          return this.api.getFile()
            .pipe(
              concatMap((fileResponse: IRispostaServer) => {
                const generiData = generiResponse.data;
                const fileData = fileResponse.data;
                console.log('generiData:', generiData);
                console.log('fileData:', fileData);


                const cards: Card[] = [];

                for (let i = 0; i < generiData.length; i++) {
                  const genere = generiData[i];
                  const idFile = genere.idFile;

                  const file = fileData.find((item: { idFile: number; }) => item.idFile === idFile);

                  if (file !== null) {
                    const card: Card = {
                      immagine: {
                        idFile: file.idFile,
                        src: file.src,
                        alt: file.alt,
                        title: file.title
                      },
                      titolo: genere.nome,
                      descrizione: '',
                      bottone: {
                        testo: "Visualizza",
                        title: "Visualizza",
                        icona: genere.icona,
                        tipo: "button",
                        emitId: null,
                        link: "/genere/" + genere.idCategory
                      }
                    };
                    cards.push(card);
                  }
                }
                return cards;
              }),
              catchError(error => {
                this.error = 'PD0001 Errore durante il recupero dei dati: ' + error.message;
                return throwError(() => new Error(this.error));
              })
            );
        }),
        catchError(error => {
          this.error = 'PD0002 Errore durante il recupero dei dati: ' + error.message;
          return throwError(() => new Error(this.error));
        })
      )
      .subscribe({
        next: (cards: Card) => {
          const generiArray: Card[] = [cards];
          this.generi = generiArray;
        },
        error: (error) => {
          console.error('PD0003 Errore durante la richiesta API:', error);
        }
      });
  }
}