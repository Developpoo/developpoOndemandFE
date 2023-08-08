import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from 'src/app/_componenti/navbar/navbar.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges {

	@Input("startModal") ogModal: any | null = null
	
	closeResult = '';
  content="";

	constructor(private modalService: NgbModal) {}

ngOnInit(): void {
  // this.open(this.content)
}

ngOnChanges(changes: SimpleChanges): void {
    if (changes["startModal"].currentValue) {
      this.open(this.ogModal);
    }
  }
	open(content:any):any {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
