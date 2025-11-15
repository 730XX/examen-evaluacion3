import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  needsPreparation: boolean;
  image?: File | null;
  imageUrl?: string;
}

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
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: ProductInitialData | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ProductFormData>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

  private setupModal(): void {
    this.selectedFile = null;

    if (this.mode === 'edit' && this.initialData) {
      this.headerTitle = 'Editar Producto';
      this.productForm.patchValue(this.initialData);
      this.imagePreviewUrl = this.initialData.imageUrl;
    } else {
      this.headerTitle = 'Crear Producto';
      this.imagePreviewUrl = null;
      this.productForm.reset({
        name: '',
        price: 0,
        stock: 0,
        needsPreparation: false
      });
    }
  }

  public onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Construye y emite los datos del formulario.
   * Mantiene la imagen anterior si está en modo edición y no se seleccionó nueva.
   */
  public onSave(): void {
    if (this.productForm.invalid) {
      return;
    }

    let imageUrlToSend = '';
    
    if (this.mode === 'edit' && this.initialData && this.initialData.imageUrl) {
      imageUrlToSend = this.initialData.imageUrl;
    }
    
    if (this.selectedFile) {
      imageUrlToSend = '';
    }

    const formData: ProductFormData = {
      ...this.productForm.value,
      image: this.selectedFile,
      imageUrl: imageUrlToSend
    };
    
    this.save.emit(formData);
    this.closeModal();
  }

  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
