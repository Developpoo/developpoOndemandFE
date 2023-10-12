import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servizio per la gestione dello stato di visibilità di form multipli.
 */
@Injectable()
export class FormVisibilityService {
  private isRegistrationActiveSubject = new BehaviorSubject<boolean>(false);
  public isRegistrationActive$: Observable<boolean> = this.isRegistrationActiveSubject.asObservable();

  private isRegistrationCategoryActiveSubject = new BehaviorSubject<boolean>(false);
  public isRegistrationCategoryActiveSubject$: Observable<boolean> = this.isRegistrationCategoryActiveSubject.asObservable();


  private isRegistrationFilmActiveSubject = new BehaviorSubject<boolean>(false);
  public isRegistrationFilmActiveSubject$: Observable<boolean> = this.isRegistrationFilmActiveSubject.asObservable();

  /**
   * Imposta lo stato di visibilità del form principale.
   * Questo metodo controlla la visibilità del form Utente.
   */
  setFormVisibility() {
    this.isRegistrationActiveSubject.next(!this.isRegistrationActiveSubject.value);
  }

  /**
   * Imposta lo stato di visibilità del form categoria.
   * Questo metodo controlla la visibilità del form Genere.
   */
  setFormVisibilityCategory() {
    this.isRegistrationCategoryActiveSubject.next(!this.isRegistrationCategoryActiveSubject.value);
  }

  /**
   * Imposta lo stato di visibilità del form film.
   * Questo metodo controlla la visibilità del form Film.
   */
  setFormVisibilityFilm() {
    this.isRegistrationFilmActiveSubject.next(!this.isRegistrationFilmActiveSubject.value);
  }
}
