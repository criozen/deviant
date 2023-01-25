import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MintNowRoutingModule } from './mint-now-routing.module';
import { MintNowComponent } from './mint-now.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MintNowComponent
  ],
  imports: [
    CommonModule,
    MintNowRoutingModule,
    SharedModule,
    FormsModule,
    
  ]
})
export class MintNowModule { }
