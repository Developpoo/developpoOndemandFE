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

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log('DragOver');
    this.renderer.addClass(this.el.nativeElement, 'dragdrop-hover');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log('DragLeave');
    this.renderer.removeClass(this.el.nativeElement, 'dragdrop-hover');
  }

  @HostListener('drop', ['$event']) onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop');
    if (e.dataTransfer !== null && e.dataTransfer.files.length > 0) {
      this.alRilascio.emit(e.dataTransfer.files);
      console.log('Drop', e.dataTransfer.files);
      this.renderer.removeClass(this.el.nativeElement, 'dragdrop-hover');
    }
  }
}
