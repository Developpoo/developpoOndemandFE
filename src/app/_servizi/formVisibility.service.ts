// form-visibility.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
/**
 * Servizio per la gestione dello stato di visibilità di un form.
 */
@Injectable()
export class FormVisibilityService {
  private isRegistrationActiveSubject = new BehaviorSubject<boolean>(false);
  public isRegistrationActive$: Observable<boolean> = this.isRegistrationActiveSubject.asObservable();

  constructor() { }

  /**
   * Imposta lo stato di visibilità del form.
   * @param isActive Booleano che rappresenta lo stato di attivazione/disattivazione del form.
   */
  setFormVisibility() {
    this.isRegistrationActiveSubject.next(!this.isRegistrationActiveSubject.value);

  }
}
