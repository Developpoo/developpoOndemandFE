import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { NavbarComponent } from 'src/app/_componenti/navbar/navbar.component';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { Auth } from 'src/app/_types/Auth.type';
import { Comune } from 'src/app/_types/Comune.type';
import { Lingua } from 'src/app/_types/Lingua.type';
import { Nazione } from 'src/app/_types/Nazione.type';
import { ParametriSaveAuth } from 'src/app/_types/ParametriSaveAuth.type';
import { TipoIndirizzo } from 'src/app/_types/TipoIndirizzo.type';
import { TipoRecapito } from 'src/app/_types/TipoRecapito.type';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input('startModal') ogModal: any | null = null;

  //Login
  stoControllando: boolean = false;
  reactiveForm: FormGroup;
  auth: BehaviorSubject<Auth>;
  private distruggi$ = new Subject<void>();

  //Registrazione campi aggiuntivi
  isRegistrationActive: boolean = false;
  registrationForm: FormGroup;

  private osservatore = {
    next: (ritorno: ParametriSaveAuth) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  //TipoIndirizzi
  elencoTipoIndirizzi$: Observable<IRispostaServer>;
  datiTipoIndirizzo: TipoIndirizzo[] = [];

  //TipoRecapiti
  elencoTipoRecapiti$: Observable<IRispostaServer>;
  datiTipoRecapito: TipoRecapito[] = [];

  //Nazioni
  nazioni$: Observable<IRispostaServer>;
  datiNazione: Nazione[] = [];

  //Comuni - Regioni - cap
  comuni$: Observable<IRispostaServer>;
  datiComune: Comune[] = [];
  regioniComuni: { [regione: string]: Comune[] } = {};

  //Lingua
  lingue$: Observable<IRispostaServer>;
  datiLingua: Lingua[] = [];

  closeResult = '';
  content = '';

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    (this.reactiveForm = this.fb.group({
      // login
      utente: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(40),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    })),
      (this.registrationForm = this.fb.group({
        // registrazione
        user: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(5),
            Validators.maxLength(40),
          ],
        ],
        passwordSave: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        nome: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        cognome: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        lingueModal: ['', [Validators.required]],
        codiceFiscale: ['', [Validators.pattern('^[A-Z0-9]{16}$')]],
        accettaTermini: [false, Validators.requiredTrue],
      }));

    this.auth = this.authService.leggiObsAuth();
    console.log('AUTH', this.auth);

    this.elencoTipoIndirizzi$ = this.api.getTipoIndirizzi();
    this.elencoTipoRecapiti$ = this.api.getTipoRecapiti();
    this.nazioni$ = this.api.getNazioni();
    this.comuni$ = this.api.getComuni();
    this.lingue$ = this.api.getLingue();
  }

  ngOnInit(): void {
    this.open(this.content);

    this.lingue$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiLingua = x),
    });

    this.nazioni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiNazione = x),
    });

    this.comuni$.pipe(map((x) => x.data)).subscribe({
      next: (comuni) => {
        for (const comune of comuni) {
          if (!this.regioniComuni[comune.regione]) {
            this.regioniComuni[comune.regione] = [];
          }
          this.regioniComuni[comune.regione].push(comune);
        }
      },
    });

    this.comuni$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiComune = x),
    });

    this.elencoTipoIndirizzi$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiTipoIndirizzo = x),
    });

    this.elencoTipoRecapiti$.pipe(map((x) => x.data)).subscribe({
      next: (x) => (this.datiTipoRecapito = x),
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

  registrati(): void {
    if (this.registrationForm.invalid) {
      console.log('Form di registrazione non valido');
      return;
    }

    const parametro: Partial<ParametriSaveAuth> = {
      idUserStatus: 1,
      idLingua: this.registrationForm.controls['idLingua'].value,
      nome: this.registrationForm.controls['nome'].value,
      cognome: this.registrationForm.controls['cognome'].value,
      sesso: this.registrationForm.controls['sesso'].value || null,
      codiceFiscale:
        this.registrationForm.controls['codiceFiscale'].value || null,
      idNazione: this.registrationForm.controls['idNazione'].value || null,
      regione: this.registrationForm.controls['regione'].value || null,
      idComune: this.registrationForm.controls['idComune'].value || null,
      accettaTermini: this.registrationForm.controls['accettaTermini'].value,
      user: this.registrationForm.controls['user'].value,
      cap: this.registrationForm.controls['cap'].value || null,
      idTipoIndirizzo:
        this.registrationForm.controls['idTipoIndirizzo'].value || null,
      indirizzo: this.registrationForm.controls['indirizzo'].value || null,
      idTipoRecapito:
        this.registrationForm.controls['idTipoRecapito'].value || null,
      recapito: this.registrationForm.controls['recapito'].value || null,
    };

    this.obsAddUserClient(parametro).subscribe(this.osservatore);
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
    if (this.reactiveForm.invalid) {
      console.log('FORM NON VALIDO');
    } else {
      let utente = this.reactiveForm.controls['utente'].value;
      let password = this.reactiveForm.controls['password'].value;
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
