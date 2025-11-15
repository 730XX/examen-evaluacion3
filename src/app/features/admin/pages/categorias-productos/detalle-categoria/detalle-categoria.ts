import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductFormData, ProductInitialData } from '../../../../../shared/product-modal/product-modal';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';
import { CategoryService } from '../../../../../core/services/category.service';
import { ProductService } from '../../../../../core/services/product.service';
import { MessageService } from 'primeng/api';

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
export class DetalleCategoria implements OnInit {

  // Propiedades para almacenar los datos de la URL
  public categoriaId: string | null = null;
  public categoriaNombre: string | null = null;
  public categoriaImageUrl: string | null = null; // Para editar la categoría principal

  // Arrays para almacenar los datos de la API
  public subcategorias: Subcategoria[] = [];
  public productosGenerales: ProductoGeneral[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Captura los parámetros de la URL
    this.route.params.subscribe((params) => {
      this.categoriaId = params['id'];
      this.categoriaNombre = params['nombre'];
      this.cargarDatos(this.categoriaId);
    });
  }

  /**
   * Carga subcategorías y productos de la categoría actual desde la API
   */
  private cargarDatos(idCategoria: string | null): void {
    if (!idCategoria) return;
    
    // Cargar subcategorías (category_categoryid = ID de la categoría padre)
    this.cargarSubcategorias(idCategoria);
    
    // Cargar productos generales (sin subcategoría, solo con category_id)
    this.cargarProductosGenerales(idCategoria);
  }

  private cargarSubcategorias(idCategoria: string): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.subcategorias = response.data.filter(
            (cat: Subcategoria) => cat.category_categoryid === idCategoria
          );
        }
      },
      error: (err) => {
      }
    });
  }

  private cargarProductosGenerales(idCategoria: string): void {
    this.productService.getProducts(undefined, undefined, idCategoria).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.productosGenerales = response.data.filter(
            (prod: ProductoGeneral) => prod.category_id === idCategoria
          );
        }
      },
      error: (err) => {
      }
    });
  }

  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: { id?: string; name: string; imageUrl: string } | null = null;
  public modalItemType: 'categoría' | 'subcategoría' = 'subcategoría';

  public productModalVisible: boolean = false;
  public productModalMode: 'create' | 'edit' = 'create';
  public productDataToEdit: ProductInitialData | null = null;
  private currentEditingProductId: string | null = null;


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
        this.crearSubcategoria(formData);
      } else {
        this.editarSubcategoria(formData);
      }
    } else {
      this.editarCategoriaPrincipal(formData);
    }
  }

  /**
   * Crea una nueva subcategoría
   */
  private crearSubcategoria(formData: CategoryFormData): void {
    // Validar duplicados antes de llamar a la API
    const nombreExistente = this.subcategorias.find(
      (sub) => sub.category_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Subcategoría duplicada',
        detail: `Ya existe una subcategoría con el nombre "${formData.name}"`,
        life: 4000
      });
      return;
    }

    const data = {
      category_name: formData.name,
      category_categoryid: this.categoriaId, // ID de la categoría padre
      category_urlimage: formData.imageUrl || '',
      category_state: '1'
    };

    this.categoryService.createCategory(data).subscribe({
      next: (response) => {
        console.log('Subcategoría creada exitosamente:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Subcategoría creada',
          detail: `La subcategoría "${formData.name}" fue creada exitosamente`,
          life: 3000
        });
        
        // Recargar subcategorías
        this.cargarSubcategorias(this.categoriaId!);
      },
      error: (err) => {
        console.error('Error al crear subcategoría:', err);
        
        let errorMsg = 'No se pudo crear la subcategoría';
        
        if (err.status === 409) {
          errorMsg = 'Ya existe una subcategoría con ese nombre';
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
   * Edita una subcategoría existente
   */
  private editarSubcategoria(formData: CategoryFormData): void {
    // TODO: Implementar actualización
    console.log('--- EDITANDO SUBCATEGORÍA ---');
    console.log('ID a editar:', this.dataToEdit?.id);
    console.log('Nuevos Datos:', formData);
  }

  /**
   * Edita la categoría principal
   */
  private editarCategoriaPrincipal(formData: CategoryFormData): void {
    // TODO: Implementar actualización
    console.log('--- EDITANDO CATEGORÍA PRINCIPAL ---');
    console.log('ID a editar:', this.dataToEdit?.id);
    console.log('Nuevos Datos:', formData);
    this.categoriaNombre = formData.name;
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
      this.crearProducto(formData);
    } else {
      this.editarProducto(formData);
    }
  }

  /**
   * Crea un nuevo producto general
   */
  private crearProducto(formData: ProductFormData): void {
    // Validar duplicados antes de llamar a la API
    const nombreExistente = this.productosGenerales.find(
      (prod) => prod.product_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto duplicado',
        detail: `Ya existe un producto con el nombre "${formData.name}"`,
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
      category_id: this.categoriaId, // Producto pertenece a la categoría padre
      product_urlimage: formData.imageUrl || '',
      product_state: '1'
    };

    this.productService.createProduct(data).subscribe({
      next: (response) => {
        console.log('Producto creado exitosamente:', response);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Producto creado',
          detail: `El producto "${formData.name}" fue creado exitosamente`,
          life: 3000
        });
        
        // Recargar productos
        this.cargarProductosGenerales(this.categoriaId!);
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
    const productoOriginal = this.productosGenerales.find(
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
      const nombreDuplicado = this.productosGenerales.find(
        (prod) =>
          prod.product_id !== this.currentEditingProductId &&
          prod.product_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (nombreDuplicado) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Producto duplicado',
          detail: `Ya existe un producto con el nombre "${formData.name}"`,
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
      category_id: this.categoriaId, // Producto pertenece a la categoría padre
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
        this.cargarProductosGenerales(this.categoriaId!);
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
}