import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, concatMap, map, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ActivatedRoute } from '@angular/router';
import { IRispostaFilm } from 'src/app/_interfacce/IRispostaFilm.interface';
import { IFileObject } from 'src/app/_interfacce/IFileObject.interface';
import { SafePipe } from 'src/app/safe.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-film-video',
  templateUrl: './film-video.component.html',
  styleUrls: ['./film-video.component.scss']
})
export class FilmVideoComponent implements OnDestroy, OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  error: string = '';
  private distruggi$ = new Subject<void>()
  films: IRispostaFilm[] = [];

  // Aggiungi una variabile per tener traccia del film selezionato
  filmSelezionato?: IRispostaFilm;

  // Aggiungi un riferimento alla modal usando ViewChild (questa parte dipende dalla tua implementazione della modal)
  @ViewChild('videoModal') videoModal: any;


  /**
   * Questo componente gestisce la visualizzazione dei video dei film.
   * Recupera i dati dai parametri dell'URL e carica i film corrispondenti.
   */

  ngOnInit(): void {
    // Richiama il metodo per recuperare i dati e osservarli
    this.recuperaDati().subscribe(this.osservoFilms());
  }

  ngOnDestroy(): void {
    // Notifica la distruzione del componente
    this.distruggi$.next();
  }

  private recuperaDati(): Observable<IRispostaServer> {
    // Recupera il parametro 'id' dalla route
    return this.route.params.pipe(
      map(x => x['id']),
      tap(x => console.log("%c Recupero ID " + x, "color:0000AA")),
      concatMap((x: string, index: number): Observable<IRispostaServer> => {
        // Utilizza il servizio ApiService per recuperare i dati del film
        return this.api.getFilmFile(+(x));
      }),
      tap(() => console.log("Prima dell'assegnazione dei dati")),
      takeUntil(this.distruggi$)
    );
  }

  //########################################
  // Observer FILMS
  //########################################

  private osservoFilms() {
    return {
      next: (rit: IRispostaServer) => {
        console.log("Funzione 'next' chiamata con la risposta", rit);
        console.log("rit.data", rit.data);

        // Se rit.data è un array
        if (Array.isArray(rit.data)) {
          this.films = rit.data.map(this.mapFilm);
          console.log("Array 'films' dopo l'iterazione:", this.films);
        }
        // Se rit.data è un oggetto singolo
        else if (rit.data && typeof rit.data === 'object') {
          const film = this.mapFilm(rit.data);
          this.films = [film];  // inserisce il singolo film in un array
          console.log("Array 'films' dopo l'assegnazione:", this.films);
        }
        else {
          console.log("L'array 'elementi' è vuoto o indefinito.");
        }
      },
    };
  }

  private mapFilm(data: any): IRispostaFilm {
    // Mappa i dati del film in un oggetto IRispostaFilm
    return {
      idFilm: data.idFilm,
      titolo: data.titolo,
      descrizione: data.descrizione,
      durata: data.durata,
      regista: data.regista,
      attori: data.attori,
      icona: data.icona,
      anno: new Date(data.anno),
      watch: data.watch,
      file: data.files ? data.files.map(this.mapFile) : []
    };
  }

  private mapFile(fileData: any): IFileObject {
    // Mappa i dati del file in un oggetto IFileObject
    return {
      idFile: fileData.idFile,
      idTipoFile: fileData.idTipoFile,
      src: fileData.src,
      alt: fileData.alt,
      title: fileData.title
    };
  }

  getPrimaryImageSrc(film: IRispostaFilm): string {
    // Ottiene il percorso del file immagine principale del film
    const primaryFile = film.file.find(f => f.idTipoFile === 1);
    return primaryFile ? primaryFile.src : 'src\assets\img\GENERE_WEB\UNDERCONSTRUCTION.jpg';
  }

  getYouTubeVideoUrl(film: IRispostaFilm): string | undefined {
    const videoFile = film.file.find(f => f.idTipoFile === 2);
    return videoFile ? videoFile.src : undefined;
  }


  // Aggiungi una funzione per impostare il film corrente e mostrare la modal
  mostraVideo(film: IRispostaFilm) {
    this.filmSelezionato = film;
    this.videoModal.showModal();
  }

  getSafeYouTubeUrl(): string {
    console.log(this.filmSelezionato);

    const videoFile = this.filmSelezionato?.file.find(f => f.idTipoFile === 2);
    return videoFile ? videoFile.src : '';
  }

  // getSafeYouTubeUrl(): SafeResourceUrl {
  //   const videoFile = this.filmSelezionato?.file.find(f => f.idTipoFile === 2);
  //   return videoFile ? this.sanitizer.bypassSecurityTrustResourceUrl(videoFile.src) : '';
  // }



}
