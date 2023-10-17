import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { BehaviorSubject, Observable, Observer, Subject, catchError, concatMap, delay, forkJoin, map, of, take, takeUntil, tap, throwError } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Nazione } from 'src/app/_types/Nazione.type';
import { Comune } from 'src/app/_types/Comune.type';
import { Lingua } from 'src/app/_types/Lingua.type';
import { ParametriSaveAuth } from 'src/app/_types/ParametriSaveAuth.type';
import { AuthService } from 'src/app/_servizi/auth.service';
import { ApiService } from 'src/app/_servizi/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordUgualiValidator } from 'src/app/_servizi/custom.validators';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as moment from 'moment';
import { IPeriodicElement } from 'src/app/_interfacce/IPeriodicElement.interface';
import { UserAuth } from 'src/app/_types/UserAuth.type';
import { UserClient } from 'src/app/_types/UserClient.type';
import { UserPassword } from 'src/app/_types/UserPassword.type';
import { FormVisibilityService } from 'src/app/_servizi/formVisibility.service';

@Component({
  selector: 'app-database-modal-utente',
  templateUrl: './database-modal-utente.component.html',
  styleUrls: ['./database-modal-utente.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
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
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
})

export class DatabaseModalUtenteComponent implements OnInit, OnDestroy {

  constructor(
    // public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,   // private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    public formVisibilityService: FormVisibilityService
  ) {
    this.nazioni$ = this.api.getNazioni()
    this.comuni$ = this.api.getComuni()
    this.lingue$ = this.api.getLingue()
  }

  hide = true;
  isChecked = false;
  mostraMessaggioErrore = false;
  colore: string = ''


  private distruggi$ = new Subject<void>();

  //Nazioni
  // Observable per dati delle Nazioni
  nazioni$: Observable<IRispostaServer>;
  datiNazione: Nazione[] = [];

  //Comuni - Regioni - cap
  // Observable per dati dei Comuni - Regioni - CAP
  comuni$: Observable<IRispostaServer>;
  datiComune: Comune[] = [];

  //Lingua
  // Observable per dati delle Lingue
  lingue$: Observable<IRispostaServer>;
  datiLingua: Lingua[] = [];

  // FORM PRECOMPILAZIONE
  // LOGIN
  loginForm: FormGroup = new FormGroup({
    utente: new FormControl(''),
    password: new FormControl('')
  });
  stoControllando: boolean = false;
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  // REGISTRAZIONE
  registrationForm: FormGroup = new FormGroup({
    user: new FormControl(''),
    passwordSave: new FormControl(''),
    confirmPasswordSave: new FormControl(''),
    nome: new FormControl(''),
    cognome: new FormControl(''),
    idLingua: new FormControl(''),
    sesso: new FormControl(''),
    dataNascita: new FormControl(''),
    codiceFiscale: new FormControl(''),
    idNazione: new FormControl(''),
    idComune: new FormControl(''),
    cap: new FormControl(''),
    indirizzo: new FormControl(''),
    recapito: new FormControl(''),
    accettaTermini: new FormControl('')
  });
  isRegistrationActive: boolean = false
  isRegistrationActiveModifica: boolean = false
  PasswordValidator: boolean = false
  isRegistrationComplete: boolean = false

  // OSSERVATORE
  private osservatore = {
    next: (ritorno: ParametriSaveAuth) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  ngOnInit(): void {
    // AGGIUNGI UTENTE
    // Registration Form
    this.registrationForm = this.fb.group({
      user: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      passwordSave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPasswordSave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      cognome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      idLingua: [null, [Validators.required]],
      sesso: [null, [Validators.required]],
      dataNascita: [null, [Validators.required]],
      codiceFiscale: [null, [Validators.pattern('^([A-Z]{6})([0-9]{2})([A-Z]{1})([0-9]{2})([A-Z]{1})([0-9]{3})([A-Z]{1})$')]],
      idNazione: [null, [Validators.required]],
      idComune: [null, [Validators.required]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      indirizzo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      recapito: ['', [Validators.required, Validators.pattern('^[0-9]+$')], Validators.minLength(7), Validators.maxLength(12)],
      accettaTermini: [false, Validators.requiredTrue],
    }, {
      // Validatore per conferma password
      validator: PasswordUgualiValidator('passwordSave', 'confirmPasswordSave')
    });

    // Carica dati delle lingue
    this.lingue$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiLingua = x),
    });

    // Carica dati delle nazioni
    this.nazioni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiNazione = x),
    });

    // Carica dati dei comuni
    this.comuni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => {
        this.datiComune = x;
      },
    });
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // ########### REGISTRAZIONE UTENTE ###############
  // Attiva il form di registrazione
  attivaRegistrazione(): void {
    this.isRegistrationActive = true;
  }

  // Disattiva il form di registrazione
  disattivaRegistrazione(): void {
    this.isRegistrationActive = false;
  }

  // ########### MODIFICA UTENTE ###############
  // Attiva il menu della lista utenti
  attivaModifica(): void {
    this.isRegistrationActiveModifica = true;
  }

  // Disattiva menu della lista utenti
  disattivaModifica(): void {
    this.isRegistrationActiveModifica = false;
  }

  // Registra un utente
  registra(): void {
    if (this.registrationForm.invalid === true) {
      console.log('Form di registrazione non valido', this.registrationForm);
      this.isRegistrationComplete = false
      return;
    } else {
      console.log('Form di registrazione valido', this.registrationForm);

      // Formattazione data di nascita
      const dataNascitaFormatted = moment(this.registrationForm.controls['dataNascita'].value).format('YYYY-MM-DD');

      const parametro: Partial<ParametriSaveAuth> = {
        idUserStatus: 1,
        user: this.registrationForm.controls['user'].value,
        password: this.registrationForm.controls['passwordSave'].value,
        nome: this.registrationForm.controls['nome'].value,
        cognome: this.registrationForm.controls['cognome'].value,
        sesso: this.registrationForm.controls['sesso'].value || null,
        dataNascita: dataNascitaFormatted || null,
        codiceFiscale: this.registrationForm.controls['codiceFiscale'].value || null,
        idNazione: this.registrationForm.controls['idNazione'].value || null,
        idComune: this.registrationForm.controls['idComune'].value || null,
        cap: this.registrationForm.controls['cap'].value || null,
        indirizzo: this.registrationForm.controls['indirizzo'].value || null,
        recapito: this.registrationForm.controls['recapito'].value || null,
        idLingua: this.registrationForm.controls['idLingua'].value,
        accettaTermini: this.registrationForm.controls['accettaTermini'].value,
      }

      this.obsAddUserClient(parametro).subscribe(this.osservatore);
      this.isRegistrationComplete = true
    }
  }

  // Observable per la registrazione di un utente
  obsAddUserClient(dati: Partial<ParametriSaveAuth>) {
    return this.api.postRegistrazioneUserClient(dati).pipe(
      take(1),
      tap((x) => console.log('OBS', x)),
      map((x) => x.data),
      takeUntil(this.distruggi$)
    );
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

  // // ########### LOGOUT ###############
  // Effettua il logout dell'utente
  esci(): void {
    const auth: Auth = {
      idLingua: null,
      token: null,
      nome: null,
      idUserRole: null,
      idUserStatus: null,
      idUserClient: null,
      ability: null,
    };

    this.authService.settaObsAuth(auth);
    this.authService.scriviAuthSuLocalStorage(auth);
    this.router.navigateByUrl('/login');
  }

  // ########### LOGIN ###############
  // Effettua l'accesso dell'utente
  accedi(): void {
    if (this.loginForm.invalid) {
      // console.log('FORM NON VALIDO');
      this.mostraMessaggioErrore = true;
      return;
    } else {
      let utente = this.loginForm.controls['utente'].value;
      let password = this.loginForm.controls['password'].value;
      this.stoControllando = true;
      this.obsLogin(utente, password).subscribe(this.osservoLogin());
      // console.log('ACCEDI', utente, password);
    }
  }

  // Observable per l'accesso dell'utente
  private obsLogin(
    utente: string,
    password: string
  ): Observable<IRispostaServer> {
    return this.api.login(utente, password).pipe(
      delay(1000),
      take(1),
      catchError((err, caught) => {
        console.error('ERR', err, caught);
        const nuovaRisposta: IRispostaServer = {
          data: null,
          message: 'ERRORE LOGIN',
          error: err,
        };
        return of(nuovaRisposta);
      }),
      takeUntil(this.distruggi$)
    );
  }

  // ############# OBSERVER LOGIN ##############
  // Gestione dell'accesso dell'utente
  private osservoLogin() {
    const osservatore: Observer<any> = {
      next: (rit) => {
        console.log('RITORNO', rit);
        if (rit.data !== null) {
          const token: string = rit.data.token;
          const contenutoToken: any = UtilityServices.leggiToken(token);
          const auth: Auth = {
            idLingua: contenutoToken.data.idLingua,
            token: rit.data.token,
            nome: contenutoToken.data.nome,
            idUserRole: contenutoToken.data.idUserRole,
            idUserStatus: contenutoToken.data.idUserStatus,
            idUserClient: contenutoToken.data.idUserClient,
            ability: contenutoToken.data.ability,
          };
          this.authService.settaObsAuth(auth);
          this.authService.scriviAuthSuSessionStorage(auth);
          this.router.navigateByUrl('/home');
        } else {
          console.log('ERRORE in osservoLogin');
          this.mostraMessaggioErrore = true;
          return;
        }
        this.stoControllando = false;
      },
      error: (err) => {
        console.error('ERRORE', err);
        const auth: Auth = {
          idLingua: null,
          token: null,
          nome: null,
          idUserRole: null,
          idUserStatus: null,
          idUserClient: null,
          ability: null,
        };
        this.authService.settaObsAuth(auth);
        this.stoControllando = false;
      },
      complete: () => {
        this.stoControllando = false;
        console.log('COMPLETATO');
      },
    };
    return osservatore;
  }

  //---------------------------------------------------------------------------------------------------------------
  // Restituisce i controlli del form di registrazione
  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }




}




// per MODIFICA PUT da Rino

// this.form.patchValue(UtiliService.impostaFormGroup(this.datiFilm));
// //correggo bug che mi riporta idCategoria a stringa
// this.form.controls["idCategoria"].setValue(this.datiFilm.idCategoria * 1);
