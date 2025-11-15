import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { SalonesMesas } from './pages/salones-mesas/salones-mesas';
import { CategoriasProductos } from './pages/categorias-productos/categorias-productos';
import { Clientes } from './pages/clientes/clientes';
import { SharedModule } from "../../shared/shared-module";
import { ListadoCategorias } from './pages/categorias-productos/listado-categorias/listado-categorias';
import { DetalleCategoria } from './pages/categorias-productos/detalle-categoria/detalle-categoria';
import { DetalleSubcategoria } from './pages/categorias-productos/detalle-subcategoria/detalle-subcategoria';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';



@NgModule({
  declarations: [
    Admin,
    SalonesMesas,
    CategoriasProductos,
    Clientes,
    ListadoCategorias,
    DetalleCategoria,
    DetalleSubcategoria,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ButtonModule,
    Dialog
]
})
export class AdminModule { }
