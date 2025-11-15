import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { SalonesMesas } from './pages/salones-mesas/salones-mesas';
import { CategoriasProductos } from './pages/categorias-productos/categorias-productos';
import { Clientes } from './pages/clientes/clientes';
import { SharedModule } from "../../shared/shared-module";


@NgModule({
  declarations: [
    Admin,
    SalonesMesas,
    CategoriasProductos,
    Clientes
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
]
})
export class AdminModule { }
