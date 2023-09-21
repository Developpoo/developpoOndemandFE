import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_componenti/login/login.component';
import { GenereComponent } from './_pagine/genere/genere.component';
import { FilmComponent } from './_pagine/film/film.component';
import { ModalComponent } from './_componenti/modal/modal.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule) },
  { path: 'home', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule) },
  { path: 'login', component: LoginComponent },
  { path: 'contatti', loadChildren: () => import('./_pagine/contatti/contatti.module').then(m => m.ContattiModule) },
  { path: 'serietv', loadChildren: () => import('./_pagine/serie-tv/serie-tv.module').then(m => m.SerieTVModule) },
  { path: 'genere', loadChildren: () => import('./_pagine/genere/genere.module').then(m => m.GenereModule) },
  { path: 'genere/:idFilm', loadChildren: () => import('./_pagine/film/film.module').then(m => m.FilmModule) },
  // { path: 'genere', component: GenereComponent, children:[
  //   {path: ':idFilm', component: FilmComponent}
  // ] },
  { path: 'preferiti', loadChildren: () => import('./_pagine/preferiti/preferiti.module').then(m => m.PreferitiModule) },
  { path: 'novita', loadChildren: () => import('./_pagine/novita/novita.module').then(m => m.NovitaModule) },
  { path: 'chisono', loadChildren: () => import('./_pagine/chisono/chisono.module').then(m => m.ChisonoModule) },
  { path: 'collezioni', loadChildren: () => import('./_pagine/collezioni-film/collezioni-film.module').then(m => m.CollezioniFilmModule) },
  { path: 'upload', loadChildren: () => import('./_pagine/upload/upload.module').then(m => m.UploadModule) },
  { path: '**', loadChildren: () => import('./_pagine/not-found404/not-found404.module').then(m => m.NotFound404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
