import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './_componenti/navbar/navbar.component';
import { FooterComponent } from './_componenti/footer/footer.component';
import { ContattiModule } from './_pagine/contatti/contatti.module';
import { FilmModule } from './_pagine/film/film.module';
import { GenereModule } from './_pagine/genere/genere.module';
import { HomeModule } from './_pagine/home/home.module';
import { NotFound404Module } from './_pagine/not-found404/not-found404.module';
import { NovitaModule } from './_pagine/novita/novita.module';
import { PreferitiModule } from './_pagine/preferiti/preferiti.module';
import { SerieTVModule } from './_pagine/serie-tv/serie-tv.module';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ContattiModule,
    FilmModule,
    GenereModule,
    HomeModule,
    NotFound404Module,
    NovitaModule,
    PreferitiModule,
    SerieTVModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
