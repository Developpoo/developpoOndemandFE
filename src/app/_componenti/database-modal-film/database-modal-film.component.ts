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
import { IRispostaFilm } from 'src/app/_interfacce/IRispostaFilm.interface';
import { IFileObject } from 'src/app/_interfacce/IFileObject.interface';

@Component({
  selector: 'app-database-modal-film',
  templateUrl: './database-modal-film.component.html',
  styleUrls: ['./database-modal-film.component.scss'],
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
export class DatabaseModalFilmComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    public formVisibilityService: FormVisibilityService
  ) { }

  private distruggi$ = new Subject<void>();

  // FORM PRECOMPILAZIONE
  // FILM
  registrationFormFilm: FormGroup = new FormGroup({
    titolo: new FormControl(''),
    descrizione: new FormControl(''),
    durata: new FormControl(''),
    regista: new FormControl(''),
    attori: new FormControl(''),
    icona: new FormControl(''),
    anno: new FormControl(''),
    watch: new FormControl(''),
    idTipoFile1: new FormControl(''),
    src1: new FormControl(''),
    alt1: new FormControl(''),
    title1: new FormControl(''),
    idTipoFile2: new FormControl(''),
    src2: new FormControl(''),
    alt2: new FormControl(''),
    title2: new FormControl('')

  });
  // stoControllando: boolean = false;
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  isRegistrationActive: boolean = false
  isRegistrationActiveModifica: boolean = false
  PasswordValidator: boolean = false
  isRegistrationComplete: boolean = false

  // OSSERVATORE
  private osservatore = {
    next: (ritorno: IRispostaFilm) => console.log(ritorno),
    error: (err: string) => console.error(err),
    complete: () => console.log('Completato'),
  };

  ngOnInit(): void {
    // AGGIUNGI FILM
    // Registration Form FILM
    this.registrationFormFilm = this.fb.group({
      titolo: [null, [Validators.required]],
      descrizione: [null, [Validators.required]],
      durata: [null, [Validators.required]],
      regista: [null, [Validators.required]],
      attori: [null, [Validators.required]],
      icona: [null, [Validators.required]],
      anno: [null, [Validators.required]],
      watch: [null, [Validators.required]],
      idTipoFile1: [null, [Validators.required]],
      src1: [null, [Validators.required]],
      alt1: [null, [Validators.required]],
      title1: [null, [Validators.required]],
      idTipoFile2: [null, [Validators.required]],
      src2: [null, [Validators.required]],
      alt2: [null, [Validators.required]],
      title2: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // Registra un genere
  registraFilm(): void {
    if (this.registrationFormFilm.invalid === true) {
      console.log('Form di registrazione film non valido', this.registrationFormFilm);
      this.isRegistrationComplete = false;
      return;
    } else {
      console.log('Form di registrazione valido', this.registrationFormFilm);

      let tmpArrFile: IFileObject[] = [];

      const parametro: IRispostaFilm = {
        idFilm: 0, // Assegna un valore valido per idFilm
        titolo: this.registrationFormFilm.controls['titolo'].value,
        descrizione: this.registrationFormFilm.controls['descrizione'].value,
        durata: this.registrationFormFilm.controls['durata'].value || null,
        regista: this.registrationFormFilm.controls['regista'].value || null,
        attori: this.registrationFormFilm.controls['attori'].value || null,
        icona: this.registrationFormFilm.controls['icona'].value || null,
        anno: this.registrationFormFilm.controls['anno'].value || null,
        watch: this.registrationFormFilm.controls['watch'].value || null,
        file: tmpArrFile // Inizializza un array per i file
      };

      const file1: IFileObject = {
        idTipoFile: this.registrationFormFilm.controls['idTipoFile1'].value || null,
        src: this.registrationFormFilm.controls['src1'].value || null,
        alt: this.registrationFormFilm.controls['alt1'].value || null,
        title: this.registrationFormFilm.controls['title1'].value || null,
      };

      const file2: IFileObject = {
        idTipoFile: this.registrationFormFilm.controls['idTipoFile2'].value || null,
        src: this.registrationFormFilm.controls['src2'].value || null,
        alt: this.registrationFormFilm.controls['alt2'].value || null,
        title: this.registrationFormFilm.controls['title2'].value || null,
      };

      parametro.file.push(file1);
      parametro.file.push(file2)


      this.obsAddFilm(parametro).subscribe(this.osservatore);
      this.isRegistrationComplete = true;
    }
  }


  // Observable per la registrazione di un utente
  obsAddFilm(dati: IRispostaFilm) {
    return this.api.postRegistrazioneFilm(dati).pipe(
      take(1),
      tap((x) => console.log('OBS', x)),
      map((x) => x.data),
      takeUntil(this.distruggi$)
    );
  }

  // Attiva il form di registrazione
  attivaRegistrazione(): void {
    // this.isRegistrationActive = true;
  }

  // Disattiva il form di registrazione
  disattivaRegistrazione(): void {
    // this.isRegistrationActive = false;
  }

  //---------------------------------------------------------------------------------------------------------------
  // Restituisce i controlli del form di registrazione
  get f(): { [key: string]: AbstractControl } {
    return this.registrationFormFilm.controls;
  }

}
