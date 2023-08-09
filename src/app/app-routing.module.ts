import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_componenti/login/login.component';
import { ModalComponent } from './_condivisi/uikit/_componenti/modal/modal.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule) },
  { path: 'home', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule) },
  { path: 'login', component: LoginComponent },
  // { path: 'modal', component: ModalComponent },
  { path: 'contatti', loadChildren: () => import('./_pagine/contatti/contatti.module').then(m => m.ContattiModule) },
  { path: 'serietv', loadChildren: () => import('./_pagine/serie-tv/serie-tv.module').then(m => m.SerieTVModule) },
  { path: 'genere/:idFilm', loadChildren: () => import('./_pagine/film/film.module').then(m => m.FilmModule) },
  { path: 'preferiti', loadChildren: () => import('./_pagine/preferiti/preferiti.module').then(m => m.PreferitiModule) },
  { path: 'novita', loadChildren: () => import('./_pagine/novita/novita.module').then(m => m.NovitaModule) },
  { path: 'genere', loadChildren: () => import('./_pagine/genere/genere.module').then(m => m.GenereModule) },
  { path: 'chisono', loadChildren: () => import('./_pagine/chisono/chisono.module').then(m => m.ChisonoModule) },
  { path: 'collezioni', loadChildren: () => import('./_pagine/collezioni-film/collezioni-film.module').then(m => m.CollezioniFilmModule) },
  { path: '**', loadChildren: () => import('./_pagine/not-found404/not-found404.module').then(m => m.NotFound404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
