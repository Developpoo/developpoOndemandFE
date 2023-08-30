import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent } from 'src/app/_condivisi/uikit/_componenti/modal/modal.component';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  colore:string = ''

  // isVisible:boolean = false;

  // getGreetingMessage(): string {
  //   const currentHour = this.currentTime.getHours();
    
  //   if (currentHour >= 0 && currentHour < 12) {
  //     return 'Buongiorno!';
  //   } else if (currentHour >= 12 && currentHour < 18) {
  //     return 'Buon pomeriggio!';
  //   } else {
  //     return 'Buona serata!';
  //   }
  // }

  currentTime: Date = new Date();

  getGreetingMessage(): string {
    const currentHour = this.currentTime.getHours();
    let greetingMessage: string;
  
    switch (true) {
      case currentHour >= 0 && currentHour < 15:
        greetingMessage = 'buongiorno';
        break;
      case currentHour >= 15 && currentHour < 19:
        greetingMessage = 'buonPomeriggio';
        break;
        case currentHour >= 19 && currentHour < 22:
        greetingMessage = 'buonasera';
        break;
      default:
        greetingMessage = 'salve';
        break;
    }
  
    return greetingMessage;
  }
  
  //  RICHIAMO MODAL
  @Output("avviaModal") selezionaEvent = new EventEmitter()
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  closeResult = '';
  content="";
  auth!: BehaviorSubject<Auth>

	constructor(private modalService: NgbModal, private authService: AuthService) {
    this.auth = this.authService.leggiObsAuth()
  }

  ngOnInit(): void {
  }

	goModal(modal: any): void {
		this.modalComponent.open(modal)
  }
}
