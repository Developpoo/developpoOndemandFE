import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  Observable,
  Observer,
  Subject,
  catchError,
  delay,
  map,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { PasswordUgualiValidator } from 'src/app/_servizi/custom.validators';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { Auth } from 'src/app/_types/Auth.type';
import { Comune } from 'src/app/_types/Comune.type';
import { Lingua } from 'src/app/_types/Lingua.type';
import { Nazione } from 'src/app/_types/Nazione.type';
import { ParametriSaveAuth } from 'src/app/_types/ParametriSaveAuth.type';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input('startModal') ogModal: any | null = null;

  private distruggi$ = new Subject<void>();

  //Nazioni
  nazioni$: Observable<IRispostaServer>;
  datiNazione: Nazione[] = [];

  //Comuni - Regioni - cap
  comuni$: Observable<IRispostaServer>;
  datiComune: Comune[] = [];

  //Lingua
  lingue$: Observable<IRispostaServer>;
  datiLingua: Lingua[] = [];

  // OPEN
  closeResult = '';
  content = '';

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
  isRegistrationActive: boolean = false;
  PasswordValidator: boolean = false

  // OSSERVATORE
  private osservatore = {
    next: (ritorno: ParametriSaveAuth) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    this.nazioni$ = this.api.getNazioni()
    this.comuni$ = this.api.getComuni()
    this.lingue$ = this.api.getLingue()
  }

  ngOnInit(): void {
    this.open(this.content);

    // login
    this.loginForm = this.fb.group({
      utente: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });

    // registrazione
    this.registrationForm = this.fb.group({
      user: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      passwordSave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPasswordSave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      cognome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      idLingua: [null, [Validators.required]],
      sesso: [null, [Validators.required]],
      dataNascita: [null, [Validators.required]],
      codiceFiscale: [null, [Validators.required, Validators.pattern('^([A-Z]{6})([0-9]{2})([A-Z]{2})([0-9]{3})([A-Z]{1})$')]],
      idNazione: [null, [Validators.required]],
      idComune: [null, [Validators.required]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      indirizzo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      recapito: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      accettaTermini: [false, Validators.requiredTrue],
    }, {
      validator: PasswordUgualiValidator('passwordSave', 'confirmPasswordSave')
    });

    this.lingue$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiLingua = x),
    });

    this.nazioni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiNazione = x),
    });

    // this.comuni$.pipe(map((x) => x.data)).subscribe({
    //   next: (comuni) => {
    //     for (const comune of comuni) {
    //       if (!this.regioniComuni[comune.regione]) {
    //         this.regioniComuni[comune.regione] = [];
    //       }
    //       this.regioniComuni[comune.regione].push(comune);
    //     }
    //   },
    // });

    this.comuni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => {
        this.datiComune = x;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startModal'].currentValue) {
      this.open(this.ogModal);
    }
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  open(content: any): any {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // ########### REGISTRAZIONE ###############

  attivaRegistrazione(): void {
    this.isRegistrationActive = true;
  }

  disattivaRegistrazione(): void {
    this.isRegistrationActive = false;
  }

  registra(): void {
    if (this.registrationForm.invalid) {
      console.log('Form di registrazione non valido');
      return;
    } else {
      console.log('Form di registrazione valido');

      const parametro: Partial<ParametriSaveAuth> = {
        user: this.registrationForm.controls['user'].value,
        password: this.registrationForm.controls['passwordSave'].value,
        nome: this.registrationForm.controls['nome'].value,
        cognome: this.registrationForm.controls['cognome'].value,
        sesso: this.registrationForm.controls['sesso'].value || null,
        dataNascita:
          this.registrationForm.controls['dataNascita'].value || null,
        codiceFiscale:
          this.registrationForm.controls['codiceFiscale'].value || null,
        idNazione: this.registrationForm.controls['idNazione'].value || null,
        regione: this.registrationForm.controls['regione'].value || null,
        idComune: this.registrationForm.controls['idComune'].value || null,
        cap: this.registrationForm.controls['cap'].value || null,
        idTipoIndirizzo:
          this.registrationForm.controls['idTipoIndirizzo'].value || null,
        indirizzo: this.registrationForm.controls['indirizzo'].value || null,
        idTipoRecapito:
          this.registrationForm.controls['idTipoRecapito'].value || null,
        recapito: this.registrationForm.controls['recapito'].value || null,
        idLingua: this.registrationForm.controls['lingua'].value,
        accettaTermini: this.registrationForm.controls['accettaTermini'].value,
      }

      this.obsAddUserClient(parametro).subscribe(this.osservatore);
    }
  }

  obsAddUserClient(dati: Partial<ParametriSaveAuth>) {
    return this.api.postRegistrazioneUserClient(dati).pipe(
      take(1),
      tap((x) => console.log('OBS', x)),
      map((x) => x.data),
      takeUntil(this.distruggi$)
    );
  }

  // ########### LOGOUT ###############

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

    this.authService.settaObsAuth(auth); // Reset dell'oggetto Auth
    this.authService.scriviAuthSuLocalStorage(auth); // Rimuovi l'oggetto Auth dal local storage
    this.router.navigateByUrl('/login'); // Reindirizza l'utente alla pagina di login
  }

  // ########### LOGIN ###############

  accedi(): void {
    if (this.loginForm.invalid) {
      console.log('FORM NON VALIDO');
    } else {
      let utente = this.loginForm.controls['utente'].value;
      let password = this.loginForm.controls['password'].value;
      this.stoControllando = true;
      this.obsLogin(utente, password).subscribe(this.osservoLogin());
      console.log('ACCEDI', utente, password);
    }
  }

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
          this.authService.scriviAuthSuLocalStorage(auth);
          this.router.navigateByUrl('/home');
        } else {
          console.log('ERRORE in osservoLogin');
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
}
