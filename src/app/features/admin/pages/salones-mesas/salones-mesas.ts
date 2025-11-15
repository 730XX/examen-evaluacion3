import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Lounge } from '../../../../core/interfaces/lounge.interface';
import { TableModel } from '../../../../core/interfaces/table.interface';
import { LoungeService } from '../../../../core/services/lounge.service';
import { TableService } from '../../../../core/services/table.service';


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

  // Flags de carga
  loadingSalones: boolean = false;
  loadingMesas: boolean = false;

  constructor(
    private loungeService: LoungeService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.cargarSalones();
  }

  cargarSalones(): void {
    this.loadingSalones = true;
    this.loungeService.getLounges().subscribe({
      next: (data) => {
        this.salones = data;
        this.loadingSalones = false;
      },
      error: () => {
        this.loadingSalones = false;
      }
    });
  }

  seleccionarSalon(salon: Lounge): void {
    this.salonSeleccionado = salon;
    this.mesaSeleccionada = null;
    this.cargarMesas(salon.store_id, salon.lounge_id);
  }

  cargarMesas(storeId: number, loungeId: number): void {
    this.loadingMesas = true;
    this.tableService.getTablesByLounge(storeId, loungeId).subscribe({
      next: (data) => {
        this.mesas = data;
        this.loadingMesas = false;
      },
      error: () => {
        this.loadingMesas = false;
      }
    });
  }

  seleccionarMesa(mesa: TableModel): void {
    this.mesaSeleccionada = mesa;
  }

  verMesa(mesa: TableModel): void {
    console.log("Detalles mesa:", mesa);
    // Abrir modal -> lo hacemos luego
  }
}