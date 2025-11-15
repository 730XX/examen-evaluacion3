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

  // Modales
  showModal = false;
  showModalEditar = false;
  salonParaEditar: Lounge | null = null;

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

  // Crear un nuevo salón
  crearSalon(data: { nombre: string; cantidadMesas: number }): void {
    const storeId = parseInt(localStorage.getItem('store_id') || '1', 10);

    const nuevoSalon = {
      lounge_name: data.nombre,
      cantidad_mesas: data.cantidadMesas,
      lounge_state: '1', // 1 = activo
      store_id: storeId,
    };

    this.loungeService.createLounge(nuevoSalon).subscribe({
      next: (response) => {
        console.log('Salón creado:', response);
        if (response.tipo === '1') {
          this.showModal = false;
          this.cargarSalones();
        }
      },
      error: (err) => console.error('Error al crear salón:', err),
    });
  }

  // Abrir modal para edición
  abrirModalEditar(salon: Lounge): void {
    this.salonParaEditar = { ...salon };
    this.showModalEditar = true;
  }

  // Guardar cambios del salón editado
  actualizarSalon(data: { nombre: string; cantidadMesas: number }): void {
    if (!this.salonParaEditar) return;

    const salonActualizado = {
      lounge_id: this.salonParaEditar.lounge_id,
      lounge_name: data.nombre,
      cantidad_mesas: this.salonParaEditar.cantidad_mesas,
      lounge_state: this.salonParaEditar.lounge_state,
      store_id: this.salonParaEditar.store_id,
    };

    this.loungeService.updateLounge(salonActualizado).subscribe({
      next: (response) => {
        console.log('Salón actualizado:', response);
        if (response.tipo === '1') {
          this.showModalEditar = false;
          this.salonParaEditar = null;
          this.cargarSalones();
        }
      },
      error: (err) => console.error('Error al actualizar salón:', err),
    });
  }

  // Activar o desactivar salón
  cambiarEstadoSalon(salon: Lounge): void {
    // Determinar si está activo actualmente
    const esActivo = this.esActivo(salon.lounge_state);
    const nuevoEstado = esActivo ? '0' : '1';

    const salonActualizado = {
      lounge_id: salon.lounge_id,
      lounge_name: salon.lounge_name,
      cantidad_mesas: salon.cantidad_mesas,
      lounge_state: nuevoEstado,
      store_id: salon.store_id,
    };

    this.loungeService.updateLounge(salonActualizado).subscribe({
      next: (response) => {
        console.log('Estado cambiado:', response);
        if (response.tipo === '1') {
          this.cargarSalones();
        }
      },
      error: (err) => console.error('Error al cambiar estado:', err),
    });
  }

  // Helper para determinar si un salón está activo
  esActivo(estado: string): boolean {
    return estado === '1' || estado === 'ACTIVO' || estado === 'activo';
  }
}