import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenereRoutingModule } from './genere-routing.module';
import { GenereComponent } from './genere.component';


@NgModule({
  declarations: [
    GenereComponent
  ],
  imports: [
    CommonModule,
    GenereRoutingModule
  ]
})
export class GenereModule { }
