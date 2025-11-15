import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface LoungeFormData {
  name: string;
  tableCount: number;
  state: string;
}

export interface LoungeInitialData {
  name: string;
  tableCount: number;
  state: string;
}

@Component({
  selector: 'app-lounge-modal',
  standalone: false,
  templateUrl: './lounge-modal.html',
  styleUrl: './lounge-modal.scss',
})
export class LoungeModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: LoungeInitialData | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<LoungeFormData>();

  public loungeForm: FormGroup;
  public headerTitle: string = 'Crear Salón';

  constructor(private fb: FormBuilder) {
    this.loungeForm = this.fb.group({
      name: ['', Validators.required],
      tableCount: [0, [Validators.required, Validators.min(0)]],
      state: ['1', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setupModal();
    }
  }

  get tableCountCtrl(): FormControl {
    return this.loungeForm.get('tableCount') as FormControl;
  }

  private setupModal(): void {
    if (this.mode === 'edit' && this.initialData) {
      this.headerTitle = 'Editar Salón';
      this.loungeForm.patchValue(this.initialData);
    } else {
      this.headerTitle = 'Crear Salón';
      this.loungeForm.reset({
        name: '',
        tableCount: 0,
        state: '1'
      });
    }
  }

  public incrementTables(): void {
    this.tableCountCtrl.setValue(this.tableCountCtrl.value + 1);
  }

  public decrementTables(): void {
    const currentValue = this.tableCountCtrl.value;
    if (currentValue > 0) {
      this.tableCountCtrl.setValue(currentValue - 1);
    }
  }

  public onSave(): void {
    if (this.loungeForm.invalid) {
      return;
    }
    this.save.emit(this.loungeForm.value);
    this.closeModal();
  }

  public closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}