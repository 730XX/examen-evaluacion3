import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CategoryFormData {
  name: string;
  image?: File | null;
  imageUrl?: string | null;
}

@Component({
  selector: 'app-category-modal',
  standalone: false,
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.scss',
})
export class CategoryModal implements OnChanges {

  // --- ENTRADAS (Inputs) ---

  /** Controla la visibilidad del modal (two-way binding) */
  @Input() visible: boolean = false;
  /** Cambia el título y la lógica a 'create' o 'edit' */
  @Input() mode: 'create' | 'edit' = 'create';
  /** Recibe los datos para rellenar el formulario en modo 'edit' */
  @Input() initialData: { name: string, imageUrl: string } | null = null;
  /** El sustantivo a usar en el título (ej: "categoría" o "subcategoría") */
  @Input() itemType: string = 'categoría';

  // --- SALIDAS (Outputs) ---

  /** Emite el evento para cerrar el modal (para two-way binding) */
  @Output() visibleChange = new EventEmitter<boolean>();
  /** Emite los datos del formulario al guardar */
  @Output() save = new EventEmitter<CategoryFormData>();

  // --- PROPIEDADES INTERNAS ---
  public categoryForm: FormGroup;
  public selectedFile: File | null = null;
  public imagePreviewUrl: string | null = null;
  public headerTitle: string = 'Crear categoría';

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  /**
   * Hook que detecta cambios en los @Inputs.
   * Lo usamos para resetear el formulario cuando se abre.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

  /**
   * Configura el modal según el modo (create/edit).
   */
  private setupModal(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;

    if (this.mode === 'edit' && this.initialData) {
      this.headerTitle = `Editar ${this.itemType}`;
      this.categoryForm.patchValue({ name: this.initialData.name });
      this.imagePreviewUrl = this.initialData.imageUrl;
    } else {
      this.headerTitle = `Crear ${this.itemType}`;
      this.categoryForm.reset();
    }
  }

  /**
   * Se llama cuando el usuario selecciona un archivo.
   */
  public onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Emite los datos del formulario y cierra el modal.
   */
  public onSave(): void {
    if (this.categoryForm.invalid) {
      return; // No guardar si el formulario es inválido
    }

    const formData: CategoryFormData = {
      name: this.categoryForm.value.name,
      image: this.selectedFile
    };
    
    this.save.emit(formData);
    this.closeModal();
  }

  /**
   * Cierra el modal emitiendo el evento.
   */
  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
