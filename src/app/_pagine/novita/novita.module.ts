import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovitaRoutingModule } from './novita-routing.module';
import { NovitaComponent } from './novita.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";


@NgModule({
    declarations: [
        NovitaComponent
    ],
    imports: [
        CommonModule,
        NovitaRoutingModule,
        UikitModule
    ]
})
export class NovitaModule { }
