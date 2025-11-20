import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin';
import { SalonesMesas } from './pages/salones-mesas/salones-mesas';
import { CategoriasProductos } from './pages/categorias-productos/categorias-productos';
import { Clientes } from './pages/clientes/clientes';
import { ListadoCategorias } from './pages/categorias-productos/listado-categorias/listado-categorias';
import { DetalleCategoria } from './pages/categorias-productos/detalle-categoria/detalle-categoria';
import { DetalleSubcategoria } from './pages/categorias-productos/detalle-subcategoria/detalle-subcategoria';
import { Usuarios } from './pages/usuarios/usuarios';
import { InformeVentas } from './pages/informe-ventas/informe-ventas';

const routes: Routes = [
  // Todas las rutas aquí están bajo el prefijo 'admin/'
  {
    path: '',
    component: Admin,
    children: [
      // <router-outlet>
      {
        path: 'salonesymesas',
        component: SalonesMesas
      },
      
      // --- Flujo de Rutas: Categorías y Productos ---
      {
        path: 'listado-categorias-productos', // -> /admin/listado-categorias-productos
        component: CategoriasProductos, // Carga el "Wrapper" (el que solo tiene <router-outlet>)
        children: [
          {
            // Página 1: Listado de Categorías Principales
            path: '', // Coincide con /admin/listado-categorias-productos
            component: ListadoCategorias
          },
          {
            // Página 2: Detalle de Categoría (muestra Subcategorías)
            // Coincide con /admin/listado-categorias-productos/categoria/1/Bebidas
            path: 'categoria/:id/:nombre', 
            component: DetalleCategoria
          },
          {
            // Página 3: Detalle de Subcategoría (muestra Productos)
            // Coincide con /admin/listado-categorias-productos/categoria/1/Bebidas/subcategorias/4/Bebidas Frias
            path: 'categoria/:id/:nombre/subcategorias/:subId/:subNombre',
            component: DetalleSubcategoria
          }
        ]
      },
      {
        path: 'clientes', // -> admin/clientes
        component: Clientes
      },
      // Redirección por defecto DENTRO de admin
      {
        path: '',
        redirectTo: 'salonesymesas', // Redirige 'admin/' a 'admin/salonesymesas'
        pathMatch: 'full'
      },

      {
        path: 'usuarios', // -> admin/usuarios
        component: Usuarios
      },

      {
        path : 'informe-ventas', // -> admin/informe-ventas
        component: InformeVentas
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
