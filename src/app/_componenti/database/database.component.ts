// Import delle librerie e dei moduli necessari
import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from 'src/app/_servizi/api.service';
import { IPeriodicElement } from 'src/app/_interfacce/IPeriodicElement.interface';
import { Observable, Subject, catchError, concatMap, forkJoin, map, takeUntil, tap, throwError } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { UserAuth } from 'src/app/_types/UserAuth.type';
import { UserClient } from 'src/app/_types/UserClient.type';
import { UserPassword } from 'src/app/_types/UserPassword.type';
import { CategoryFile } from 'src/app/_types/CategoryFile.type';
import { Genere } from 'src/app/_types/Genere.type';
import { ActivatedRoute } from '@angular/router';
import { IRispostaFilm } from 'src/app/_interfacce/IRispostaFilm.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
  standalone: true,
  imports: [MatTabsModule, MatIconModule, MatTableModule, MatPaginatorModule, CommonModule],
})
export class DatabaseComponent implements AfterViewInit, OnInit, OnDestroy {
  // Definizione delle colonne da visualizzare nella tabella Utenti
  displayedColumnsUtenti: string[] = ['idUserAuth', 'nome', 'cognome', 'idUserStatus', 'idLingua', 'sesso', 'codiceFiscale', 'idNazione', 'idComune', 'dataNascita', 'accettaTermini', 'user', 'password'];
  // Definizione delle colonne da visualizzare nella tabella Category
  displayedColumnsCategory: string[] = ['idCategory', 'idFile', 'nome', 'src', 'alt', 'title', 'icona', 'watch',];
  // Definizione delle colonne da visualizzare nella tabella Film
  displayedColumnsFilm: string[] = [
    'idFilm',
    'titolo',
    'descrizione',
    'durata',
    'regista',
    'attori',
    'icona',
    'anno',
    'watch',
    'idFile1',
    'idTipoFile1',
    'src1',
    'alt1',
    'title1',
    'idFile2',
    'idTipoFile2',
    'src2',
    'alt2',
    'title2'
  ];



  // Creazione di una sorgente dati per la tabella Utenti
  dataSourceUtente = new MatTableDataSource<IPeriodicElement>([]);
  // Creazione di una sorgente dati per la tabella Category
  dataSourceCategory = new MatTableDataSource<CategoryFile>([]);
  // Creazione di una sorgente dati per la tabella Film
  dataSourceFilm = new MatTableDataSource<IRispostaFilm>([]);

  // Observable per ottenere i dati degli utenti dal server
  utentiDB$!: Observable<IRispostaServer>;
  // Observable per ottenere i dati dei Generi dal server
  categoryDB$!: Observable<IRispostaServer>;

  // Variabile per gestire gli errori
  error: string = '';

  private distruggi$ = new Subject<void>()
  dati!: CategoryFile[];
  films: any[] = [];

  // Riferimento alla paginazione della tabella Utenti
  @ViewChild('paginatorUtente') paginatorUtente!: MatPaginator;
  // Riferimento alla paginazione della tabella Generi
  @ViewChild('paginatorCategory') paginatorCategory!: MatPaginator;
  // Riferimento alla paginazione della tabella Films
  @ViewChild('paginatorFilm') paginatorFilm!: MatPaginator;



  constructor(private api: ApiService, private route: ActivatedRoute,) { }

  ngAfterViewInit() {
    console.log('ngAfterViewInit is called');

    // Associa il paginatore alla sorgente dati della tabella utente
    this.dataSourceUtente.paginator = this.paginatorUtente;
    // Associa il paginatore alla sorgente dati della tabella Generi
    this.dataSourceCategory.paginator = this.paginatorCategory;
    // Associa il paginatore alla sorgente dati della tabella Films
    this.dataSourceFilm.paginator = this.paginatorFilm;
  }

