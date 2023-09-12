import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  closeResult = '';
  content = "";
  auth: BehaviorSubject<Auth> = this.authService.leggiObsAuth()

  colore: string = ''

  currentTime: Date = new Date();

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

  constructor(private modalService: NgbModal, private authService: AuthService) { }

}
