import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovitaComponent } from './novita.component';

const routes: Routes = [{ path: '', component: NovitaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovitaRoutingModule { }
