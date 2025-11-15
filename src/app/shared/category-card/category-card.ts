import { Component, computed, Input, input, output } from '@angular/core';
interface Category {
  id: number;
  name: string;
  productCount: number;
}

// --- DATOS INICIALES ---
const initialCategories: Category[] = [
  { id: 1, name: "Bebidas", productCount: 24 },
  { id: 2, name: "Pollo a la brasa", productCount: 21 },
  { id: 3, name: "Combos Familiares", productCount: 11 },
  { id: 4, name: "Pollo Broaster", productCount: 15 },
  { id: 5, name: "Pollo leña", productCount: 7 },
  { id: 6, name: "Piezas de Pollo a la Brasa", productCount: 5 },
  { id: 7, name: "trtyrtty", productCount: 0 },
  { id: 8, name: "Prueba Academia EDIT", productCount: 0 },
];

@Component({
  selector: 'app-category-card',
  standalone: false,
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {


  @Input() title: string | null = 'Sin Título';

  /**
   * El conteo a mostrar (ej: "24" o "16")
   */
  @Input() count: string | number | null = 0;

  /**
   * El array de ruta para el [routerLink].
   * ¡Esta es la clave de la reutilización!
   * El padre decide a dónde navega.
   */
  @Input() routerPath: (string | number)[] = [];

  constructor() { }

}
