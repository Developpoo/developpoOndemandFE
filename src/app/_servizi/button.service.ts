import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servizio per la gestione di uno stato numerico tramite un oggetto BehaviorSubject.
 * Questo servizio consente di ottenere e impostare uno stato numerico osservabile.
 * 
 * @@Injectable({ providedIn: 'root' })
 */
@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  private obs$: BehaviorSubject<number> = new BehaviorSubject<number>(1)

  constructor() { }

  /**
 * Ottiene l'oggetto BehaviorSubject che rappresenta lo stato numerico.
 * 
 * @returns Un oggetto BehaviorSubject che rappresenta lo stato numerico.
 */
  getObs(): BehaviorSubject<number> {
    return this.obs$
  }

  /**
 * Imposta lo stato numerico tramite l'oggetto BehaviorSubject.
 * Se il valore fornito non è nullo, emette il nuovo valore e lo aggiorna.
 * 
 * @param obs Il nuovo valore da impostare come stato numerico.
 */
  setObs(obs: number): void {
    if (obs !== null) {
      console.log("EMETTO", obs)
      this.obs$.next(obs)
    }
  }
}
