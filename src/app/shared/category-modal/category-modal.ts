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
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: { name: string, imageUrl: string } | null = null;
  @Input() itemType: string = 'categoría';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CategoryFormData>();

  public categoryForm: FormGroup;
  public selectedFile: File | null = null;
  public imagePreviewUrl: string | null = null;
  public headerTitle: string = 'Crear categoría';

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

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

  public onSave(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const formData: CategoryFormData = {
      name: this.categoryForm.value.name,
      image: this.selectedFile
    };
    
    this.save.emit(formData);
    this.closeModal();
  }

  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
