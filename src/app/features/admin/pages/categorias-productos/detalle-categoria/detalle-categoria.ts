import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; // <--- Añadido OnInit
import { ActivatedRoute } from '@angular/router';
import { ProductFormData, ProductInitialData } from '../../../../../shared/product-modal/product-modal';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';

// --- Importar interfaces de los DOS modales ---


interface Subcategoria {
  category_id: string;
  category_name: string;
  category_categoryid: string; // ID de la categoría padre (ej: "1" para Bebidas)
  category_urlimage: string;
  category_state: string;
  cantidad_productos: string;
}

interface ProductoGeneral {
  product_id: string;
  product_name: string;
  product_price: string;
  product_stock: string;
  product_urlimage: string;
  product_state: string;
  category_id: string; // ID de la categoría padre
  product_needpreparation: string;
  product_creationdate: string;
}

@Component({
  selector: 'app-detalle-categoria',
  standalone: false,
  templateUrl: './detalle-categoria.html',
  styleUrl: './detalle-categoria.scss',
})
export class DetalleCategoria implements OnInit { // <--- Implementado OnInit

  // Propiedades para almacenar los datos de la URL
  public categoriaId: string | null = null;
  public categoriaNombre: string | null = null;
  public categoriaImageUrl: string | null = null; // Para editar la categoría principal

  // Arrays para almacenar los datos de la API
  public subcategorias: Subcategoria[] = [];
  public productosGenerales: ProductoGeneral[] = [];

  constructor(
    private route: ActivatedRoute // Inyecta el servicio para leer la ruta activa
  ) {}

  ngOnInit(): void {
    // Captura los parámetros de la URL
    this.route.params.subscribe((params) => {
      this.categoriaId = params['id'];
      this.categoriaNombre = params['nombre'];
      this.cargarDatosDeEjemplo(this.categoriaId);
    });
  }

  private cargarDatosDeEjemplo(idCategoria: string | null): void {
    if (idCategoria === '1') {
      this.categoriaImageUrl = 'https://...url-categoria-principal.png'; 
      this.subcategorias = [
         {
            "category_id": "4",
            "category_name": "Bebidas Frias",
            "category_categoryid": "1",
            "category_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1752941764\/pidemesa\/imagenes\/20250719\/cloud-78d25b2489b4451a8f5852b076cbcfc9-normal.jpg",
            "category_state": "1",
            "cantidad_productos": "16"
        },
        {
            "category_id": "17",
            "category_name": "Bebidas Calientes",
            "category_categoryid": "1",
            "category_urlimage": "",
            "category_state": "1",
            "cantidad_productos": "0"
        },
        {
            "category_id": "19",
            "category_name": "Bebidas Tibias",
            "category_categoryid": "1",
            "category_urlimage": "",
            "category_state": "1",
            "cantidad_productos": "0"
        }
        // ...
      ];
      this.productosGenerales = [
         {
            "product_id": "1",
            "product_name": "Agua cielo sin gas 625 ml",
            "product_price": "2.00",
            "product_stock": "-8.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749922838\/pidemesa\/imagenes\/20250614\/cloud-afb75c63d95c4a4b9dfa34d180347f6d-normal.webp",
            "product_state": "0",
            "category_id": "1",
            "product_needpreparation": "0",
            "product_creationdate": "2025-05-30 02:28:53"
        },
        {
            "product_id": "2",
            "product_name": "Jarra de Jugo de Mango",
            "product_price": "17.50",
            "product_stock": "19.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749923115\/pidemesa\/imagenes\/20250614\/cloud-c774f0c59fda4593be9747405444598e-normal.jpg",
            "product_state": "1",
            "category_id": "1",
            "product_needpreparation": "1",
            "product_creationdate": "2025-05-30 02:33:29"
        },
        {
            "product_id": "10",
            "product_name": "Inka Kola 1L",
            "product_price": "5.00",
            "product_stock": "-1.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749775340\/pidemesa\/imagenes\/20250612\/cloud-5a7e7cffe61b4a80ad80a26e41e994d1-normal.png",
            "product_state": "1",
            "category_id": "1",
            "product_needpreparation": "0",
            "product_creationdate": "2025-06-12 19:37:00"
        },
        {
            "product_id": "11",
            "product_name": "Jarra de Jugo de Maracuy\u00e1",
            "product_price": "17.90",
            "product_stock": "19.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749923440\/pidemesa\/imagenes\/20250614\/cloud-9ca85a45b05344e7b789ee73d5d35ad5-normal.jpg",
            "product_state": "1",
            "category_id": "1",
            "product_needpreparation": "1",
            "product_creationdate": "2025-06-12 19:57:00"
        },
        {
            "product_id": "13",
            "product_name": "Jarra de Limonada",
            "product_price": "17.90",
            "product_stock": "13.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749776846\/pidemesa\/imagenes\/20250612\/cloud-b0f54f104c264bc29fa080213b5aebb5-normal.avif",
            "product_state": "1",
            "category_id": "1",
            "product_needpreparation": "1",
            "product_creationdate": "2025-06-12 20:06:13"
        },
        {
            "product_id": "15",
            "product_name": "Coca Cola 3L",
            "product_price": "20.00",
            "product_stock": "-4.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1750873823\/pidemesa\/imagenes\/20250625\/cloud-468bfe6b672b4b34b4e17659272037ba-normal.png",
            "product_state": "1",
            "category_id": "1",
            "product_needpreparation": "0",
            "product_creationdate": "2025-06-12 20:35:57"
        },
        {
            "product_id": "16",
            "product_name": "1 Botella - Cerveza Pilsen",
            "product_price": "13.00",
            "product_stock": "2.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1750876244\/pidemesa\/imagenes\/20250625\/cloud-42b651e322ec46bb836e9afe294e6d63-normal.png",
            "product_state": "0",
            "category_id": "1",
            "product_needpreparation": "0",
            "product_creationdate": "2025-06-12 20:44:26"
        },
        {
            "product_id": "17",
            "product_name": "Jarra de jugo de Naranja",
            "product_price": "20.00",
            "product_stock": "15.00",
            "product_urlimage": "https:\/\/res.cloudinary.com\/dbqljhwdf\/image\/upload\/v1749923500\/pidemesa\/imagenes\/20250614\/cloud-dcdc79abadce4d7a847360eca74c916f-normal.webp",
            "product_state": "0",
            "category_id": "1",
            "product_needpreparation": "1",
            "product_creationdate": "2025-06-12 20:48:18"
        }
        // ...
      ];
    }
  }