  // Questo metodo viene chiamato quando il componente è inizializzato
  ngOnInit(): void {
    console.log('ngOnInit is called');

    // UTENTI #########################################
    // Ottieni i dati degli utenti dal server e gestisci gli errori se si verificano
    this.getUserData().pipe(
      concatMap((data) => {
        const utentiDB = this.combinaDati(data);
        this.dataSourceUtente.data = utentiDB; // Assegna i dati combinati alla sorgente dati della tabella
        return this.api.getUserPassword().pipe(
          map((passwordData) => passwordData)
        );
      }),
      catchError((error) => {
        // Gestisci gli errori e assegna un messaggio di errore
        console.error(error);
        this.error = 'Errore durante la richiesta API: ' + error.message;
        return throwError(error);
      })
    ).subscribe(() => {
      // La sorgente dati della tabella è stata aggiornata con successo
    });

    // CATEGORY #########################################
    // Concatena le chiamate API e gestisci gli errori 
    this.categoryDB$ = this.getGeneri().pipe(
      concatMap((catData) => {
        return this.getFile().pipe(
          map((fileData) => {
            try {
              // Verifica la validità JSON
              const catDataJson = JSON.parse(JSON.stringify(catData));
              const fileDataJson = JSON.parse(JSON.stringify(fileData));

              // Combina i dati
              this.dati = this.combinaDatiCategory(catDataJson.data, fileDataJson.data);

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
    this.categoryDB$.subscribe({
      next: (response: IRispostaServer): void => {
        console.log("NEXT HTTP:", response);
        // Continua con l'analisi dei dati
        // Assicurati che l'array datiCombinatiCategory sia popolato
        console.log("NEXT Generi:", this.dati);

        // Assegna l'array datiCombinatiCategory a dataSourceCategory
        this.dataSourceCategory.data = this.dati;
      },
      error: (err: any) => {
        console.error("ERRORE", err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => console.log("Completo")
    });

    // FILMS #########################################
    this.getFilmsFile().subscribe({
      next: (response: IRispostaServer) => {
        this.osservoFilms()(response); // Chiamare la funzione osservoFilms e passare la risposta
      },
      error: (err: any) => {
        console.error("Errore", err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => {
        console.log("%c COMPLETATO", "color:#00AA00");
      },
    });



  }

  // Questo metodo viene chiamato quando il componente è terminato
  ngOnDestroy(): void {
    this.distruggi$.next()
  }

  // Metodo per ottenere tutti i dati necessari da tutte e tre le API
  getUserData(): Observable<any> {
    console.log('getUserData is called');

    // Ottieni i dati dall'API 
    const authData$ = this.api.getUserAuth();
    const clientData$ = this.api.getUserClient();
    const passwordData$ = this.api.getUserPassword();

    // Utilizza forkJoin per ottenere i dati da tutte e tre le fonti contemporaneamente
    return forkJoin({
      authData: authData$,
      clientData: clientData$,
      passwordData: passwordData$
    }).pipe(
      map((data) => {
        // Visualizza i dati ottenuti dalle tre API
        console.log('Data from getUserAuth:', data.authData);
        console.log('Data from getUserClient:', data.clientData);
        console.log('Data from getUserPassword:', data.passwordData);
        console.log("DATA: ", data)
        return data;
      })
    );
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

  // Metodo per ottenere i dati dei film con i file allegati
  getFilmsFile(): Observable<IRispostaServer> {
    return this.api.getFilmsFile().pipe(
      tap((response) => {
        console.log("Risposta HTTP per Generi:", response, (response.data && response.data.films && response.data.films.length > 0));

        if (response.data && response.data.films && response.data.films.length > 0) {
          // Assegna i dati dei film all'array films
          this.films = response.data.films;
        } else {
          console.error("L'array 'films' è vuoto o indefinito nella risposta HTTP.");
        }
      }),
      catchError((error) => {
        console.error("Errore durante la richiesta API:", error);
        // Puoi gestire l'errore qui o lanciare un errore personalizzato
        return throwError("Errore durante la richiesta API");
      })
    );
  }




  // Metodo per combinare i dati utente
  private combinaDati(data: any): IPeriodicElement[] {
    console.log('combinaDati is called');
    const authData: UserAuth[] = data.authData.data; // Accedi all'array di authData
    const clientData: UserClient[] = data.clientData.data; // Accedi all'array di clientData
    const passwordData: UserPassword[] = data.passwordData.data; // Accedi all'array di passwordData

    // Implementa la logica per combinare i dati e creare un array di IPeriodicElement
    const datiCombinati: IPeriodicElement[] = [];

    // Esempio di implementazione: associa i dati in base all'ID utente
    for (const utenteJSON of authData) {
      const fileCorrispondente = clientData.find((client: UserClient) => client.idUserClient === utenteJSON.idUserClient);
      if (fileCorrispondente) {
        datiCombinati.push({
          idUserAuth: utenteJSON.idUserAuth,
          nome: fileCorrispondente.nome,
          cognome: fileCorrispondente.cognome,
          idUserStatus: fileCorrispondente.idUserStatus,
          idLingua: fileCorrispondente.idLingua,
          sesso: fileCorrispondente.sesso,
          codiceFiscale: fileCorrispondente.codiceFiscale,
          idNazione: fileCorrispondente.idNazione,
          idComune: fileCorrispondente.idComune,
          dataNascita: fileCorrispondente.dataNascita,
          accettaTermini: fileCorrispondente.accettaTermini,
          user: utenteJSON.user,
          password: passwordData.find((password: UserPassword) => password.idUserClient === fileCorrispondente.idUserClient)?.password || ''
        });
      }
    }

    // Visualizza i dati combinati
    console.log("datiCombinati:", datiCombinati);
    return datiCombinati;
  }

  // Metodo per combinare i dati dei generi e dei file
  private combinaDatiCategory(catData: Genere[], fileData: any[]): CategoryFile[] {
    const datiCombinatiCategory: CategoryFile[] = [];
    for (const categoria of catData) {
      const fileCorrispondente = fileData.find((file) => file.idFile === categoria.idFile);
      if (fileCorrispondente) {
        datiCombinatiCategory.push({
          idFile: fileCorrispondente.idFile,
          nome: categoria.nome,
          idCategory: categoria.idCategory,
          src: fileCorrispondente.src,
          alt: fileCorrispondente.alt,
          title: fileCorrispondente.title,
          icona: categoria.icona,
          watch: categoria.watch,
        });
      }
    }
    console.log("stampa datiCombinatiCategory", datiCombinatiCategory);
    return datiCombinatiCategory;
  }

  //########################################
  // Observer FILMS
  //########################################
  private osservoFilms() {
    return (response: IRispostaServer) => {
      console.log("Funzione 'osservoFilms' chiamata con la risposta", response);

      // Verifica se 'films' esiste e ha una lunghezza prima di iterare
      if (response.data && response.data.length > 0) {
        const films: IRispostaFilm[] = response.data.map((filmData: any) => {
          console.log("Dati del film:", filmData);

          const film: IRispostaFilm = {
            idFilm: filmData.idFilm,
            titolo: filmData.titolo,
            descrizione: filmData.descrizione,
            durata: filmData.durata,
            regista: filmData.regista,
            attori: filmData.attori,
            icona: filmData.icona,
            anno: new Date(filmData.anno),
            watch: filmData.watch,
            file: filmData.files.map((file: any) => {
              console.log("Dati del file:", file);

              return {
                idFile: file.idFile,
                idTipoFile: file.idTipoFile,
                src: file.src,
                alt: file.alt,
                title: file.title,
                descrizione: file.descrizione || '', // Assicurati che questo campo sia presente nella risposta API
                formato: file.formato || '', // Assicurati che questo campo sia presente nella risposta API
              };
            })
          };

          console.log("Film completo:", film);
          return film;
        });

        console.log("Array di films:", films);
        this.films = films; // Assegna i dati dei film alla variabile 'films'
        this.dataSourceFilm.data = this.films; // Aggiorna la sorgente dati della tabella dei film
      } else {
        console.log("L'array 'films' è vuoto o indefinito nella risposta HTTP.");
      }
    };
  }

}
