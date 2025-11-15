import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';
import { ProductFormData, ProductInitialData } from '../../../../../shared/product-modal/product-modal';
/**
 * Define la estructura de la información de la Subcategoría
 * (basado en tu API, el primer JSON)
 */
interface SubcategoriaDetalle {
  category_id: string;
  category_name: string;
  category_categoryid: string; // ID de la categoría padre
  category_urlimage: string;
  category_state: string;
}

/**
 * Define la estructura de un Producto final
 * (basado en tu API, el segundo JSON)
 */
interface Producto {
  product_id: string;
  product_name: string;
  product_price: string;
  product_stock: string;
  product_urlimage: string;
  product_state: string;
  category_id: string; // ID de esta subcategoría
  product_needpreparation: string;
  product_creationdate: string;
}

@Component({
  selector: 'app-detalle-subcategoria',
  standalone: false,
  templateUrl: './detalle-subcategoria.html',
  styleUrl: './detalle-subcategoria.scss',
})
export class DetalleSubcategoria implements OnInit {
 // Propiedades para almacenar los datos de la URL
  public categoriaId: string | null = null;
  public categoriaNombre: string | null = null;
  public subcategoriaId: string | null = null;
  public subcategoriaNombre: string | null = null;

  // Propiedades para almacenar los datos de la API
  public subcategoriaInfo: SubcategoriaDetalle | null = null;
  public productos: Producto[] = [];

  // --- Propiedades para controlar el Modal de CATEGORÍA ---
  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: { id?: string; name: string; imageUrl: string } | null = null;
  public modalItemType: 'categoría' | 'subcategoría' = 'subcategoría';

  // --- Propiedades para controlar el Modal de PRODUCTO ---
  public productModalVisible: boolean = false;
  public productModalMode: 'create' | 'edit' = 'create';
  public productDataToEdit: ProductInitialData | null = null;
  private currentEditingProductId: string | null = null; // Para saber qué ID editar

  constructor(
    private route: ActivatedRoute // Inyecta el servicio para leer la ruta activa
  ) {}

  ngOnInit(): void {
    // Captura TODOS los parámetros de la URL para armar la vista
    this.route.params.subscribe((params) => {
      // De la Categoría Padre (Página 2)
      this.categoriaId = params['id'];
      this.categoriaNombre = params['nombre'];

      // De esta Subcategoría (Página 3)
      this.subcategoriaId = params['subId'];
      this.subcategoriaNombre = params['subNombre'];
      
      this.cargarDatosDeEjemplo(this.subcategoriaId);
    });
  }

  /**
   * Carga datos de ejemplo basados en el ID de la subcategoría.
   */

