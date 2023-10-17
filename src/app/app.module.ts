import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './_componenti/navbar/navbar.component';
import { FooterComponent } from './_componenti/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './_componenti/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffcanvasComponent } from './_condivisi/uikit/_componenti/offcanvas/offcanvas.component';
import { HighlightDirective } from './_direttive/highlight.directive';
import { UploadImgComponent } from './_condivisi/uikit/_componenti/upload-img/upload-img.component';
import { DragdropDirective } from './_direttive/dragdrop.directive';
import { ModalComponent, ModalComponentForm } from './_componenti/modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './_interceptor/auth.interceptor.interceptor';
import { DatabaseComponent } from './_componenti/database/database.component';
import { DatabaseModalUtenteComponent } from './_componenti/database-modal-utente/database-modal-utente.component';
import { FormVisibilityService } from './_servizi/formVisibility.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DatabaseModalGenereComponent } from './_componenti/database-modal-genere/database-modal-genere.component';
import { DatabaseModalFilmComponent } from './_componenti/database-modal-film/database-modal-film.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    OffcanvasComponent,
    HighlightDirective,
    UploadImgComponent,
    DragdropDirective,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    FormVisibilityService
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalComponent,
    ModalComponentForm,
    DatabaseComponent,
    DatabaseModalUtenteComponent,
    MatDialogModule,
    DatabaseModalGenereComponent,
    DatabaseModalFilmComponent,
    NgbModule
  ]
})
export class AppModule { }
