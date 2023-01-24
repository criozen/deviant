import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirdropRoutingModule } from './airdrop-routing.module';
import { AirdropComponent } from './airdrop.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AirdropComponent
  ],
  imports: [
    CommonModule,
    AirdropRoutingModule,
    SharedModule,
  ]
})
export class AirdropModule { }
