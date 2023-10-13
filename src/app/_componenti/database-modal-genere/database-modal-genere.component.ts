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
import { BehaviorSubject, Subject, map, take, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { ApiService } from 'src/app/_servizi/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormVisibilityService } from 'src/app/_servizi/formVisibility.service';
import { Genere } from 'src/app/_types/Genere.type';

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
export class DatabaseModalGenereComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router,   // private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    public formVisibilityService: FormVisibilityService
  ) { }

  private distruggi$ = new Subject<void>();

  // FORM PRECOMPILAZIONE
  // GENERE
  registrationFormCategory: FormGroup = new FormGroup({
    nome: new FormControl(''),
    icona: new FormControl(''),
    watch: new FormControl('')

  });
  // stoControllando: boolean = false;
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  isRegistrationActive: boolean = false
  isRegistrationActiveModifica: boolean = false
  PasswordValidator: boolean = false
  isRegistrationComplete: boolean = false

  // OSSERVATORE
  private osservatore = {
    next: (ritorno: Genere) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  ngOnInit(): void {
    // AGGIUNGI GENERE
    // Registration Form
    this.registrationFormCategory = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      icona: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      watch: [null, [Validators.required]],
    });
  }



  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // Registra un genere
  registraGenere(): void {
    if (this.registrationFormCategory.invalid === true) {
      console.log('Form di registrazione genere non valido', this.registrationFormCategory);
      this.isRegistrationComplete = false
      return;
    } else {
      console.log('Form di registrazione valido', this.registrationFormCategory);
      const parametro: Partial<Genere> = {
        nome: this.registrationFormCategory.controls['nome'].value,
        icona: this.registrationFormCategory.controls['icona'].value,
        watch: this.registrationFormCategory.controls['watch'].value || null,
        idFile: 1
      }

      this.obsAddCategory(parametro).subscribe(this.osservatore);
      this.isRegistrationComplete = true
    }
  }

  // Observable per la registrazione di un utente
  obsAddCategory(dati: Partial<Genere>) {
    return this.api.postRegistrazioneGenere(dati).pipe(
      take(1),
      tap((x) => console.log('OBS', x)),
      map((x) => x.data),
      takeUntil(this.distruggi$)
    );
  }

  // Attiva il form di registrazione
  attivaRegistrazione(): void {
    this.isRegistrationActive = true;
  }

  // Disattiva il form di registrazione
  disattivaRegistrazione(): void {
    this.isRegistrationActive = false;
  }

  //---------------------------------------------------------------------------------------------------------------
  // Restituisce i controlli del form di registrazione
  get f(): { [key: string]: AbstractControl } {
    return this.registrationFormCategory.controls;
  }
}
