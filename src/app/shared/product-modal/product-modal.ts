import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Interfaces para este modal ---

/** Datos que el formulario emite al guardar */
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  needsPreparation: boolean;
  image?: File | null;
}

/** Datos que el modal recibe en modo 'edit' */
export interface ProductInitialData {
  name: string;
  price: number;
  stock: number;
  needsPreparation: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-product-modal',
  standalone: false,
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss',
})
export class ProductModal implements OnChanges {

  // --- ENTRADAS (Inputs) ---
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: ProductInitialData | null = null;
  
  // --- SALIDAS (Outputs) ---
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ProductFormData>();

  // --- PROPIEDADES INTERNAS ---
  public productForm: FormGroup;
  public selectedFile: File | null = null;
  public imagePreviewUrl: string | null = null;
  public headerTitle: string = 'Crear Producto';

  constructor(private fb: FormBuilder) {
    // Definimos el formulario con todos los campos nuevos
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      needsPreparation: [false, Validators.required]
    });
  }

  /**
   * Detecta cambios para resetear el formulario cuando se abre.
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
      this.headerTitle = 'Editar Producto';
      // Rellenamos el formulario con los datos iniciales
      this.productForm.patchValue(this.initialData);
      this.imagePreviewUrl = this.initialData.imageUrl;
    } else {
      this.headerTitle = 'Crear Producto';
      // Reseteamos el formulario a sus valores por defecto
      this.productForm.reset({
        name: '',
        price: 0,
        stock: 0,
        needsPreparation: false
      });
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
    if (this.productForm.invalid) {
      return; // No guardar si el formulario es inválido
    }

    // Recogemos los datos del formulario
    const formData: ProductFormData = {
      ...this.productForm.value, // Esto incluye name, price, stock, needsPreparation
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
