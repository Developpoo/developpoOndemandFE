import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferitiRoutingModule } from './preferiti-routing.module';
import { PreferitiComponent } from './preferiti.component';


@NgModule({
  declarations: [
    PreferitiComponent
  ],
  imports: [
    CommonModule,
    PreferitiRoutingModule
  ]
})
export class PreferitiModule { }
