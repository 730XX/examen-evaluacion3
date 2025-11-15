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
      icon: 'restaurant',
    },
    {
      title: 'Categorías y Productos',
      href: '/admin/listado-categorias-productos',
      icon: 'category',
    },
    {
      title: 'Clientes',
      href: '/admin/clientes',
      icon: 'group',
    },
  ];
}
