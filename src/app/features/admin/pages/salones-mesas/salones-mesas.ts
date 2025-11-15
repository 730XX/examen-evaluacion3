import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

/**
 * Define la estructura de una Mesa
 */
interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
}

/**
 * Define la estructura de un Salón, que contiene un array de Mesas
 */
interface Salon {
  id: number;
  nombre: string;
  mesas: Mesa[];
}


@Component({
  selector: 'app-salones-mesas',
  standalone: false,
  templateUrl: './salones-mesas.html',
  styleUrl: './salones-mesas.scss',
})




export class SalonesMesas implements OnInit {

  // --- PROPIEDADES DEL COMPONENTE ---

  /**
   * Array principal que contiene todos los salones y sus mesas.
   * Se inicializa vacío y se rellena en ngOnInit.
   */
  public salones: Salon[] = [];

  /**
   * Almacena el salón que el usuario ha seleccionado.
   * Es 'null' si no se ha seleccionado ninguno.
   */
  public salonSeleccionado: Salon | null = null;

  /**
   * Almacena la mesa que el usuario ha seleccionado.
   * Es 'null' si no se ha seleccionado ninguna.
   */
  public mesaSeleccionada: Mesa | null = null;

  constructor() {
    // Constructor vacío por ahora
  }

  /**
   * Lifecycle Hook que se ejecuta cuando el componente se inicializa.
   * Perfecto para cargar los datos iniciales.
   */
  ngOnInit(): void {
    this.cargarDatosDeEjemplo();
  }

  // --- MÉTODOS DEL COMPONENTE ---

  /**
   * Método que se llama al hacer clic en un salón.
   * @param salon El objeto Salon que fue clickeado.
   */
  public seleccionarSalon(salon: Salon): void {
    console.log('Salón seleccionado:', salon.nombre);
    this.salonSeleccionado = salon;
    
    // IMPORTANTE: Resetea la mesa seleccionada cuando cambias de salón
    this.mesaSeleccionada = null; 
  }

  /**
   * Método que se llama al hacer clic en una mesa.
   * @param mesa El objeto Mesa que fue clickeado.
   */
  public seleccionarMesa(mesa: Mesa): void {
    console.log('Mesa seleccionada:', mesa.numero);
    this.mesaSeleccionada = mesa;
    // Aquí podrías añadir lógica futura (ej. abrir un modal para tomar pedido)
  }


  // --- MÉTODOS PRIVADOS (Datos de ejemplo) ---

  /**
   * Carga datos de ejemplo en la propiedad 'salones'.
   */
  private cargarDatosDeEjemplo(): void {
    this.salones = [
      {
        id: 1,
        nombre: 'Salón Principal',
        mesas: [
          { id: 101, numero: 1, capacidad: 4, estado: 'disponible' },
          { id: 102, numero: 2, capacidad: 2, estado: 'ocupada' },
          { id: 103, numero: 3, capacidad: 6, estado: 'disponible' },
          { id: 104, numero: 4, capacidad: 4, estado: 'reservada' },
        ]
      },
      {
        id: 2,
        nombre: 'Terraza',
        mesas: [
          { id: 201, numero: 10, capacidad: 4, estado: 'disponible' },
          { id: 202, numero: 11, capacidad: 4, estado: 'disponible' },
          { id: 203, numero: 12, capacidad: 2, estado: 'ocupada' },
        ]
      },
      {
        id: 3,
        nombre: 'Barra',
        mesas: [
          { id: 301, numero: 20, capacidad: 1, estado: 'disponible' },
          { id: 302, numero: 21, capacidad: 1, estado: 'ocupada' },
          { id: 303, numero: 22, capacidad: 1, estado: 'disponible' },
        ]
      }
    ];
  }
}