import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
// --- Importar Interfaces Reales ---
// (Usamos 'as' para mantener la consistencia con el código existente)
import { Lounge, Lounge as Salon } from '../../../../core/interfaces/lounge.interface';
import { TableModel as Mesa, TableModel } from '../../../../core/interfaces/table.interface';

import { LoungeService } from '../../../../core/services/lounge.service';
import { TableService } from '../../../../core/services/table.service';
import { LoungeFormData, LoungeInitialData } from '../../../../shared/lounge-modal/lounge-modal';


@Component({
  selector: 'app-salones-mesas',
  standalone: false,
  templateUrl: './salones-mesas.html',
  styleUrl: './salones-mesas.scss',
})

export class SalonesMesas implements OnInit {

  // Datos principales
  salones: Lounge[] = [];
  mesas: TableModel[] = [];

  // Selecciones activas
  salonSeleccionado: Lounge | null = null;
  mesaSeleccionada: TableModel | null = null;

  // Estados de carga
  loadingSalones = false;
  loadingMesas = false;

  // Propiedades para el modal de lounge
  modalVisible: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  dataToEdit: LoungeInitialData | null = null;
  private currentEditingLoungeId: number | null = null;

  constructor(private loungeService: LoungeService, private tableService: TableService) {}

  ngOnInit(): void {
    this.cargarSalones();
  }

  // Obtener lista de salones
  cargarSalones(): void {
    this.loadingSalones = true;
    const storeId = parseInt(localStorage.getItem('store_id') || '1', 10);

    this.loungeService.getLounges(undefined, storeId).subscribe({
      next: (response) => {
        console.log('Respuesta de salones:', response);
        if (response.tipo === '1' && response.data) {
          this.salones = response.data;
        } else {
          this.salones = [];
        }
        this.loadingSalones = false;
      },
      error: (err) => {
        console.error('Error al cargar salones:', err);
        this.loadingSalones = false;
      },
    });
  }

  // Seleccionar salón y cargar mesas asociadas
  seleccionarSalon(salon: Lounge): void {
    this.salonSeleccionado = salon;
    this.mesaSeleccionada = null;
    console.log('Cargando mesas para salón:', salon.lounge_id);
    this.cargarMesas(salon.lounge_id);
  }

  // Obtener mesas del salón seleccionado
  cargarMesas(loungeId: number): void {
    this.loadingMesas = true;
    this.tableService.getTableeByLoungeId(loungeId, 1).subscribe({
      next: (response) => {
        console.log('Respuesta de mesas:', response);
        if (response.tipo === '1' && response.data) {
          this.mesas = response.data;
        } else {
          this.mesas = [];
        }
        this.loadingMesas = false;
      },
      error: (err) => {
        console.error('Error al cargar mesas:', err);
        this.mesas = [];
        this.loadingMesas = false;
      },
    });
  }

  // Seleccionar mesa
  seleccionarMesa(mesa: TableModel): void {
    this.mesaSeleccionada = mesa;
  }

  // Ver detalles de mesa
  verMesa(mesa: TableModel): void {
    console.log('Detalles mesa:', mesa);
  }

  // --- Métodos para controlar el Modal de Lounge ---

  public showCreateLoungeDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingLoungeId = null;
    this.modalVisible = true;
    console.log('Abriendo modal para crear salón...');
  }

  public showEditLoungeDialog(event: Event, salon: Lounge): void {
    event.stopPropagation(); // Evitar que se seleccione el salón
    this.modalMode = 'edit';
    this.currentEditingLoungeId = salon.lounge_id;
    // Mapear los datos del salón al formato que el modal espera
    this.dataToEdit = {
      name: salon.lounge_name,
      tableCount: salon.cantidad_mesas,
      state: salon.lounge_state
    };
    this.modalVisible = true;
    console.log('Abriendo modal para editar salón:', salon.lounge_id);
  }

  public onModalSave(formData: LoungeFormData): void {
    if (this.modalMode === 'create') {
      this.crearSalon(formData);
    } else {
      this.editarSalon(formData);
    }
  }

  // --- Métodos CRUD ---

  private crearSalon(formData: LoungeFormData): void {
    console.log('Creando salón:', formData);
    const storeId = parseInt(localStorage.getItem('store_id') || '1', 10);

    const nuevoSalon = {
      lounge_id: null, // null para crear nuevo
      lounge_name: formData.name,
      cantidad_mesas: formData.tableCount,
      lounge_state: '1', // Siempre activo al crear
      store_id: storeId
    };

    this.loungeService.createLounge(nuevoSalon).subscribe({
      next: (response) => {
        console.log('Salón creado exitosamente:', response);
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.cargarSalones();
          this.modalVisible = false;
        } else {
          console.error('Error en la respuesta:', response.mensajes);
          alert(response.mensajes[0] || 'Error al crear salón');
        }
      },
      error: (err) => {
        console.error('Error al crear salón:', err);
        if (err.status === 400) {
          alert('Datos inválidos. Verifica los campos.');
        } else if (err.status === 409) {
          alert('Ya existe un salón con ese nombre.');
        } else {
          alert('Error al crear el salón. Intenta nuevamente.');
        }
      }
    });
  }

  private editarSalon(formData: LoungeFormData): void {
    console.log('Editando salón ID:', this.currentEditingLoungeId);
    
    if (!this.currentEditingLoungeId) return;

    // Buscar el salón actual para mantener sus datos
    const salonActual = this.salones.find(s => s.lounge_id === this.currentEditingLoungeId);
    if (!salonActual) return;

    const salonActualizado = {
      lounge_id: this.currentEditingLoungeId,
      lounge_name: formData.name,
      cantidad_mesas: formData.tableCount,
      lounge_state: formData.state, // Usa el estado del formulario
      store_id: salonActual.store_id
    };

    this.loungeService.updateLounge(salonActualizado).subscribe({
      next: (response) => {
        console.log('Salón actualizado exitosamente:', response);
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.cargarSalones();
          this.modalVisible = false;
          // Si hay un salón seleccionado y es el que editamos, actualizar
          if (this.salonSeleccionado?.lounge_id === this.currentEditingLoungeId) {
            this.salonSeleccionado = null;
          }
        } else {
          console.error('Error en la respuesta:', response.mensajes);
          alert(response.mensajes[0] || 'Error al actualizar salón');
        }
      },
      error: (err) => {
        console.error('Error al actualizar salón:', err);
        if (err.status === 400) {
          alert('Datos inválidos. Verifica los campos.');
        } else if (err.status === 404) {
          alert('Salón no encontrado.');
        } else if (err.status === 409) {
          alert('Ya existe un salón con ese nombre.');
        } else {
          alert('Error al actualizar el salón. Intenta nuevamente.');
        }
      }
    });
  }
}