  // --- Propiedades para controlar el Modal de CATEGORÍAS ---
  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: { id?: string; name: string; imageUrl: string } | null = null;
  public modalItemType: 'categoría' | 'subcategoría' = 'subcategoría';

  // --- Propiedades para controlar el Modal de PRODUCTOS ---
  public productModalVisible: boolean = false;
  public productModalMode: 'create' | 'edit' = 'create';
  public productDataToEdit: ProductInitialData | null = null;
  private currentEditingProductId: string | null = null; // Para saber qué ID editar

  // --- Métodos que controlan el Modal de CATEGORÍAS ---

  public showCreateSubcategoryDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.modalItemType = 'subcategoría'; 
    this.modalVisible = true;
  }

  public showEditMainCategoryDialog(): void {
    this.modalMode = 'edit';
    this.dataToEdit = {
      id: this.categoriaId!,
      name: this.categoriaNombre!,
      imageUrl: this.categoriaImageUrl || '', 
    };
    this.modalItemType = 'categoría'; 
    this.modalVisible = true;
  }

  public showEditSubcategoryDialog(event: MouseEvent, subcategoria: Subcategoria): void {
    event.stopPropagation(); 
    event.preventDefault();

    this.modalMode = 'edit';
    this.dataToEdit = {
      id: subcategoria.category_id,
      name: subcategoria.category_name,
      imageUrl: subcategoria.category_urlimage,
    };
    this.modalItemType = 'subcategoría'; 
    this.modalVisible = true;
  }

  public onModalSave(formData: CategoryFormData): void {
    if (this.modalItemType === 'subcategoría') {
      if (this.modalMode === 'create') {
        console.log('--- CREANDO SUBCATEGORÍA ---');
        console.log('Datos:', formData);
        console.log('ID de categoría padre:', this.categoriaId); // Importante
        // ... servicio POST ...
      } else {
        console.log('--- EDITANDO SUBCATEGORÍA ---');
        console.log('ID a editar:', this.dataToEdit?.id);
        console.log('Nuevos Datos:', formData);
        // ... servicio PUT ...
      }
    } else {
      console.log('--- EDITANDO CATEGORÍA PRINCIPAL ---');
      console.log('ID a editar:', this.dataToEdit?.id);
      console.log('Nuevos Datos:', formData);
      // ... servicio PUT ...
      this.categoriaNombre = formData.name;
    }
  }

  // --- Métodos que controlan el Modal de PRODUCTOS ---

  /**
   * Muestra el modal para CREAR un PRODUCTO GENERAL.
   */
  public showCreateProductDialog(): void {
    this.productModalMode = 'create';
    this.productDataToEdit = null;
    this.currentEditingProductId = null;
    this.productModalVisible = true;
  }

  /**
   * Muestra el modal para EDITAR un PRODUCTO GENERAL.
   */
  public showEditProductDialog(producto: ProductoGeneral): void {
    this.productModalMode = 'edit';
    this.currentEditingProductId = producto.product_id; // Guardamos el ID
    this.productDataToEdit = {
      name: producto.product_name,
      // Convertimos los strings de la API a los tipos que espera el formulario
      price: parseFloat(producto.product_price),
      stock: parseFloat(producto.product_stock),
      needsPreparation: producto.product_needpreparation === '1', // Convertir '1'/'0' a boolean
      imageUrl: producto.product_urlimage
    };
    this.productModalVisible = true;
  }

  /**
   * Se llama cuando el modal de PRODUCTO emite el evento 'save'.
   */
  public onProductModalSave(formData: ProductFormData): void {
    if (this.productModalMode === 'create') {
      console.log('--- CREANDO PRODUCTO ---');
      console.log('Datos:', formData);
      console.log('Para Categoría ID:', this.categoriaId); // Producto general de la categoría padre
      // ... servicio POST para crear producto ...

    } else {
      console.log('--- EDITANDO PRODUCTO ---');
      console.log('ID a editar:', this.currentEditingProductId);
      console.log('Nuevos Datos:', formData);
      // ... servicio PUT para actualizar producto ...
    }
  }
}