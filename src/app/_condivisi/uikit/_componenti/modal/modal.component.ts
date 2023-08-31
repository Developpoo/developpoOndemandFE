import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Observer, Subject, catchError, delay, of, take, takeUntil } from 'rxjs';
import { NavbarComponent } from 'src/app/_componenti/navbar/navbar.component';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {

	@Input("startModal") ogModal: any | null = null
	
	//Login
	stoControllando: boolean = false
  reactiveForm: FormGroup
  auth: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>()

  //Registrazione attiva campi aggiuntivi
  isRegistrationActive: boolean = false;

	closeResult = '';
  content="";

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
		) {
			this.reactiveForm = this.fb.group({
      // login
      'utente': ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      'password': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],

      // registrazione
      'utenteSave': [''],
      'passwordSave': [''],
      'nome': [''],
      'cognome': [''],
    })

    this.auth = this.authService.leggiObsAuth()
    console.log("AUTH", this.auth)
		}

  ngOnInit(): void {
  this.open(this.content)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startModal"].currentValue) {
        this.open(this.ogModal);
    }
  }

  ngOnDestroy(): void {
    this.distruggi$.next()
    this.distruggi$.complete()
  }
  
	open(content:any):any {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
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

  attivaRegistrazione():void {
    this.isRegistrationActive = true;
  }

  disattivaRegistrazione():void{
    this.isRegistrationActive = false;
  }

  registrati():void{
    if (this.reactiveForm.invalid) {
      console.log("Form di registrazione non valido");
   } else {
    let utenteSave = this.reactiveForm.controls['utenteSave'].value;
    let passwordSave = this.reactiveForm.controls['passwordSave'].value;
    let nome = this.reactiveForm.controls['nome'].value;
    let cognome = this.reactiveForm.controls['cognome'].value;
   }
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
      ability: null
    };
    
    this.authService.settaObsAuth(auth); // Reset dell'oggetto Auth
    this.authService.scriviAuthSuLocalStorage(auth); // Rimuovi l'oggetto Auth dal local storage
    this.router.navigateByUrl('/login'); // Reindirizza l'utente alla pagina di login
  }

	// ########### LOGIN ###############

	accedi(): void {
    if (this.reactiveForm.invalid) {
      console.log("FORM NON VALIDO")
    } else {
      let utente = this.reactiveForm.controls["utente"].value
      let password = this.reactiveForm.controls["password"].value
      this.stoControllando = true
      this.obsLogin(utente, password).subscribe(this.osservoLogin())
      // console.log("ACCEDI", utente, password)
    }
  }

  private obsLogin(utente: string, password: string): Observable<IRispostaServer> {
    return this.api.login(utente, password).pipe(
      delay(1000),
      take(1),
      catchError((err, caught) => {
        console.error("ERR", err, caught)
        const nuovaRisposta: IRispostaServer = {
          data: null,
          message: "ERRORE LOGIN",
          error: err
        }
        return of(nuovaRisposta)
      }),
      takeUntil(this.distruggi$)
    )
  }

// ############# OBSERVER LOGIN ##############
  private osservoLogin() {
    const osservatore: Observer<any> = {
      next: (rit) => {
        // console.log("RITORNO", rit)
        if (rit.data !== null) {
          const token: string = rit.data.token
          const contenutoToken = UtilityServices.leggiToken(token)
          const auth: Auth = {
            idLingua: contenutoToken.data.idLingua,
            token: rit.data.token,
            nome: contenutoToken.data.nome,
            idUserRole: contenutoToken.data.idUserRole,
            idUserStatus: contenutoToken.data.idUserStatus,
            idUserClient: contenutoToken.data.idUserClient,
            ability: contenutoToken.data.ability
          }
          this.authService.settaObsAuth(auth)
          this.authService.scriviAuthSuLocalStorage(auth)
          this.router.navigateByUrl('/home')
        } else {
          console.log("ERRORE in osservoLogin")
        }
        this.stoControllando = false
      },
      error: (err) => {
        console.error("ERRORE", err)
        const auth: Auth = {
          idLingua: null,
          token: null,
          nome: null,
          idUserRole: null,
          idUserStatus: null,
          idUserClient: null,
          ability: null
        }
        this.authService.settaObsAuth(auth)
        this.stoControllando = false
      },
      complete: () => {
        this.stoControllando = false
        console.log("COMPLETATO")
      }
    }
    return osservatore
  }
}
