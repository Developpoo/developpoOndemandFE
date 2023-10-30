import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from 'src/app/_types/Auth.type';
import { BehaviorSubject, Observable, Subject, catchError, concatMap, map, of, take, takeUntil, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { ApiService } from 'src/app/_servizi/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormVisibilityService } from 'src/app/_servizi/formVisibility.service';
import { Genere } from 'src/app/_types/Genere.type';
import { CategoryFile } from 'src/app/_types/CategoryFile.type';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';

@Component({
  selector: 'app-database-modal-genere',
  templateUrl: './database-modal-genere.component.html',
  styleUrls: ['./database-modal-genere.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class DatabaseModalGenereComponent implements OnInit, OnDestroy {


  // OSSERVATORE
  private osservatore = {
    next: (ritorno: IRispostaServer) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  }

  // Variabile per gestire gli errori
  error: string = '';
  dati!: CategoryFile[];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    public formVisibilityService: FormVisibilityService
  ) { }

  private distruggi$ = new Subject<void>();
  // Observable per ottenere i dati dei Generi dal server
  categoryDB$!: Observable<IRispostaServer>;

  // FORM PRECOMPILAZIONE
  // GENERE
  registrationFormCategory: FormGroup = new FormGroup({
    nome: new FormControl(''),
    icona: new FormControl(''),
    watch: new FormControl(''),
    src: new FormControl(''),
    alt: new FormControl(''),
    title: new FormControl(''),
  });
  // stoControllando: boolean = false;
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  isRegistrationActive: boolean = false
  isRegistrationActiveModifica: boolean = false
  PasswordValidator: boolean = false
  isRegistrationComplete: boolean = false



  ngOnInit(): void {
    // AGGIUNGI GENERE e FILE
    // Registration Form
    this.registrationFormCategory = this.fb.group({
      idCategory: new FormControl(null), // <-- Aggiungi questa linea
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      icona: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      watch: [null, [Validators.required]],
      src: [null, [Validators.required]],
      alt: [null, [Validators.required]],
      title: [null, [Validators.required]],
    });


    let obs$ = this.formVisibilityService.getRowId();
    obs$.subscribe((n) => { if (n !== null) { this.chiamaGenere(n) } });


    // const idCategory = this.route.snapshot.params['idCategory'];
    // if (idCategory) {
    //   this.precompilaForm(idCategory);
    // }
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  chiamaGenere(id: number) {
    this.categoryDB$ = this.api.getGenere(id).pipe(
      catchError((err) => {
        console.error(err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
        return of(null); // Emetti un valore di fallback anziché lanciare un'eccezione
      }),
      concatMap((catData: IRispostaServer | null) => {
        if (!catData || !catData.data || !catData.data.idFile) {
          console.error('Data del genere non valida o manca idFile');
          return of(null); // Emetti un valore di fallback in caso di dati non validi
        }

        const idFile = catData.data.idFile;

        if (idFile === undefined) {
          console.error('Manca idFile');
          return of(null); // Emetti un valore di fallback
        }

        // Questa parte viene eseguita solo se idFile esiste
        return this.getSingleFile(idFile).pipe(
          tap((fileData) => {
            console.log("Dati restituiti da getSingleFile:", fileData);
          }),
          map((fileData) => {
            let catDataJson, fileDataJson;
            try {
              catDataJson = JSON.parse(JSON.stringify(catData));
              fileDataJson = JSON.parse(JSON.stringify(fileData));
            } catch (e) {
              console.error("Errore durante la conversione in JSON:", e);
              throw e;
            }
            try {
              console.log("Contenuto completo di catData:", catData);
              console.log("Contenuto di fileData prima della combinazione:", fileDataJson.data);
              console.log("Contenuto di catData prima della combinazione:", catData.data.generi);
              if (catData.data) {
                console.log("Contenuto di catData prima della combinazione:", catData.data.generi);
              } else {
                console.log("catData.data è undefined");
              }
              const combinedData = this.combinaDatiCategory(catDataJson.data, fileDataJson);
              if (combinedData) {
                this.dati = [combinedData];
              } else {
                console.error("Errore nella combinazione dei dati. Nessun dato combinato ottenuto.");
              }


            } catch (e) {
              console.error("Errore durante la combinazione dei dati:", e);
              throw e;
            }


            return catDataJson;
          })
        );
      })
    );

    this.categoryDB$.subscribe({
      next: (response: IRispostaServer | null): void => {
        if (response !== null) {
          console.log('NEXT HTTP:', response);
          console.log('NEXT Generi:', this.dati);
        }
      },
      error: (err: any) => {
        console.error('ERRORE', err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => console.log('Completo')
    });
  }




  // Registra un genere
  registraGenere(): void {
    if (this.registrationFormCategory.invalid === true) {
      console.log('Form di registrazione genere non valido', this.registrationFormCategory);
      this.isRegistrationComplete = false
      return;
    } else {
      console.log('Form di registrazione valido', this.registrationFormCategory);
      const parametro: CategoryFile = {
        nome: this.registrationFormCategory.controls['nome'].value,
        icona: this.registrationFormCategory.controls['icona'].value,
        watch: this.registrationFormCategory.controls['watch'].value || null,
        idTipoFile: 1,
        src: this.registrationFormCategory.controls['src'].value,
        alt: this.registrationFormCategory.controls['alt'].value,
        title: this.registrationFormCategory.controls['title'].value,
      }

      // Chiama il metodo per creare un file e una categoria
      this.creaFileECategory(parametro).subscribe(this.osservatore);
      this.isRegistrationComplete = true
    }
  }

  /**
 * Metodo per creare un file e una categoria.
 *
 * @param parametri - I dettagli del file e della categoria da creare.
 * @returns Observable con la risposta del server.
 */
  creaFileECategory(parametri: CategoryFile): Observable<IRispostaServer> {
    // Estrai i parametri specifici per il file
    const parametriFile = {
      idTipoFile: 1,
      nome: 'imgGenere', //da capire perchè non mi torna il campo nome nella tabella file
      // nome: parametri.nome,
      src: parametri.src,
      alt: parametri.alt,
      title: parametri.title
    };

    // Prima crea un nuovo file
    return this.api.postFile(parametriFile).pipe(
      concatMap((rispostaFile) => {
        // Assumendo che la risposta dal server includa l'idFile creato
        const idFileCreato = rispostaFile.data.idFile;

        // Adatta i parametri per la creazione della categoria
        const parametriCategory = {
          ...parametri,
          idFile: idFileCreato
        };

        // Poi crea una nuova categoria usando l'idFile restituito
        return this.api.postRegistrazioneGenere(parametriCategory);
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

  // Metodo per ottenere i dati dei genere da un'API
  getGenere(idCategory: number): Observable<IRispostaServer> {
    return this.api.getGenere(idCategory).pipe(
      tap((catData) => {
        console.log("Risposta da getGenere:", catData);
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

  getSingleFile(idFile: number): Observable<IRispostaServer> {
    return this.api.getSingleFile(idFile).pipe(
      tap((response) => {
        console.log("Risposta HTTP per getSingleFile:", response);
      })
    );
  }


  /**
   * Metodo per combinare i dati dei generi e dei file.
   *
   * @param catData - Oggetto di tipo Genere.
   * @param fileData - Oggetto di tipo file.
   * @returns Oggetto combinato di generi e file.
   */
  private combinaDatiCategory(catData: Genere, fileData: any): CategoryFile | null {
    if (!catData || !fileData || !fileData.data) {
      console.error("Dati mancanti per la combinazione.");
      return null;
    }

    if (catData.idFile !== fileData.data.idFile) {
      console.error("ID dei file non corrispondenti.");
      return null;
    }

    const datiCombinatiCategory: CategoryFile = {
      idFile: fileData.data.idFile,
      nome: catData.nome,
      idCategory: catData.idCategory,
      src: fileData.data.src,
      alt: fileData.data.alt,
      title: fileData.data.title,
      icona: catData.icona,
      watch: catData.watch,
    };

    console.log("stampa datiCombinatiCategory", datiCombinatiCategory);
    return datiCombinatiCategory;
  }


  attivaForm() {
    this.formVisibilityService.setFormVisibilityCategory();
  }

  // Attiva il form di registrazione
  attivaRegistrazione(): void {
    this.isRegistrationActive = true;
  }

  // Disattiva il form di registrazione
  disattivaRegistrazione(): void {
    this.isRegistrationActive = false;
  }

  /**
 * Metodo per modificare un genere e un file esistenti.
 *
 * @param idCategory - ID del genere da modificare.
 * @param parametri - I nuovi dettagli del genere e del file.
 * @returns Observable con la risposta del server.
 */
  modificaGenereEFile(idCategory: number, parametri: Omit<CategoryFile, 'idFile'>): Observable<IRispostaServer> {
    return this.api.getGenere(idCategory).pipe(
      concatMap((rispostaCategoria) => {
        if (!rispostaCategoria.data.idFile) {
          throw new Error('idFile non presente nella rispostaCategoria');
        }

        const idFile = rispostaCategoria.data.idFile.toString();

        const parametriFile = {
          nome: 'imgGenere',
          src: parametri.src,
          alt: parametri.alt,
          title: parametri.title
        };

        return this.api.putFile(idFile, parametriFile).pipe(
          concatMap(() => {
            const parametriGenere = {
              ...parametri,
              idFile: parseInt(idFile),
              idCategory: idCategory  // Non convertirlo in stringa
            };

            return this.api.putGenere(idCategory.toString(), parametriGenere);
          })
        );
      })
    );
  }

  inviaModificaGenere(): void {
    if (this.registrationFormCategory.invalid) {
      console.log('Form di modifica non valido', this.registrationFormCategory);
      return;
    } else {
      const idCategory = this.registrationFormCategory.controls['idCategory'].value;
      const parametro: Omit<CategoryFile, 'idFile'> = {
        nome: this.registrationFormCategory.controls['nome'].value,
        icona: this.registrationFormCategory.controls['icona'].value,
        watch: this.registrationFormCategory.controls['watch'].value || null,
        idTipoFile: 1,
        src: this.registrationFormCategory.controls['src'].value,
        alt: this.registrationFormCategory.controls['alt'].value,
        title: this.registrationFormCategory.controls['title'].value
      };

      this.modificaGenereEFile(idCategory, parametro).subscribe(this.osservatore);
    }
  }

  precompilaForm(id: number): void {
    this.categoryDB$ = this.api.getGenere(id).pipe(
      tap((catData) => {
        if (!catData || !catData.data || !catData.data.idFile) {
          throw new Error('Data del genere non valida o manca idFile');
        }
      }),
      concatMap((catData) => {
        const idFile = catData.data.idFile;
        if (idFile === undefined) {
          console.error("Manca idFile");
          return of(null); // questo è un Observable vuoto
        }

        return this.getSingleFile(idFile).pipe(
          map((fileData) => {
            let catDataJson, fileDataJson;
            try {
              catDataJson = JSON.parse(JSON.stringify(catData));
              fileDataJson = JSON.parse(JSON.stringify(fileData));
            } catch (e) {
              console.error("Errore durante la conversione in JSON:", e);
              throw e;
            }

            const combinedData = this.combinaDatiCategory(catDataJson.data, fileDataJson);
            if (combinedData) {
              this.registrationFormCategory.patchValue({
                idCategory: combinedData.idCategory,
                nome: combinedData.nome,
                icona: combinedData.icona,
                watch: combinedData.watch,
                src: combinedData.src,
                alt: combinedData.alt,
                title: combinedData.title
              });
            } else {
              console.error("Errore nella combinazione dei dati. Nessun dato combinato ottenuto.");
            }

            return catDataJson;
          })
        );
      }),
      catchError((err) => {
        console.error(err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
        return throwError(err);
      })
    );

    this.categoryDB$.subscribe({
      next: (response: IRispostaServer): void => {
        console.log("NEXT HTTP:", response);
      },
      error: (err: any) => {
        console.error("ERRORE", err);
        this.error = 'Errore durante la richiesta API: ' + err.message;
      },
      complete: () => console.log("Completo")
    });
  }

  //---------------------------------------------------------------------------------------------------------------
  // Restituisce i controlli del form di registrazione
  get f(): { [key: string]: AbstractControl } {
    return this.registrationFormCategory.controls;
  }


}
