import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmVideoComponent } from './film-video.component';

const routes: Routes = [{ path: '', component: FilmVideoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmVideoRoutingModule { }
