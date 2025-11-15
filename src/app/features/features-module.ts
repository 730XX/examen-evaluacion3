import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModule } from './admin/admin-module';



@NgModule({
  declarations: [
    //AdminModule
  ],
  imports: [
    CommonModule,
    AdminModule
  ],

  exports: [
    AdminModule
  ]
})
export class FeaturesModule { }
