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


// export function inizioApp(configService: AppConfigService) {

//   return () => new Observable((subscriber) => {
//     configService.caricaJSON().pipe(
//       map(valore => {
//         AppConfigService.settings = <IAppConfig>valore;
//         return valore;
//       }),
//       concatMap(() => {
//         const apinConf$ = apiConfigurazione(configService);
//         const apiLng$ = apiLingue(configService);
//         const apiContattiRuoli$ = apiContattiRuoli(configService);
//         const apiContattiStati$ = apiContattiStati(configService);
//         const apiTipiIndirizzi$ = apiTipiIndirizzi(configService);
//         const apiTipiRecapiti$ = apiTipiRecapiti(configService);
//         const apiTraduzioni$ = apiTraduzioni(configService);
//         return combineLatest([apinConf$,apiLng$, apiContattiRuoli$, apiContattiStati$, apiTipiIndirizzi$, apiTipiRecapiti$, apiTraduzioni$ ]);


//       })
//     ).subscribe({
//       next: () => {
//         subscriber.complete();
//       },
//       error: (err) => { console.error(err) },
//       complete: () => { }
//     });
//   });
// }


// // [
// cat: {
//   idCat:...
//   nome:...
//   file[è
//   ]


// }
// ]


// import { from, of } from 'rxjs';
// import { concatMap, delay } from 'rxjs/operators';

// // Simuliamo una funzione che esegue una chiamata HTTP ritardata
// function fetchData(url) {
//   // Simuliamo una chiamata HTTP con un ritardo casuale
//   const delayTime = Math.random() * 2000;
//   return of(`Dati da ${url}`).pipe(delay(delayTime));
// }

// // Esempio di concatenazione di tre operazioni utilizzando concatMap
// const urls = ['api/endpoint1', 'api/endpoint2', 'api/endpoint3'];

// from(urls)
//   .pipe(
//     concatMap(url => fetchData(url)),
//     concatMap(result => {
//       // Esegui un'altra operazione utilizzando il risultato precedente
//       const modifiedResult = `Modificato: ${result}`;
//       return of(modifiedResult).pipe(delay(1000)); // Simula un altro ritardo
//     }),
//     concatMap(finalResult => {
//       // Esegui un'altra operazione utilizzando il risultato modificato
//       const additionalOperation = `Aggiuntivo: ${finalResult}`;
//       return of(additionalOperation);
//     })
//   )
//   .subscribe(data => {
//     console.log(data);
//   });