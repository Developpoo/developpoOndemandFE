import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChisonoRoutingModule } from './chisono-routing.module';
import { ChisonoComponent } from './chisono.component';


@NgModule({
  declarations: [
    ChisonoComponent
  ],
  imports: [
    CommonModule,
    ChisonoRoutingModule
  ]
})
export class ChisonoModule { }
