import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovitaRoutingModule } from './novita-routing.module';
import { NovitaComponent } from './novita.component';


@NgModule({
  declarations: [
    NovitaComponent
  ],
  imports: [
    CommonModule,
    NovitaRoutingModule
  ]
})
export class NovitaModule { }
