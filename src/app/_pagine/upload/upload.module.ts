import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { UikitModule } from 'src/app/_condivisi/uikit/uikit.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UploadComponent,
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
    UikitModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UploadModule { }
