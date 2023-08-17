import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer, Subject, catchError, delay, of, take, takeUntil } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityServices } from 'src/app/_servizi/utility.services';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  stoControllando: boolean = false
  reactiveForm: FormGroup
  auth: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ){
    this.reactiveForm = this.fb.group({
      'utente': ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40)]],
      'password': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })

    this.auth = this.authService.leggiObsAuth()
    console.log("AUTH", this.auth)
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.distruggi$.next()
  }

  accedi(): void {
    if (this.reactiveForm.invalid) {
      console.log("FORM NON VALIDO")
    } else {
      let utente = this.reactiveForm.controls["utente"].value
      let password = this.reactiveForm.controls["password"].value
      this.stoControllando = true
      this.obsLogin(utente, password).subscribe(this.osservoLogin())
      console.log("ACCEDI", utente, password)
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

// ############# OBSERVER LOGIM ##############
  private osservoLogin() {
    const osservatore: Observer<any> = {
      next: (rit) => {
        console.log("RITORNO", rit)
        if (rit.data !== null && rit.message !== null) {
          const tk: string = rit.data.tk
          const contenutoToken = UtilityServices.leggiToken(tk)
          const auth: Auth = {
            idLingua: 1,
            tk: rit.data.tk,
            nome: contenutoToken.data.nome,
            idRuolo: contenutoToken.data.idRuolo,
            idStato: contenutoToken.data.idStato,
            idUtente: contenutoToken.data.idUtente,
            abilita: contenutoToken.data.abilita
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
          idLingua: 1,
          tk: null,
          nome: null,
          idRuolo: null,
          idStato: null,
          idUtente: null,
          abilita: null
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
