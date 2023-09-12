import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './_componenti/navbar/navbar.component';
import { FooterComponent } from './_componenti/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './_componenti/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffcanvasComponent } from './_condivisi/uikit/_componenti/offcanvas/offcanvas.component';
import { HighlightDirective } from './_direttive/highlight.directive';
import { UploadImgComponent } from './_condivisi/uikit/_componenti/upload-img/upload-img.component';
import { DragdropDirective } from './_direttive/dragdrop.directive';
import { ModalComponent } from './_componenti/modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalComponent
  ]
})
export class AppModule { }
