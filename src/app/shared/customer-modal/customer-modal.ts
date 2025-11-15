import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  typeDocument: string;
  numberDocument: string;
  address: string;
  country: string;
  birthdate?: string;
  state: string;
}

export interface CustomerInitialData {
  name: string;
  email: string;
  phone: string;
  typeDocument: string;
  numberDocument: string;
  address: string;
  country: string;
  birthdate?: string;
  state: string;
}

@Component({
  selector: 'app-customer-modal',
  standalone: false,
  templateUrl: './customer-modal.html',
  styleUrl: './customer-modal.scss',
})
export class CustomerModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: CustomerInitialData | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CustomerFormData>();

  public customerForm: FormGroup;
  public headerTitle: string = 'Crear Cliente';
  public documentTypes: any[] = [
    { label: 'DNI', value: '1' },
    { label: 'RUC', value: '2' },
    { label: 'Carnet de Extranjería', value: '3' },
    { label: 'Otro', value: '4' }
  ];

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      typeDocument: ['1', Validators.required], // Default 'DNI'
      numberDocument: ['', Validators.required],
      address: [''],
      country: [''],
      birthdate: [''],
      state: ['1'] // Default 'Activo'
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

  private setupModal(): void {
    if (this.mode === 'edit' && this.initialData) {
      this.headerTitle = 'Editar Cliente';
      this.customerForm.patchValue(this.initialData);
    } else {
      this.headerTitle = 'Crear Cliente';
      this.customerForm.reset({
        name: '',
        email: '',
        phone: '',
        typeDocument: '1',
        numberDocument: '',
        address: '',
        country: '',
        birthdate: '',
        state: '1'
      });
    }
  }

  public onSave(): void {
    if (this.customerForm.invalid) {
      return;
    }
    
    this.save.emit(this.customerForm.value);
    this.closeModal();
  }

  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
