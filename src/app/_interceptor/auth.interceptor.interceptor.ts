import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../_servizi/auth.service';
import { Auth } from '../_types/Auth.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  auth: BehaviorSubject<Auth>

  constructor(private authService: AuthService) {
    this.auth = this.authService.leggiObsAuth();
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let richiestaModificata: HttpRequest<any>


    const utenteToken = this.auth.value.token
    if (utenteToken !== null) {
      richiestaModificata = request.clone({
        headers: new HttpHeaders().set("Authorization", `Bearer ${utenteToken}`)
        // headers: new HttpHeaders().set("Authorization", "Basic " + btoa("0:" + utenteToken))
      });
    } else {
      richiestaModificata = request
    }

    return next.handle(richiestaModificata)
  }
}
