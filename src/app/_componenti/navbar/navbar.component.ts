import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/_condivisi/uikit/_componenti/modal/modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

@Output("avviaModal") selezionaEvent = new EventEmitter()
@ViewChild(ModalComponent) modalComponent!: ModalComponent;

  closeResult = '';
  content="";

	constructor(private modalService: NgbModal) {}

ngOnInit(): void {
}

	goModal(modal: any): void {
		this.modalComponent.open(modal)
	  }
}
