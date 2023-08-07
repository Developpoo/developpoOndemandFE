import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoIndirizzo } from 'src/app/_types/tipoIndirizzo.type';

@Component({
  selector: 'app-chisono',
  templateUrl: './chisono.component.html',
  styleUrls: ['./chisono.component.scss']
})
export class ChisonoComponent implements OnInit, OnDestroy {

  elencoTipo$: Observable<IRispostaServer>;
  dati: TipoIndirizzo[] = []

  private distruggi$ = new Subject<void>()

  constructor(private api: ApiService) {
    this.elencoTipo$ = this.api.getTipoIndirizzi()
  }

  ngOnInit(): void {
    this.elencoTipo$.pipe(
      map(x => x.data)
    ).subscribe({
      next: x => this.dati = x
    })
  }

  ngOnDestroy(): void {
    this.distruggi$.next()
  }

}
