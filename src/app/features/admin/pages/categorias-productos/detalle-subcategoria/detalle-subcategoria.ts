import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';
import { ProductFormData, ProductInitialData } from '../../../../../shared/product-modal/product-modal';
import { CategoryService } from '../../../../../core/services/category.service';
import { ProductService } from '../../../../../core/services/product.service';
import { MessageService } from 'primeng/api';

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
  product_description?: string
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
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
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
      
      this.cargarDatos(this.subcategoriaId);
    });
  }

  /**
   * Carga la información de la subcategoría y sus productos desde la API
   */
  private cargarDatos(idSubcategoria: string | null): void {
    if (!idSubcategoria) return;
    
    // Cargar información de la subcategoría
    this.cargarInfoSubcategoria(idSubcategoria);
    
    // Cargar productos de esta subcategoría
    this.cargarProductos(idSubcategoria);
  }

  private cargarInfoSubcategoria(idSubcategoria: string): void {
    this.categoryService.getCategoryById(Number(idSubcategoria)).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.subcategoriaInfo = response.data;
        }
      },
      error: (err) => {
      }
    });
  }

  private cargarProductos(idSubcategoria: string): void {
    this.productService.getProducts(undefined, undefined, idSubcategoria).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.productos = response.data.filter(
            (prod: Producto) => prod.category_id === idSubcategoria
          );
        }
      },
      error: (err) => {
      }
    });
  }

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
      this.editarSubcategoria(formData);
    }
  }

  /**
   * Edita la subcategoría actual
   */
  private editarSubcategoria(formData: CategoryFormData): void {
    if (!this.subcategoriaInfo) return;

    // Detectar si hubo cambios
    const sinCambios =
      this.subcategoriaInfo.category_name === formData.name &&
      this.subcategoriaInfo.category_urlimage === (formData.imageUrl || '');

    if (sinCambios) {
      // No mostrar toast, cerrar modal silenciosamente
      this.modalVisible = false;
      return;
    }

    // Actualización local inmediata
    this.subcategoriaNombre = formData.name;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Subcategoría actualizada',
      detail: `La subcategoría fue actualizada a "${formData.name}"`,
      life: 3000
    });
    
    // TODO: Cuando implementes el PUT:
    // const data = {
    //   category_id: this.dataToEdit?.id,
    //   category_name: formData.name,
    //   category_urlimage: formData.imageUrl || '',
    // };
    // this.categoryService.updateCategory(data).subscribe(...);
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
      this.crearProducto(formData);
    } else {
      this.editarProducto(formData);
    }
  }

  /**
   * Crea un nuevo producto en esta subcategoría
   */
  private crearProducto(formData: ProductFormData): void {
    // Validar duplicados antes de llamar a la API
    const nombreExistente = this.productos.find(
      (prod) => prod.product_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto duplicado',
        detail: `Ya existe un producto con el nombre "${formData.name}" en esta subcategoría`,
        life: 4000
      });
      return;
    }

    const data = {
      product_name: formData.name,
      product_price: formData.price,
      product_stock: formData.stock,
      product_description: '',
      product_needpreparation: formData.needsPreparation ? '1' : '0',
      category_id: this.subcategoriaId, // Producto pertenece a la subcategoría
      product_urlimage: formData.imageUrl || '',
      product_state: '1'
    };

    this.productService.createProduct(data).subscribe({
      next: (response) => {
        console.log('Producto creado exitosamente en subcategoría:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Producto creado',
          detail: `El producto "${formData.name}" fue creado exitosamente`,
          life: 3000
        });
        
        // Recargar productos
        this.cargarProductos(this.subcategoriaId!);
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        
        let errorMsg = 'No se pudo crear el producto';
        
        if (err.status === 409) {
          errorMsg = 'Ya existe un producto con ese nombre';
        } else if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifique la información';
        } else if (err.status === 404) {
          errorMsg = 'Servicio no disponible';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }

  /**
   * Edita un producto existente
   */
  private editarProducto(formData: ProductFormData): void {
    if (!this.currentEditingProductId) return;

    // Buscar el producto original
    const productoOriginal = this.productos.find(
      (prod) => prod.product_id === this.currentEditingProductId
    );

    if (!productoOriginal) return;

    // Detectar si hubo cambios
    const sinCambios =
      productoOriginal.product_name === formData.name &&
      parseFloat(productoOriginal.product_price) === formData.price &&
      parseFloat(productoOriginal.product_stock) === formData.stock &&
      productoOriginal.product_needpreparation === (formData.needsPreparation ? '1' : '0') &&
      productoOriginal.product_urlimage === (formData.imageUrl || '');

    if (sinCambios) {
      // No mostrar toast, cerrar modal silenciosamente
      this.productModalVisible = false;
      return;
    }

    // Validar duplicado de nombre (solo si cambió el nombre)
    if (productoOriginal.product_name !== formData.name) {
      const nombreDuplicado = this.productos.find(
        (prod) =>
          prod.product_id !== this.currentEditingProductId &&
          prod.product_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (nombreDuplicado) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Producto duplicado',
          detail: `Ya existe un producto con el nombre "${formData.name}" en esta subcategoría`,
          life: 4000
        });
        return;
      }
    }

    const data = {
      product_id: this.currentEditingProductId,
      product_name: formData.name,
      product_price: formData.price,
      product_stock: formData.stock,
      product_description: '',
      product_needpreparation: formData.needsPreparation ? '1' : '0',
      category_id: this.subcategoriaId, // Producto pertenece a la subcategoría
      product_urlimage: formData.imageUrl || '',
      product_state: '1'
    };

    this.productService.updateProduct(data).subscribe({
      next: (response) => {
        console.log('Producto actualizado exitosamente:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Producto actualizado',
          detail: `El producto "${formData.name}" fue actualizado exitosamente`,
          life: 3000
        });
        
        // Recargar productos
        this.cargarProductos(this.subcategoriaId!);
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        
        let errorMsg = 'No se pudo actualizar el producto';
        
        if (err.status === 409) {
          errorMsg = 'Ya existe un producto con ese nombre';
        } else if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifique la información';
        } else if (err.status === 404) {
          errorMsg = 'Producto no encontrado';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }

  // (Aquí irían los métodos para el modal de Productos: showCreateProductDialog, showEditProductDialog, etc.)
}
