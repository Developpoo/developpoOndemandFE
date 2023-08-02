import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerieTVRoutingModule } from './serie-tv-routing.module';
import { SerieTVComponent } from './serie-tv.component';


@NgModule({
  declarations: [
    SerieTVComponent
  ],
  imports: [
    CommonModule,
    SerieTVRoutingModule
  ]
})
export class SerieTVModule { }
