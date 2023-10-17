import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Questa classe definisce un tubo personalizzato denominato 'safe' che è responsabile
   * di sanificare un URL e restituire una versione sicura dell'URL come SafeResourceUrl.
   *
   * @param url L'URL che si desidera sanificare.
   * @returns Un SafeResourceUrl che rappresenta l'URL sanificato.
   */
  transform(url: string): SafeResourceUrl {
    // Utilizziamo il servizio DomSanitizer per bypassare la sicurezza e ottenere un SafeResourceUrl
    // dall'URL fornito.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
