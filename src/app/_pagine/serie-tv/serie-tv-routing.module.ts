import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SerieTVComponent } from './serie-tv.component';

const routes: Routes = [{ path: '', component: SerieTVComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerieTVRoutingModule { }
