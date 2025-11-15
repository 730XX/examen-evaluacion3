import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { Register } from './core/auth/register/register';

const routes: Routes = [
  // Rutas de Autenticación
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- RUTA PRINCIPAL DEL POS ---
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },

  // Redirección por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } //alternativa a 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}
