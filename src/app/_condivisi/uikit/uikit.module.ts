import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsCardComponent } from './_componenti/bs-card/bs-card.component';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './_componenti/carousel/carousel.component';


const COMPONENTI = [
  BsCardComponent,
  CarouselComponent
];

@NgModule({
  declarations: [
    ...COMPONENTI
  ],
  exports: [
    ...COMPONENTI
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbCarouselModule
  ]
})
export class UikitModule { }
