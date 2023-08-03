import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollezioniFilmRoutingModule } from './collezioni-film-routing.module';
import { CollezioniFilmComponent } from './collezioni-film.component';
import { UikitModule } from 'src/app/_condivisi/uikit/uikit.module';


@NgModule({
  declarations: [
    CollezioniFilmComponent
  ],
  imports: [
    CommonModule,
    CollezioniFilmRoutingModule,
    UikitModule
  ]
})
export class CollezioniFilmModule { }