  private cargarDatosDeEjemplo(idSubcategoria: string | null): void {
    // Solo cargamos datos si el ID es "4" (Bebidas Frias), como en tu ejemplo
    if (idSubcategoria === '4') {
      // Carga la información de la Subcategoría
      this.subcategoriaInfo = {
        category_id: '4',
        category_name: 'Bebidas Frias',
        category_categoryid: '1',
        category_urlimage:
          'https://res.cloudinary.com/dbqljhwdf/image/upload/v1752941764/pidemesa/imagenes/20250719/cloud-78d25b2489b4451a8f5852b076cbcfc9-normal.jpg',
        category_state: '1',
      };

      // Carga los Productos de esta subcategoría
      this.productos = [
        {
          product_id: '5',
          product_name: 'Jarra - Limonada Frozen ',
          product_price: '20.00',
          product_stock: '16.00',
          product_urlimage:
            'https://res.cloudinary.com/dbqljhwdf/image/upload/v1749775808/pidemesa/imagenes/20250612/cloud-9db76b7614934067ac52df0b367a3254-normal.jpg',
          product_state: '1',
          category_id: '4',
          product_needpreparation: '1',
          product_creationdate: '2025-06-01 03:05:24',
        },
        {
          product_id: '12',
          product_name: 'Jarra - Chicha morada ',
          product_price: '20.00',
          product_stock: '8.00',
          product_urlimage:
            'https://res.cloudinary.com/dbqljhwdf/image/upload/v1750876114/pidemesa/imagenes/20250625/cloud-d0d413eb9c5f495cb6ffd0c9bacc8e25-normal.png',
          product_state: '1',
          category_id: '4',
          product_needpreparation: '1',
          product_creationdate: '2025-06-12 20:00:41',
        },
        {
          product_id: '14',
          product_name: 'Botella de 3L - Coca Cola',
          product_price: '20.50',
          product_stock: '19.00',
          product_urlimage:
            'https://res.cloudinary.com/dbqljhwdf/image/upload/v1750874954/pidemesa/imagenes/20250625/cloud-516523523d8d4ed289b4d939552fa7ba-normal.png',
          product_state: '1',
          category_id: '4',
          product_needpreparation: '0',
          product_creationdate: '2025-06-12 20:09:54',
        },
        // ... (el resto de tus productos)
        {
          product_id: '58',
          product_name: '1 Botella - Vino Blanco',
          product_price: '13.00',
          product_stock: '17.00',
          product_urlimage:
            'https://res.cloudinary.com/dbqljhwdf/image/upload/v1750875913/pidemesa/imagenes/20250625/cloud-eb3e2b5b75b1481586c2783506eab1d8-normal.png',
          product_state: '1',
          category_id: '4',
          product_needpreparation: '0',
          product_creationdate: '2025-06-25 13:25:31',
        },
      ];
    }
  }

   // --- Métodos que controlan el Modal de CATEGORÍA ---

  public showEditSubcategoryDialog(): void {
    if (!this.subcategoriaInfo) return; 

    this.modalMode = 'edit';
    this.modalItemType = 'subcategoría'; 
    this.dataToEdit = {
      id: this.subcategoriaInfo.category_id,
      name: this.subcategoriaInfo.category_name,
      imageUrl: this.subcategoriaInfo.category_urlimage,
    };
    this.modalVisible = true; 
  }

  public onModalSave(formData: CategoryFormData): void {
    if (this.modalMode === 'edit') {
      console.log('--- EDITANDO SUBCATEGORÍA ---');
      console.log('ID a editar:', this.dataToEdit?.id); 
      console.log('Nuevo Nombre:', formData.name);
      // ... servicio PUT ...
      this.subcategoriaNombre = formData.name;
    }
  }

  // --- Métodos que controlan el Modal de PRODUCTO ---

  /**
   * Muestra el modal para CREAR un PRODUCTO en esta subcategoría.
   */
  public showCreateProductDialog(): void {
    this.productModalMode = 'create';
    this.productDataToEdit = null;
    this.currentEditingProductId = null;
    this.productModalVisible = true;
  }

  /**
   * Muestra el modal para EDITAR un PRODUCTO.
   */
  public showEditProductDialog(producto: Producto): void {
    this.productModalMode = 'edit';
    this.currentEditingProductId = producto.product_id; // Guardamos el ID
    this.productDataToEdit = {
      name: producto.product_name,
      price: parseFloat(producto.product_price),
      stock: parseFloat(producto.product_stock),
      needsPreparation: producto.product_needpreparation === '1',
      imageUrl: producto.product_urlimage
    };
    this.productModalVisible = true;
  }

  /**
   * Se llama cuando el modal de PRODUCTO emite el evento 'save'.
   */
  public onProductModalSave(formData: ProductFormData): void {
    if (this.productModalMode === 'create') {
      console.log('--- CREANDO PRODUCTO (en Subcategoría) ---');
      console.log('Datos:', formData);
      console.log('Para Subcategoría ID:', this.subcategoriaId); // Importante
      // ... servicio POST para crear producto ...

    } else {
      console.log('--- EDITANDO PRODUCTO ---');
      console.log('ID a editar:', this.currentEditingProductId);
      console.log('Nuevos Datos:', formData);
      // ... servicio PUT para actualizar producto ...
    }
  }

  // (Aquí irían los métodos para el modal de Productos: showCreateProductDialog, showEditProductDialog, etc.)
}
