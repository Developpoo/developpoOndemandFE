import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDragdrop]',
})
export class DragdropDirective {
  @Output() alRilascio = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  /**
 * Gestisce l'evento 'dragover' quando un oggetto viene trascinato sopra l'elemento.
 * Aggiunge una classe CSS per evidenziare l'area di destinazione.
 * @param e L'evento DragEvent associato a 'dragover'.
 */
  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault(); // Impedisce il comportamento predefinito del browser per 'dragover'.
    e.stopPropagation(); // Interrompe la propagazione dell'evento
    console.log('DragOver'); // Stampa un messaggio di debug nella console.
    this.renderer.addClass(this.el.nativeElement, 'dragdrop-hover'); // Aggiunge una classe CSS per evidenziare l'area di destinazione.
  }

  /**
   * Gestisce l'evento 'dragleave' quando un oggetto viene trascinato fuori dall'elemento.
   * Rimuove la classe CSS di evidenziazione.
   * @param e L'evento DragEvent associato a 'dragleave'.
   */
  @HostListener('dragleave', ['$event']) onDragLeave(e: DragEvent) {
    e.preventDefault(); // Impedisce il comportamento predefinito del browser per 'dragleave'.
    e.stopPropagation(); // Interrompe la propagazione dell'evento.
    console.log('DragLeave'); // Stampa un messaggio di debug nella console.
    this.renderer.removeClass(this.el.nativeElement, 'dragdrop-hover'); // Rimuove la classe CSS di evidenziamento.
  }

  /**
 * Gestisce l'evento 'drop' quando un oggetto viene rilasciato nell'elemento.
 * Emette un evento personalizzato con i file trascinati e rimuove la classe CSS di evidenziamento.
 * @param e L'evento DragEvent associato a 'drop'.
 */
  @HostListener('drop', ['$event']) onDrop(e: DragEvent) {
    e.preventDefault();  // Impedisce il comportamento predefinito del browser per 'drop'.
    e.stopPropagation(); // Interrompe la propagazione dell'evento.
    console.log('Drop'); // Stampa un messaggio di debug nella console.
    // Verifica se ci sono file trascinati nell'evento.
    if (e.dataTransfer !== null && e.dataTransfer.files.length > 0) {
      // Emette un evento personalizzato con i file trascinati come dati.
      this.alRilascio.emit(e.dataTransfer.files);
      console.log('Drop', e.dataTransfer.files); // Stampa i file trascinati nella console.
      this.renderer.removeClass(this.el.nativeElement, 'dragdrop-hover'); // Rimuove la classe CSS di evidenziamento.
    }
  }
}
