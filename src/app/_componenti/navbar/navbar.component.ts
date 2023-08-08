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
//   this.open(this.content)
}
	// open(content: any):any {
	// 	this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
	// 		(result) => {
	// 			this.closeResult = `Closed with: ${result}`;
	// 		},
	// 		(reason) => {
	// 			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	// 		},
	// 	);
	// }

	// private getDismissReason(reason: any): string {
	// 	if (reason === ModalDismissReasons.ESC) {
	// 		return 'by pressing ESC';
	// 	} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	// 		return 'by clicking on a backdrop';
	// 	} else {
	// 		return `with: ${reason}`;
	// 	}
	// }

	// ######################################

	goModal(modal: any): void {
		this.modalComponent.open(modal)
	  }
}
