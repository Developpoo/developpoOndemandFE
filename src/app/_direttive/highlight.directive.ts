import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @Input() appHighlight = '' // Colore personalizzato per l'evidenziazione, se specificato.
  @Input() defaultHighlight = '' // Colore di evidenziazione predefinito, se nessun colore personalizzato è specificato.

  constructor(private element: ElementRef) {

  }

  /**
 * Gestisce l'evento 'mouseenter' quando il puntatore del mouse entra nell'elemento.
 * Cambia il colore di evidenziazione dell'elemento.
 */
  @HostListener('mouseenter') onMouseEnter() {
    this.cambiaColore(this.appHighlight || this.defaultHighlight || 'orange')
  }

  /**
 * Gestisce l'evento 'mouseleave' quando il puntatore del mouse esce dall'elemento.
 * Ripristina il colore originale dell'elemento.
 */
  @HostListener('mouseleave') onMouseLeave() {
    this.cambiaColore('transparent')
  }

  /**
 * Cambia il colore dell'elemento in base al colore specificato.
 * @param colore Il colore da applicare all'elemento.
 */
  cambiaColore(colore: string) {
    // this.element.nativeElement.style.backgroundColor = colore
    this.element.nativeElement.style.borderBottom = `2px solid ${colore}`
  }
}
