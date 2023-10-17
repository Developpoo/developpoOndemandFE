import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmVideoRoutingModule } from './film-video-routing.module';
import { UikitModule } from 'src/app/_condivisi/uikit/uikit.module';
import { FilmVideoComponent } from './film-video.component';
import { SafePipe } from 'src/app/safe.pipe';


@NgModule({
  declarations: [
    FilmVideoComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    FilmVideoRoutingModule,
    UikitModule
  ]
})
export class FilmVideoModule { }
