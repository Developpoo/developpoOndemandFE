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
import { BehaviorSubject, Observable, Observer, Subject, catchError, delay, map, of, take, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Nazione } from 'src/app/_types/Nazione.type';
import { Comune } from 'src/app/_types/Comune.type';
import { Lingua } from 'src/app/_types/Lingua.type';
import { ParametriSaveAuth } from 'src/app/_types/ParametriSaveAuth.type';
import { AuthService } from 'src/app/_servizi/auth.service';
import { ApiService } from 'src/app/_servizi/api.service';
import { Router } from '@angular/router';
import { PasswordUgualiValidator } from 'src/app/_servizi/custom.validators';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as moment from 'moment';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatTooltipModule, MatIconModule, CommonModule],
})
export class ModalComponent {
  // BehaviorSubject per gestire lo stato di autenticazione
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) { }

  // Apre una finestra di dialogo
  openDialog() {
    const dialogRef = this.dialog.open(ModalComponentForm);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

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
}



@Component({
  selector: 'app-modal-form',
  templateUrl: './modal.component.form.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
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
export class ModalComponentForm implements OnInit, OnDestroy {
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
  PasswordValidator: boolean = false
  isRegistrationComplete: boolean = false

  // OSSERVATORE
  private osservatore = {
    next: (ritorno: ParametriSaveAuth) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  constructor(
    // private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router) {
    this.nazioni$ = this.api.getNazioni()
    this.comuni$ = this.api.getComuni()
    this.lingue$ = this.api.getLingue()
  }

  ngOnInit(): void {
    // Login Form
    this.loginForm = this.fb.group({
      utente: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });

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

  // ########### REGISTRAZIONE ###############
  // Attiva il form di registrazione
  attivaRegistrazione(): void {
    this.isRegistrationActive = true;
  }

  // Disattiva il form di registrazione
  disattivaRegistrazione(): void {
    this.isRegistrationActive = false;
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
          this.router.navigateByUrl('/login');
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
