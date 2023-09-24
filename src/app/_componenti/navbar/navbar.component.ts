import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // BehaviorSubject che contiene le informazioni sull'autenticazione dell'utente
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()
  // Variabile per il colore dell'elemento grafico
  colore: string = ''
  // Oggetto che rappresenta l'orario corrente
  currentTime: Date = new Date();

  /**
* Costruttore del componente NavbarComponent.
* @param authService Servizio di autenticazione per gestire lo stato dell'utente.
*/
  constructor(private authService: AuthService) { }

  /**
 * Ottiene un messaggio di saluto in base all'orario corrente.
 * @returns Messaggio di saluto (buongiorno, buon pomeriggio, buonasera o salve).
 */
  getGreetingMessage(): string {
    const currentHour = this.currentTime.getHours();
    let greetingMessage: string;

    switch (true) {
      case currentHour >= 7 && currentHour < 15:
        greetingMessage = 'buongiorno';
        break;
      case currentHour >= 15 && currentHour < 19:
        greetingMessage = 'buonPomeriggio';
        break;
      case currentHour >= 19 && currentHour < 23:
        greetingMessage = 'buonasera';
        break;
      default:
        greetingMessage = 'salve';
        break;
    }
    return greetingMessage;
  }
}
