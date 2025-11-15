import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../../core/services/customers.service';

/**
 * Define la estructura de un Cliente (basado en tu API)
 */
interface Customer {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_country: string | null;
  customer_typedocument: string; // "1" = DNI, "2" = RUC, etc.
  customer_numberdocument: string;
  customer_birthdate: string | null;
  customer_registrationdate: string | null;
  customer_state: string; // "1" = Activo, "0" = Inactivo
  user_id: string | null;
}

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss'],
})
export class Clientes implements OnInit {
  public clientes: Customer[] = [];
  public loadingClientes: boolean = false;

  // --- Propiedades para controlar el Modal de Clientes ---
  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: any | null = null;
  private currentEditingCustomerId: string | null = null;

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  /**
   * Carga los clientes desde la API
   */
  private cargarClientes(): void {
    this.loadingClientes = true;
    
    // Llamar al servicio con los parámetros por defecto
    // page: '-1' = todos, perPage: '-1' = todos, customer_name: '-1' = todos
    // customer_typedocument: '-1' = todos, customer_state: '1' = solo activos
    this.customersService.getCustomers('-1', '-1', '-1', '-1', '-1').subscribe({
      next: (response) => {
        console.log('Respuesta de getCustomers:', response);
        if (response && response.data) {
          this.clientes = response.data;
        } else {
          this.clientes = [];
        }
        this.loadingClientes = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loadingClientes = false;
        this.clientes = [];
      }
    });
  }

  // --- Métodos de Ayuda para la Vista ---

  /**
   * Devuelve el nombre del tipo de documento.
   */
  public getDocumentType(type: string): string {
    switch (type) {
      case '1':
        return 'DNI';
      case '2':
        return 'RUC';
      case '3':
        return 'C.E.';
      default:
        return 'Otro';
    }
  }

  // --- Métodos que controlan el Modal ---

  public showCreateClienteDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingCustomerId = null;
    this.modalVisible = true;
    console.log('Abriendo modal para crear cliente...');
  }

  public showEditClienteDialog(cliente: Customer): void {
    this.modalMode = 'edit';
    this.currentEditingCustomerId = cliente.customer_id;
    // Aquí mapeas los datos del cliente al formato que tu modal de cliente espere
    this.dataToEdit = {
      name: cliente.customer_name,
      email: cliente.customer_email,
      phone: cliente.customer_phone,
      address: cliente.customer_address,
      typeDocument: cliente.customer_typedocument,
      numberDocument: cliente.customer_numberdocument,
      // ... etc.
    };
    this.modalVisible = true;
    console.log('Abriendo modal para editar cliente:', cliente.customer_id);
  }

  public onModalSave(formData: any): void {
    // (formData será la interfaz de tu modal de cliente)
    if (this.modalMode === 'create') {
      console.log('--- CREANDO CLIENTE ---');
      console.log('Datos:', formData);
      // ... servicio POST ...
    } else {
      console.log('--- EDITANDO CLIENTE ---');
      console.log('ID a editar:', this.currentEditingCustomerId);
      console.log('Nuevos Datos:', formData);
      // ... servicio PUT ...
    }
  }
}
