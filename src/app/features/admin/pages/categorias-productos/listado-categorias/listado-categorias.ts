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
   * Carga las categorías principales desde la API.
   * Filtra solo las que tienen category_categoryid: "0" (son padres)
   */
  private cargarCategoriasPrincipales(): void {
    // Llamada al servicio sin filtros (trae todas)
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        console.log('Response completo:', response);
        
        // La API devuelve {tipo, data, mensajes}
        if (response && response.data) {
          // Filtramos solo las categorías principales (category_categoryid: "0")
          this.categoriasPrincipales = response.data.filter(
            (cat: CategoriaPrincipal) => cat.category_categoryid === '0'
          );
          console.log('Categorías principales cargadas:', this.categoriasPrincipales);
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
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
      this.crearCategoria(formData);
    } else {
      this.editarCategoria(formData);
    }
  }

  /**
   * Crea una nueva categoría principal
   */
  private crearCategoria(formData: CategoryFormData): void {
    // Validar duplicados antes de llamar a la API
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
      return; // No hace la petición a la API
    }

    // Si hay un archivo de imagen, necesitamos usar FormData
    // Si no, podemos enviar JSON simple
    
    if (formData.image) {
      // TODO: Implementar subida de imagen con FormData
      console.log('Creando categoría con imagen:', formData.image);
      // const formDataToSend = new FormData();
      // formDataToSend.append('category_name', formData.name);
      // formDataToSend.append('category_categoryid', '0');
      // formDataToSend.append('category_state', '1');
      // formDataToSend.append('image', formData.image);
    } else {
      // Crear sin imagen
      const data = {
        category_name: formData.name,
        category_categoryid: 0, // 0 = categoría principal
        category_urlimage: '',
        category_state: '1' // Activa por defecto
      };

      this.categoryService.createCategory(data).subscribe({
        next: (response) => {
          console.log('Categoría creada exitosamente:', response);
          
          // Toast de éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Categoría creada',
            detail: `La categoría "${formData.name}" fue creada exitosamente`,
            life: 3000
          });
          
          // Recargar la lista
          this.cargarCategoriasPrincipales();
        },
        error: (err) => {
          console.error('Error al crear categoría:', err);
          
          // Toast de error con mensaje contextual
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

  /**
   * Edita una categoría existente
   */
  private editarCategoria(formData: CategoryFormData): void {
    // TODO: Necesitarás pasar el ID de la categoría a editar
    // Por ahora solo mostramos en consola
    console.log('--- EDITANDO CATEGORÍA ---');
    console.log('Nuevo Nombre:', formData.name);
    console.log('Nueva URL de imagen:', formData.imageUrl);
    
    // Cuando implementes edición, el código sería algo así:
    // const data = {
    //   category_id: this.currentEditId,
    //   category_name: formData.name,
    //   category_urlimage: formData.imageUrl || '',
    // };
    // this.categoryService.updateCategory(data).subscribe(...);
  }
  
}
