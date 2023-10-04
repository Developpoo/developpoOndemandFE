// Import delle librerie e dei moduli necessari
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from 'src/app/_servizi/api.service';
import { IPeriodicElement } from 'src/app/_interfacce/IPeriodicElement.interface';
import { Observable, catchError, concatMap, forkJoin, map, tap, throwError } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { UserClientAuthPassword } from 'src/app/_types/UserClientAuthPassword.type';
import { UserAuth } from 'src/app/_types/UserAuth.type';
import { UserClient } from 'src/app/_types/UserClient.type';
import { UserPassword } from 'src/app/_types/UserPassword.type';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
  standalone: true,
  imports: [MatTabsModule, MatIconModule, MatTableModule, MatPaginatorModule],
})
export class DatabaseComponent implements AfterViewInit, OnInit {
  // Definizione delle colonne da visualizzare nella tabella
  displayedColumns: string[] = ['idUserAuth', 'nome', 'cognome', 'sesso', 'codiceFiscale', 'user', 'password'];

  // Creazione di una sorgente dati per la tabella
  dataSource = new MatTableDataSource<IPeriodicElement>([]);

  // Variabile per gestire gli errori
  error: string = '';

  // Observable per ottenere i dati degli utenti dal server
  utentiDB$!: Observable<IRispostaServer>;

  // Riferimento alla paginazione della tabella
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) { }

  // Questo metodo viene chiamato dopo che la vista è stata inizializzata
  ngAfterViewInit() {
    console.log('ngAfterViewInit is called');

    // Associa il paginatore alla sorgente dati della tabella
    this.dataSource.paginator = this.paginator;
  }

  // Questo metodo viene chiamato quando il componente è inizializzato
  ngOnInit(): void {
    console.log('ngOnInit is called');

    // Ottieni i dati degli utenti dal server e gestisci gli errori se si verificano
    this.getUserData().pipe(
      concatMap((data) => {
        const utentiDB = this.combinaDati(data);
        this.dataSource.data = utentiDB; // Assegna i dati combinati alla sorgente dati della tabella
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

  // Metodo per combinare i dati 
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
          user: utenteJSON.user,
          nome: fileCorrispondente.nome,
          cognome: fileCorrispondente.cognome,
          sesso: fileCorrispondente.sesso,
          codiceFiscale: fileCorrispondente.codiceFiscale,
          password: passwordData.find((password: UserPassword) => password.idUserClient === fileCorrispondente.idUserClient)?.password || ''
        });
      }
    }

    // Visualizza i dati combinati
    console.log("datiCombinati:", datiCombinati);
    return datiCombinati;
  }

}
