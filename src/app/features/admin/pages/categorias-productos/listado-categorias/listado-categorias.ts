import { Component, OnInit } from '@angular/core';
import { CategoryFormData } from '../../../../../shared/category-modal/category-modal';
import { CategoryService } from '../../../../../core/services/category.service';
import { MessageService } from 'primeng/api';

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


  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarCategoriasPrincipales();
    }
  

  /**
   * Obtiene y filtra las categorías principales (padre sin categoría superior).
   */
  private cargarCategoriasPrincipales(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.categoriasPrincipales = response.data.filter(
            (cat: CategoriaPrincipal) => cat.category_categoryid === '0'
          );
        }
      },
      error: (err) => {
      }
    });
  }

  public showCreateCategoryDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.modalVisible = true;
  }

  public showEditCategoryDialog(event: MouseEvent, categoria: CategoriaPrincipal): void {
    event.stopPropagation();
    event.preventDefault();

    this.modalMode = 'edit';
    this.dataToEdit = {
      name: categoria.category_name,
      imageUrl: categoria.category_urlimage
    };
    this.modalVisible = true;
  }

  /**
   * Se llama cuando el modal emite el evento 'save'.
   * @param formData Los datos del formulario que vienen del modal
   */
  public onModalSave(formData: CategoryFormData): void {
    if (this.modalMode === 'create') {
      this.crearCategoria(formData);
    } else {
      this.editarCategoria(formData);
    }
  }

  private crearCategoria(formData: CategoryFormData): void {
    const nombreExistente = this.categoriasPrincipales.find(
      (cat) => cat.category_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Categoría duplicada',
        detail: `Ya existe una categoría con el nombre "${formData.name}"`,
        life: 4000
      });
      return;
    }

    if (formData.image) {
      return;
    } else {
      const data = {
        category_name: formData.name,
        category_categoryid: 0,
        category_urlimage: '',
        category_state: '1'
      };

      this.categoryService.createCategory(data).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categoría creada',
            detail: `La categoría "${formData.name}" fue creada exitosamente`,
            life: 3000
          });
          this.cargarCategoriasPrincipales();
        },
        error: (err) => {
          let errorMsg = 'No se pudo crear la categoría';
          
          if (err.status === 409) {
            errorMsg = 'Ya existe una categoría con ese nombre';
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
  }

  private editarCategoria(formData: CategoryFormData): void {
  }
  
}
