import { Component, OnInit } from '@angular/core';
import { Lounge } from '../../../../core/interfaces/lounge.interface';
import { TableModel } from '../../../../core/interfaces/table.interface';
import { LoungeService } from '../../../../core/services/lounge.service';
import { TableService } from '../../../../core/services/table.service';
import { LoungeFormData, LoungeInitialData } from '../../../../shared/lounge-modal/lounge-modal';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-salones-mesas',
  standalone: false,
  templateUrl: './salones-mesas.html',
  styleUrl: './salones-mesas.scss',
})

export class SalonesMesas implements OnInit {
  salones: Lounge[] = [];
  mesas: TableModel[] = [];
  salonSeleccionado: Lounge | null = null;
  mesaSeleccionada: TableModel | null = null;
  loadingSalones = false;
  loadingMesas = false;
  modalVisible: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  dataToEdit: LoungeInitialData | null = null;
  private currentEditingLoungeId: number | null = null;
  
  // Estado de edición de mesas
  mesaEnEdicion: TableModel | null = null;
  nombreMesaEditando: string = '';

  constructor(
    private loungeService: LoungeService,
    private tableService: TableService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarSalones();
  }

  cargarSalones(): void {
    this.loadingSalones = true;
    const storeId = parseInt(localStorage.getItem('store_id') || '1', 10);

    this.loungeService.getLounges(undefined, storeId).subscribe({
      next: (response) => {
        if (response.tipo === '1' && response.data) {
          this.salones = response.data;
        } else {
          this.salones = [];
        }
        this.loadingSalones = false;
      },
      error: (err) => {
        this.loadingSalones = false;
      },
    });
  }

  seleccionarSalon(salon: Lounge): void {
    this.salonSeleccionado = salon;
    this.mesaSeleccionada = null;
    this.cargarMesas(salon.lounge_id);
  }

  cargarMesas(loungeId: number): void {
    this.loadingMesas = true;
    this.tableService.getTableeByLoungeId(loungeId, 1).subscribe({
      next: (response) => {
        if (response.tipo === '1' && response.data) {
          this.mesas = response.data;
        } else {
          this.mesas = [];
        }
        this.loadingMesas = false;
      },
      error: (err) => {
        this.mesas = [];
        this.loadingMesas = false;
      },
    });
  }

  seleccionarMesa(mesa: TableModel): void {
    this.mesaSeleccionada = mesa;
  }

  public iniciarEdicionMesa(mesa: TableModel): void {
    this.mesaEnEdicion = mesa;
    this.nombreMesaEditando = mesa.tablee_name || '';
  }

  public cancelarEdicionMesa(): void {
    this.mesaEnEdicion = null;
    this.nombreMesaEditando = '';
  }

  public guardarEdicionMesa(mesa: TableModel): void {
    if (!this.nombreMesaEditando || !this.nombreMesaEditando.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El nombre de la mesa no puede estar vacío',
        life: 3000
      });
      return;
    }

    if (this.nombreMesaEditando.trim() === mesa.tablee_name) {
      this.mesaEnEdicion = null;
      return;
    }

    const mesaActualizada = {
      ...mesa,
      tablee_name: this.nombreMesaEditando.trim()
    };

    this.tableService.updateTable(mesaActualizada).subscribe({
      next: (response) => {
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Nombre de mesa actualizado correctamente',
            life: 3000
          });
          mesa.tablee_name = this.nombreMesaEditando.trim();
          this.mesaEnEdicion = null;
          this.nombreMesaEditando = '';
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes?.[0] || 'Error al actualizar mesa',
            life: 4000
          });
        }
      },
      error: (err) => {
        let errorMsg = 'Error al actualizar la mesa. Intenta nuevamente.';
        if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifica el nombre.';
        } else if (err.status === 404) {
          errorMsg = 'Mesa no encontrada.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }

  public showCreateLoungeDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingLoungeId = null;
    this.modalVisible = true;
  }

  public showEditLoungeDialog(event: Event, salon: Lounge): void {
    event.stopPropagation();
    this.modalMode = 'edit';
    this.currentEditingLoungeId = salon.lounge_id;
    this.dataToEdit = {
      name: salon.lounge_name,
      tableCount: salon.cantidad_mesas,
      state: salon.lounge_state
    };
    this.modalVisible = true;
  }

  public onModalSave(formData: LoungeFormData): void {
    if (this.modalMode === 'create') {
      this.crearSalon(formData);
    } else {
      this.editarSalon(formData);
    }
  }

  /**
   * Crea un nuevo salón validando duplicados y manejando respuestas de error.
   */
  private crearSalon(formData: LoungeFormData): void {
    const storeId = parseInt(localStorage.getItem('store_id') || '1', 10);

    const nombreDuplicado = this.salones.some(
      s => s.lounge_name && s.lounge_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreDuplicado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un salón con ese nombre',
        life: 4000
      });
      return;
    }

    const nuevoSalon = {
      lounge_id: null,
      lounge_name: formData.name,
      cantidad_mesas: formData.tableCount,
      lounge_state: '1',
      store_id: storeId
    };

    this.loungeService.createLounge(nuevoSalon).subscribe({
      next: (response) => {
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Salón creado correctamente',
            life: 3000
          });
          this.cargarSalones();
          this.modalVisible = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes[0] || 'Error al crear salón',
            life: 4000
          });
        }
      },
      error: (err) => {
        let errorMsg = 'Error al crear el salón. Intenta nuevamente.';
        
        if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifica los campos.';
        } else if (err.status === 409) {
          errorMsg = 'Ya existe un salón con ese nombre.';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }

  /**
   * Actualiza un salón existente.
   * Valida cambios y duplicados antes de enviar la petición.
   */
  private editarSalon(formData: LoungeFormData): void {
    if (!this.currentEditingLoungeId) return;

    const salonActual = this.salones.find(s => s.lounge_id === this.currentEditingLoungeId);
    if (!salonActual) return;

    const sinCambios = 
      salonActual.lounge_name === formData.name &&
      salonActual.cantidad_mesas === formData.tableCount &&
      salonActual.lounge_state === formData.state;

    if (sinCambios) {
      this.modalVisible = false;
      return;
    }

    const nombreDuplicado = this.salones.some(
      s => s.lounge_id !== this.currentEditingLoungeId &&
           s.lounge_name && s.lounge_name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (nombreDuplicado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe otro salón con ese nombre',
        life: 4000
      });
      return;
    }

    const salonActualizado = {
      lounge_id: this.currentEditingLoungeId,
      lounge_name: formData.name,
      cantidad_mesas: formData.tableCount,
      lounge_state: formData.state, // Usa el estado del formulario
      store_id: salonActual.store_id
    };

    this.loungeService.updateLounge(salonActualizado).subscribe({
      next: (response) => {
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: '¡Actualizado!',
            detail: 'Salón modificado correctamente',
            life: 3000
          });
          this.cargarSalones();
          this.modalVisible = false;
          if (this.salonSeleccionado?.lounge_id === this.currentEditingLoungeId) {
            this.salonSeleccionado = null;
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes[0] || 'Error al actualizar salón',
            life: 4000
          });
        }
      },
      error: (err) => {
        let errorMsg = 'Error al actualizar el salón. Intenta nuevamente.';
        
        if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifica los campos.';
        } else if (err.status === 404) {
          errorMsg = 'Salón no encontrado.';
        } else if (err.status === 409) {
          errorMsg = 'Ya existe un salón con ese nombre.';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }
}