import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // non funziona valutare  se creare un qualcosa lato backend o cercare le credenziali per qualche provider che mi rilasci il servizio


  // private emailApiUrl = 'https://www.googleapis.com/gmail/v1/users/xalessiodannax@gmail.com/messages/send';


  // constructor(private http: HttpClient) { }

  // // Invia il form al tuo indirizzo email
  // inviaEmail(formData: any): Observable<any> {
  //   return this.http.post(this.emailApiUrl, formData);
  // }

  // // Invia la risposta automatica all'utente
  // inviaRispostaAutomatica(emailUtente: string): Observable<any> {
  //   const messaggioRisposta = 'Grazie di averci contattato. Il nostro staff ti risponderà al più presto.';

  //   return this.http.post(this.emailApiUrl, { email: emailUtente, messaggio: messaggioRisposta });
  // }
}
