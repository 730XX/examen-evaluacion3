import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin';
import { SalonesMesas } from './pages/salones-mesas/salones-mesas';
import { CategoriasProductos } from './pages/categorias-productos/categorias-productos';
import { Clientes } from './pages/clientes/clientes';

const routes: Routes = [
  // --- RUTAS ANIDADAS ---
  // Todas las rutas aquí están bajo el prefijo 'admin/'
  {
    path: '', // El path vacío ('admin/')
    component: Admin, // Carga el LAYOUT (con el sidebar)
    children: [
      // --- Estas rutas se cargarán DENTRO del <router-outlet> del AdminComponent ---
      {
        path: 'salonesymesas', // -> admin/salonesymesas
        component: SalonesMesas
      },
      {
        path: 'categoriasyproductos', // -> admin/categoriasyproductos
        component: CategoriasProductos
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
