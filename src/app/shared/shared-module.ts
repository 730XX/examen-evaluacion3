import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBar } from './side-bar/side-bar';
import { NavBar } from './nav-bar/nav-bar';
import { RouterLink } from '@angular/router';



@NgModule({
  declarations: [
    SideBar,
    NavBar
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    SideBar,
    NavBar
  ]
})
export class SharedModule { }
