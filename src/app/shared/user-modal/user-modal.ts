import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  state: string;
}

export interface UserInitialData {
  name: string;
  email: string;
  role: string;
  state: string;
}

@Component({
  selector: 'app-user-modal',
  standalone: false,
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: UserInitialData | null = null;
  @Input() roles: any[] = [];
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<UserFormData>();

  public userForm: FormGroup;
  public headerTitle: string = 'Crear Usuario';

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['3', Validators.required], // Default: Mesero/Mozo
      state: ['1', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

  private setupModal(): void {
    if (this.mode === 'edit' && this.initialData) {
      this.headerTitle = 'Editar Usuario';
      // En modo edición, password no es requerido
      this.userForm.get('password')?.clearAsyncValidators();
      this.userForm.get('password')?.setValidators([]);
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.userForm.patchValue(this.initialData);
    } else {
      this.headerTitle = 'Crear Usuario';
      // En modo creación, password es requerido
      this.userForm.get('password')?.setValidators([Validators.required]);
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.userForm.reset({
        name: '',
        email: '',
        password: '',
        role: '3', // Default: Mesero/Mozo
        state: '1'
      });
    }
  }

  public onSave(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    this.save.emit(this.userForm.value);
    this.closeModal();
  }

  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
