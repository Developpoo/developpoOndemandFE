import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject, map, take, takeUntil, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  readonly maxFilesNumber: number = 3
  readonly maxFileSize: number = 1 // Dimensione massima dei file in MB
  errore: string = ""
  erroreForm: ValidationErrors | null | undefined = null
  fileOk: boolean = false
  daCaricare: File[] = []
  private distruggi$ = new Subject<void>()

  reactiveForm: FormGroup
  constructor(private api: ApiService, private fb: FormBuilder) {
    // Inizializza il form reattivo con un controllo "fileDaCaricare" obbligatorio.
    this.reactiveForm = this.fb.group({
      'fileDaCaricare': ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.distruggi$.next()
  }

  // Invia i dati al server
  inviaDati(dati: FormData): Observable<any> {
    return this.api.upload(dati).pipe(
      tap(x => console.log("DATI TAP", x)),
      take(1),
      map(x => x.data),
      takeUntil(this.distruggi$)
    )
  }

  // Gestisce l'invio del form
  invia(form: HTMLFormElement): void {
    if (this.reactiveForm.valid) {
      // Il form è valido, procedi con l'invio dei dati al server.
      console.log("FORM VALIDO", this.reactiveForm.value)

      const formData: FormData = new FormData()
      for (let i = 0; i < this.daCaricare.length; i++) {
        formData.append("fileDaCaricare[]", this.daCaricare[i])
      }

      // Effettua la chiamata API per l'invio dei dati.
      const obs$ = this.inviaDati(formData).subscribe({
        next: (ritorno) => {
          console.log("RITORNO", ritorno)
          this.fileOk = ritorno
        },
        error: (err) => console.log(err),
        complete: () => console.log("COMPLETATO")
      })
    } else {
      // Il form è invalido, mostra un errore.
      this.erroreForm = this.reactiveForm.get("fileDaCaricare")?.errors
      console.log("FORM NON VALIDO", this.erroreForm)
    }
  }

  // Gestisce il cambio nel campo di input del file
  onChangeInputFile(e: Event): void {
    const elementi = e.currentTarget as HTMLInputElement
    let fileList: FileList | null = elementi.files
    if (fileList && fileList !== null) {
      console.log("FILELIST da Input", fileList)
      this.ctrlFileList(fileList)
    }

  }

  // Gestisce il rilascio dei file nell'area di caricamento
  alRilascio(e: FileList): void {
    console.log("FILELIST da Drag", e)
    if (e !== null) {
      this.ctrlFileList(e)
    }

  }

  // Controlla la lista di file prima dell'invio
  ctrlFileList(fileList: FileList): void {
    if (fileList !== null) {
      if (fileList.length > this.maxFilesNumber) {
        this.errore = "Puoi caricare al massimo " + this.maxFilesNumber + "files"
      } else {
        for (let i = 0; i < fileList.length; i++) {
          if (!this.ctrlEstensione(fileList[i].name, "jpg")) {
            this.errore = fileList[i].name + " non ha estensione corretta"
            break
          } else if (!this.ctrlSize(fileList[i].size, this.maxFileSize)) {
            this.errore = fileList[i].name + "è troppo grande (" + Math.round(fileList[i].size / (1024 * 1024)) + "MB)"
            break

          } else if (!this.ctrlInArray(fileList[i])) {
            this.daCaricare.push(fileList[1])
          }
        }
        console.log("FILES INSERITI", this.daCaricare)
        this.reactiveForm.get("fileDaCaricare")?.setValue(this.daCaricare, { emitModelToViewChange: false })
      }
    }
  }

  // Controlla l'estensione del file
  ctrlEstensione(nome: string, ext: string): boolean {
    const tmp = nome.split(".")
    return (tmp[tmp.length - 1] !== ext) ? false : true
  }

  // Controlla la dimensione del file
  ctrlSize(size: number, maxSizeMB: number): boolean {
    const tmp = maxSizeMB * 1024 * 1024
    return (size > tmp) ? false : true
  }

  // Controlla se il file è già presente nell'array daCaricare
  ctrlInArray(file: File): boolean {
    // da implementare
    return false
  }

  // Elimina un file dalla lista dei file da caricare
  elimina(file: File): void {
    this.daCaricare.splice(this.daCaricare.indexOf(file), 1) //splice lo taglia indexOf gli dico quale file andare a tagliare
    console.log("ELIMINO FILE", this.daCaricare)
  }

}
