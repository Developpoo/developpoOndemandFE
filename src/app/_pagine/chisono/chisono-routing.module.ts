import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChisonoComponent } from './chisono.component';

const routes: Routes = [{ path: '', component: ChisonoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChisonoRoutingModule { }
