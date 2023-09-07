import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, Subject, map, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss'],
})
export class UploadImgComponent {


  readonly maxFilesNumber: number = 3;
  readonly maxFileSize: number = 1;
  errore: string = '';
  erroreForm: ValidationErrors | null | undefined = null;
  fileOk: boolean = false;
  daCaricare: File[] = [];
  private distruggi$ = new Subject<void>();

  reactiveForm: FormGroup;
  constructor(private api: ApiService, private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      fileDaCaricare: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.distruggi$.next();
  }

  inviaDati(dati: FormData): Observable<any> {
    return this.api.upload(dati).pipe(
      tap((x) => console.log('DATI TAP', x)),
      take(1),
      map((x) => x.data),
      takeUntil(this.distruggi$)
    );
  }

  invia(form: HTMLFormElement): void {
    if (this.reactiveForm.valid) {
      console.log('FORM VALIDO', this.reactiveForm.value);
      const formData: FormData = new FormData();
      for (let i = 0; i < this.daCaricare.length; i++) {
        formData.append('fileDaCaricare[]', this.daCaricare[i]);
      }
      const obs$ = this.inviaDati(formData).subscribe({
        next: (ritorno) => {
          console.log('RITORNO', ritorno);
          this.fileOk = ritorno;
        },
        error: (err) => console.log(err),
        complete: () => console.log('COMPLETATO'),
      });
    } else {
      this.erroreForm = this.reactiveForm.get('fileDaCaricare')?.errors;
      console.log('FORM NON VALIDO', this.erroreForm);
    }
  }

  onChangeInputFile(e: Event): void {
    const elementi = e.currentTarget as HTMLInputElement;
    let fileList: FileList | null = elementi.files;
    if (fileList && fileList !== null) {
      console.log('FILELIST da Input', fileList);
      this.ctrlFileList(fileList);
    }
  }

  alRilascio(e: FileList): void {
    console.log('FILELIST da Drag', e);
    if (e !== null) {
      this.ctrlFileList(e);
    }
  }

  ctrlFileList(fileList: FileList): void {
    if (fileList !== null) {
      if (fileList.length > this.maxFilesNumber) {
        this.errore =
          'Puoi caricare al massimo ' + this.maxFilesNumber + 'files';
      } else {
        for (let i = 0; i < fileList.length; i++) {
          if (!this.ctrlEstensione(fileList[i].name, 'jpg')) {
            this.errore = fileList[i].name + ' non ha estensione corretta';
            break;
          } else if (!this.ctrlSize(fileList[i].size, this.maxFileSize)) {
            this.errore =
              fileList[i].name +
              'è troppo grande (' +
              Math.round(fileList[i].size / (1024 * 1024)) +
              'MB)';
            break;
          } else if (!this.ctrlInArray(fileList[i])) {
            this.daCaricare.push(fileList[1]);
          }
        }
        console.log('FILES INSERITI', this.daCaricare);
        this.reactiveForm
          .get('fileDaCaricare')
          ?.setValue(this.daCaricare, { emitModelToViewChange: false });
      }
    }
  }

  ctrlEstensione(nome: string, ext: string): boolean {
    const tmp = nome.split('.');
    return tmp[tmp.length - 1] !== ext ? false : true;
  }

  ctrlSize(size: number, maxSizeMB: number): boolean {
    const tmp = maxSizeMB * 1024 * 1024;
    return size > tmp ? false : true;
  }

  ctrlInArray(file: File): boolean {
    // Controllo se il file è già presente tra quelli da caricare
    return false;
  }

  elimina(file: File): void {
    this.daCaricare.splice(this.daCaricare.indexOf(file), 1); //splice lo taglia indexOf gli dico quale file andare a tagliare
    console.log('ELIMINO FILE', this.daCaricare);
  }
}
