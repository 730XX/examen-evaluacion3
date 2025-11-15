import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBar } from './side-bar/side-bar';
import { NavBar } from './nav-bar/nav-bar';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CategoryCard } from './category-card/category-card';
import { CategoryModal } from './category-modal/category-modal';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModal } from './product-modal/product-modal';
import { CustomerModal } from './customer-modal/customer-modal';
import { LoungeModal } from './lounge-modal/lounge-modal';



@NgModule({
  declarations: [
    SideBar,
    NavBar,
    CategoryCard,
    CategoryModal,
    ProductModal,
    CustomerModal,
    LoungeModal
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    ButtonModule,
    Dialog,
    Select,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SideBar,
    NavBar,
    CategoryCard,
    CategoryModal,
    ProductModal,
    CustomerModal,
    LoungeModal
  ]
})
export class SharedModule { }
