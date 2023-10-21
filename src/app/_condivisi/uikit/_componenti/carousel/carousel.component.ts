import { Component, HostListener, OnInit } from '@angular/core';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Immagine } from 'src/app/_types/Immagine.type';

@Component({
  selector: 'app-carousel',
  // standalone: true,
  // imports: [NgbCarouselModule, NgIf],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class CarouselComponent implements OnInit {
  // images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/1200/700`);
  images: string[] = []
  windowHeight!: number;
  windowWidth!: number;

  constructor(
    config: NgbCarouselConfig,
    private api: ApiService
  ) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    const windowWidth = window.innerWidth;
    this.updateWindowSize();
    this.updateImages();
  }

  updateWindowSize(): void {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  updateImages(): void {
    this.api.getFile().subscribe(
      (response: IRispostaServer) => {
        if (response && response.data && Array.isArray(response.data)) {
          // Filtra solo i file con idTipoFile uguale a 3 e mappa il loro src
          let imagesArray = response.data
            .filter((file: Immagine) => file.idTipoFile === 3)
            .map((file: Immagine) => file.src);

          // Mescola l'array delle immagini
          this.images = this.shuffle(imagesArray);
        } else {
          console.error('La risposta non contiene dati validi.');
        }
      },
      (error) => {
        console.error('Errore durante il recupero delle immagini:', error);
      }
    );
  }


  shuffle(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    // Mentre ci sono elementi da mescolare...
    while (currentIndex !== 0) {
      // Scegli un elemento a caso...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // E scambialo con l'elemento attuale.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }


}
