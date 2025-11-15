import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
// --- Importar Interfaces Reales ---
// (Usamos 'as' para mantener la consistencia con el código existente)
import { Lounge as Salon } from '../../../../core/interfaces/lounge.interface';
import { TableModel as Mesa } from '../../../../core/interfaces/table.interface';

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

  // --- Propiedades de Estado de la Página ---
  public salones: Salon[] = [];
  public salonSeleccionado: Salon | null = null;
  public mesas: Mesa[] = []; 
  public mesaSeleccionada: Mesa | null = null;
  public loadingSalones: boolean = false;
  public loadingMesas: boolean = false;

  // --- Propiedades para controlar el Modal de Salón ---
  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: LoungeInitialData | null = null;
  private currentEditingLoungeId: number | null = null; // Cambiado a number

  constructor(
    // Inyectamos los servicios reales
    private loungeService: LoungeService,
    private tableService: TableService
  ) { }

  ngOnInit(): void {
    // Llamamos al método que carga datos reales
    this.loadSalones();
  }

  // --- Lógica de la Página ---

  /**
   * Carga todos los salones desde la API
   */
  private loadSalones(): void {
    this.loadingSalones = true;
    this.loungeService.getLounges().subscribe({
      next: (data) => {
        this.salones = data;
        this.loadingSalones = false;
      },
      error: (err) => {
        console.error("Error al cargar salones:", err);
        this.loadingSalones = false;
      }
    });
  }

  /**
   * Carga las mesas para un salón específico desde la API
   * @param loungeId El ID del salón seleccionado
   */
  private loadTables(loungeId: number): void {
    this.loadingMesas = true;
    this.mesas = []; // Limpia las mesas anteriores

    // Asumo un store_id=1, como en tu ejemplo de API
    const storeId = 1; 

    this.tableService.getTablesByLounge(storeId, loungeId).subscribe({
      next: (data) => {
        this.mesas = data;
        this.loadingMesas = false;
      },
      error: (err) => {
        console.error(`Error al cargar mesas para el salón ${loungeId}:`, err);
        this.loadingMesas = false;
      }
    });
  }

  /**
   * Se llama al seleccionar un salón. Carga las mesas de ese salón.
   */
  public seleccionarSalon(salon: Salon): void {
    if (this.salonSeleccionado?.lounge_id === salon.lounge_id) return; 

    console.log('Salón seleccionado:', salon.lounge_id);
    this.salonSeleccionado = salon;
    this.mesaSeleccionada = null; // Resetea la mesa
    
    // Llama al método que carga datos reales
    this.loadTables(salon.lounge_id);
  }

  /**
   * Se llama al seleccionar una mesa de la tabla.
   */
  public seleccionarMesa(mesa: Mesa): void {
    console.log('Mesa seleccionada:', mesa.tablee_id);
    this.mesaSeleccionada = mesa;
  }

  /**
   * Se llama al hacer clic en "Ver detalles" de una mesa.
   */
  public verMesa(mesa: Mesa): void {
    console.log('Viendo detalles de mesa:', mesa.tablee_id);
    // (Aquí podrías abrir otro modal para detalles de la mesa)
  }

  // --- Métodos que controlan el Modal de Salón ---

  /**
   * Abre el modal en modo 'Crear'.
   */
  public showCreateLoungeDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingLoungeId = null;
    this.modalVisible = true;
  }

  /**
   * Abre el modal en modo 'Editar' con los datos del salón.
   */
  public showEditLoungeDialog(event: MouseEvent, salon: Salon): void {
    event.stopPropagation(); // Evita que se dispare 'seleccionarSalon'
    event.preventDefault();

    this.modalMode = 'edit';
    this.currentEditingLoungeId = salon.lounge_id;
    this.dataToEdit = {
      name: salon.lounge_name,
      tableCount: Number(salon.cantidad_mesas) // El modal espera un número
    };
    this.modalVisible = true;
  }

  /**
   * Se llama cuando el modal emite el evento 'save'.
   * ¡Implementa la lógica real de API aquí!
   */
  public onLoungeModalSave(formData: LoungeFormData): void {
    
    if (this.modalMode === 'create') {
      console.log('--- CREANDO SALÓN ---');
      
      // Construimos el objeto que espera la API (asumiendo store_id=1 y state=1)
      const newLounge: Partial<Salon> = {
        lounge_name: formData.name,
        cantidad_mesas: formData.tableCount,
        store_id: 1,      // Asumido
        lounge_state: '1' // Asumido
      };

      // Usamos 'as any' para saltar el chequeo estricto de tipo de tu servicio
      this.loungeService.createLounge(newLounge as any).subscribe({
        next: (response) => {
          console.log('Salón creado:', response);
          this.loadSalones(); // Recarga la lista de salones
        },
        error: (err) => console.error("Error al crear salón:", err)
      });

    } else {
      console.log('--- EDITANDO SALÓN ---');
      
      // Construimos el objeto parcial para actualizar
      const updatedLounge: Partial<Salon> = {
        lounge_name: formData.name,
        cantidad_mesas: formData.tableCount
        // (Añade otros campos si tu modal los modifica, ej: lounge_state)
      };

      this.loungeService.updateLounge(this.currentEditingLoungeId!, updatedLounge as any).subscribe({
        next: (response) => {
          console.log('Salón actualizado:', response);
          this.loadSalones(); // Recarga la lista de salones
        },
        error: (err) => console.error("Error al actualizar salón:", err)
      });
    }
    
    // El modal se cierra solo (por el two-way binding)
  }
}