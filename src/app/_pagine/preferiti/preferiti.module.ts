import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferitiRoutingModule } from './preferiti-routing.module';
import { PreferitiComponent } from './preferiti.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";


@NgModule({
    declarations: [
        PreferitiComponent
    ],
    imports: [
        CommonModule,
        PreferitiRoutingModule,
        UikitModule
    ]
})
export class PreferitiModule { }
