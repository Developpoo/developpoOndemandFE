import { Component } from '@angular/core';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-offcanvas',
	templateUrl: './offcanvas.component.html',
	styleUrls: ['./offcanvas.component.scss']
})
export class OffcanvasComponent {
	// Variabile per memorizzare il risultato della chiusura o del dismiss dell'offcanvas
	closeResult = '';

	constructor(private offcanvasService: NgbOffcanvas) { }

	/**
 * Apre un offcanvas con il contenuto specificato.
 * @param content Contenuto da visualizzare nell'offcanvas.
 */
	open(content: any): any {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				// Gestisce la chiusura dell'offcanvas
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				// Gestisce il dismiss dell'offcanvas
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	/**
 * Ottiene la ragione del dismiss dell'offcanvas.
 * @param reason La ragione del dismiss.
 * @returns Una stringa che descrive la ragione del dismiss.
 */
	private getDismissReason(reason: any): string {
		if (reason === OffcanvasDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on the backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
