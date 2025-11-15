import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';


@NgModule({
  declarations: [
     Login,
    Register
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
],
   exports: [
    Login,
    Register
  ]
})
export class CoreModule { }
