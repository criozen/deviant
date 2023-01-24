import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { NavbarComponent } from './navbar/navbar.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    SharedComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    IvyCarouselModule,
    NgxDropzoneModule
  ],
  exports: [
    NavbarComponent,
    IvyCarouselModule,
    NgxDropzoneModule
  ]
})
export class SharedModule { }
