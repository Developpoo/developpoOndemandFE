import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollezioniFilmComponent } from './collezioni-film.component';

const routes: Routes = [
  {
    path: '', component: CollezioniFilmComponent,
    children: [
      { path: 'elenco/:idFilm', loadChildren: () => import('../film/film.module').then(m => m.FilmModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollezioniFilmRoutingModule { }
