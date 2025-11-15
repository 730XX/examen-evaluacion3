import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {
  navItems = [
    {
      title: 'Salones y Mesas',
      href: '/admin/salonesymesas',
      icon: 'restaurant', // Icono de Google
    },
    {
      title: 'Categorías y Productos',
      href: '/admin/listado-categorias-productos',
      icon: 'category', // Icono de Google
    },
    {
      title: 'Clientes',
      href: '/admin/clientes',
      icon: 'group', // Icono de Google
    },
    {
      title: 'Usuarios',
      href: '/admin/usuarios', // Asumí esta ruta para "Usuarios"
      icon: 'manage_accounts', // Icono de Google
    },
  ];
}
