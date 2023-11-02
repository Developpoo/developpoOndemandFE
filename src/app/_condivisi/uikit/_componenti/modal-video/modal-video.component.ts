import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss']
})
export class ModalVideoComponent {
  @ViewChild('content', { static: false }) content: any;
  @Input() title!: string;
  @Input() confirmButtonText!: string;
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  /**
   * Questo componente rappresenta un modulo di dialogo personalizzato per la visualizzazione di video.
   * Accetta un titolo e un testo per il pulsante di conferma.
   */

  /**
   * Mostra il modulo di dialogo.
   */
  // showModal() {
  //   this.modalService.open(this.content);
  // }
  showModal() {
    this.modalService.open(this.content, { size: 'xl', centered: true });
  }


  /**
   * Nasconde il modulo di dialogo.
   */
  hideModal() {
    this.modalService.dismissAll();
  }

  /**
   * Gestisce l'azione di conferma e nasconde il modulo di dialogo.
   */
  onConfirm() {
    // Emite l'evento di conferma
    this.confirm.emit();

    // Nasconde il modulo di dialogo
    this.hideModal();
  }


}
