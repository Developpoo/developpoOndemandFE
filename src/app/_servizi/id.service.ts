import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdService {

  // Inizializza il BehaviorSubject con un valore di default (null in questo caso)
  private idSubject = new BehaviorSubject<number | null>(null);

  // Espone il BehaviorSubject come Observable per impedire modifiche esterne
  public idObservable = this.idSubject.asObservable();

  constructor() { }

  // Metodo per impostare l'ID
  setId(id: number) {
    this.idSubject.next(id);
  }

  // Metodo per ottenere l'ID corrente
  getId(): number | null {
    return this.idSubject.getValue();
  }

  // Metodo per cancellare l'ID (opzionale)
  clearId() {
    this.idSubject.next(null);
  }
}
