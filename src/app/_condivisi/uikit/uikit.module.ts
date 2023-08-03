import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsCardComponent } from './_componenti/bs-card/bs-card.component';
import { RouterModule } from '@angular/router';


const COMPONENTI = [BsCardComponent]

@NgModule({
  declarations: [
    ...COMPONENTI
  ],
  exports: [
    ...COMPONENTI
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class UikitModule { }
