import { Component, OnInit } from '@angular/core';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';
interface CategoriaPrincipal {
  category_id: string;
  category_name: string;
  category_categoryid: string;
  category_urlimage: string;
  category_state: string;
  cantidad_productos: string;
}

@Component({
  selector: 'app-listado-categorias',
  standalone: false,
  templateUrl: './listado-categorias.html',
  styleUrl: './listado-categorias.scss',
})
export class ListadoCategorias implements OnInit {
  // Almacena los datos de la API
  public categoriasPrincipales: CategoriaPrincipal[] = [];

  // --- Propiedades para controlar el Modal ---
  
  /** Controla si el modal está visible */
  public modalVisible: boolean = false;
  
  /** Controla si el modal está en modo 'create' o 'edit' */
  public modalMode: 'create' | 'edit' = 'create';
  
  /** Almacena los datos para enviar al modal en modo 'edit' */
  public dataToEdit: { name: string, imageUrl: string } | null = null;


  constructor() { }

  ngOnInit(): void {
    this.cargarCategoriasPrincipales();
    }
  

  /**
   * Carga datos de ejemplo para la vista principal de categorías.
   * (Usando los datos exactos que proporcionaste)
   */
  private cargarCategoriasPrincipales(): void {
    this.categoriasPrincipales = [
      {
        category_id: '1',
        category_name: 'Bebidas',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1748589974/pidemesa/imagenes/20250530/cloud-2c253a19c1b944e0a79f19682cc65142-normal.png',
        category_state: '1',
        cantidad_productos: '24',
      },
      {
        category_id: '2',
        category_name: 'Pollo a la brasa',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1748590665/pidemesa/imagenes/20250530/cloud-4b9189f69c19483f8f076904353e4516-normal.jpg',
        category_state: '1',
        cantidad_productos: '21',
      },
      {
        category_id: '6',
        category_name: 'Combos Familiares',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1752941613/pidemesa/imagenes/20250719/cloud-7518a28bc9484ae6b0cb563482576f07-normal.jpg',
        category_state: '1',
        cantidad_productos: '11',
      },
      {
        category_id: '7',
        category_name: 'Pollo Broaster ',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1749776737/pidemesa/imagenes/20250612/cloud-59d4d841c9f44d38a61e06efea302dc0-normal.jpg',
        category_state: '1',
        cantidad_productos: '15',
      },
      {
        category_id: '8',
        category_name: 'Pollo leña ',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1749823723/pidemesa/imagenes/20250613/cloud-db5f9255156040219a20f293c846ca9e-normal.jpg',
        category_state: '1',
        cantidad_productos: '7',
      },
      {
        category_id: '9',
        category_name: 'Piezas de Pollo a la Brasa ',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1749826357/pidemesa/imagenes/20250613/cloud-e71b16deebed4dda81ee0c5906139349-normal.png',
        category_state: '1',
        cantidad_productos: '5',
      },
      {
        category_id: '16',
        category_name: 'trtyrty',
        category_categoryid: '0',
        category_urlimage: '',
        category_state: '1',
        cantidad_productos: '0',
      },
      {
        category_id: '18',
        category_name: 'Prueba Academia EDIT',
        category_categoryid: '0',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1763159532/pidemesa/imagenes/20251114/cloud-d79a633a2dbf4e01b33c6e0aa17e428f-normal.jpg',
        category_state: '1',
        cantidad_productos: '0',
      },
    ];
  }

  // --- Métodos que controlan el Modal ---

  /**
   * Muestra el modal en modo 'Crear'.
   * Es llamado por el botón "Crear Categoría".
   */
  
  public showCreateCategoryDialog(): void {
    this.modalMode = 'create'; // Pone el modal en modo "Crear"
    this.dataToEdit = null; // Borra datos de ediciones anteriores
    this.modalVisible = true; // ¡Abre el modal!
  }

  /**
   * Muestra el modal en modo 'Editar'.
   * (Lo llamarías desde un botón de "editar" en la card)
   * @param event El evento del mouse (para $event.stopPropagation())
   * @param categoria La categoría a editar.
   */
  public showEditCategoryDialog(event: MouseEvent, categoria: CategoriaPrincipal): void {
    event.stopPropagation(); // Previene la navegación
    event.preventDefault();

    this.modalMode = 'edit'; // Pone el modal en modo "Editar"
    this.dataToEdit = { // Pasa los datos actuales
      name: categoria.category_name,
      imageUrl: categoria.category_urlimage
    };
    this.modalVisible = true; // ¡Abre el modal!
  }

  /**
   * Se llama cuando el modal emite el evento 'save'.
   * @param formData Los datos del formulario que vienen del modal
   */
  public onModalSave(formData: CategoryFormData): void {
    if (this.modalMode === 'create') {
      console.log('--- CREANDO CATEGORÍA ---');
      console.log('Nombre:', formData.name);
      console.log('Archivo:', formData.image);
      // ... Aquí llamas a tu servicio POST para crear ...

    } else {
      console.log('--- EDITANDO CATEGORÍA ---');
      // console.log('ID a editar:', this.dataToEdit.id); // Necesitarías pasar el ID
      console.log('Nuevo Nombre:', formData.name);
      console.log('Nuevo Archivo (si hay):', formData.image);
      // ... Aquí llamas a tu servicio PUT para actualizar ...
    }
    
    // El modal se cierra solo automáticamente porque
    // la propiedad 'visible' se actualiza a 'false'
    // dentro del modal y se propaga con el binding de [(visible)].
  }
  
}
