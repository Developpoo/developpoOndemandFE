import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenereRoutingModule } from './genere-routing.module';
import { GenereComponent } from './genere.component';
import { UikitModule } from 'src/app/_condivisi/uikit/uikit.module';


@NgModule({
  declarations: [
    GenereComponent
  ],
  imports: [
    CommonModule,
    GenereRoutingModule,
    UikitModule
  ]
})
export class GenereModule { }
