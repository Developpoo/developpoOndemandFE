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

  /**
 * Intercepta le richieste HTTP in uscita e aggiunge l'header "Authorization" con il token dell'utente (se presente) prima di inviare la richiesta.
 * @param request La richiesta HTTP originale.
 * @param next Il gestore della richiesta HTTP successiva.
 * @returns Un'observable contenente l'evento HTTP risultante dalla richiesta modificata.
 */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let richiestaModificata: HttpRequest<any>


    const utenteToken = this.auth.value.token
    if (utenteToken !== null) {
      // Clona la richiesta originale e aggiunge l'header "Authorization" con il token dell'utente.
      richiestaModificata = request.clone({
        headers: new HttpHeaders().set("Authorization", `Bearer ${utenteToken}`)
        // headers: new HttpHeaders().set("Authorization", "Basic " + btoa("0:" + utenteToken))
      });
    } else {
      // Se l'utente non ha un token, utilizza la richiesta originale senza alcuna modifica.
      richiestaModificata = request
    }
    // Inoltra la richiesta modificata al gestore successivo.
    return next.handle(richiestaModificata)
  }
}
