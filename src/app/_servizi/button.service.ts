import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {

  private obs$: BehaviorSubject<number> = new BehaviorSubject<number>(1)

  constructor() { }

  getObs(): BehaviorSubject<number>{
    return this.obs$
  }

  setObs(obs:number):void {
    if(obs !== null){
      console.log("EMETTO", obs)
      this.obs$.next(obs)
    }
  }
}
