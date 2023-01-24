import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MintNowComponent } from './mint-now.component';

const routes: Routes = [{ path: '', component: MintNowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MintNowRoutingModule { }
