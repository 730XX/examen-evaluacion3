import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModule } from './admin/admin-module';
import { SharedModule } from '../shared/shared-module';



@NgModule({
  declarations: [
    //AdminModule
  ],
  imports: [
    CommonModule,
    AdminModule,
    SharedModule
  ],

  exports: [
    AdminModule,
    SharedModule
  ]
})
export class FeaturesModule { }
