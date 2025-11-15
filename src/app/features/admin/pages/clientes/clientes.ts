import { Component, OnInit } from '@angular/core';

// (Importar aquí la futura interfaz del modal de cliente)
// import { CustomerFormData } from '../../shared/components/customer-modal/customer-modal.component';

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
  customer_typedocument: string; // "1" = DNI, "2" = RUC, etc. (Asumo)
  customer_numberdocument: string;
  customer_birthdate: string | null;
  customer_registrationdate: string | null;
  customer_state: string; // "1" = Activo, "0" = Inactivo (Asumo)
  user_id: string | null;
}

@Component({
  selector: 'app-clientes', // Tu selector
  standalone: false,
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss'],
})
export class Clientes implements OnInit {
  public clientes: Customer[] = [];

  // --- Propiedades para controlar el Modal de Clientes ---
  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  // (Usaremos 'any' por ahora, luego crearás la interfaz 'CustomerInitialData')
  public dataToEdit: any | null = null;
  private currentEditingCustomerId: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.cargarDatosDeEjemplo();
  }

  /**
   * Carga los datos de ejemplo de clientes.
   */
  private cargarDatosDeEjemplo(): void {
    this.clientes = [
      {
        customer_id: '1',
        customer_name: 'Cesar Chero',
        customer_email: 'cesarcherrro@gmail.com',
        customer_phone: '912740843',
        customer_address: 'enace',
        customer_country: null,
        customer_typedocument: '1',
        customer_numberdocument: '78580946',
        customer_birthdate: null,
        customer_registrationdate: null,
        customer_state: '1', // <-- Cambiado a 1 para que se vea activo
        user_id: null,
      },
      {
        customer_id: '2',
        customer_name: 'Kevin Cezpedez',
        customer_email: 'kevinflow@gmail.com',
        customer_phone: '988123567',
        customer_address: 'tos',
        customer_country: null,
        customer_typedocument: '2',
        customer_numberdocument: '12345678',
        customer_birthdate: null,
        customer_registrationdate: null,
        customer_state: '1', // <-- Cambiado a 1
        user_id: null,
      },
      {
        customer_id: '3',
        customer_name: 'Ana García',
        customer_email: 'anagarcia@email.com',
        customer_phone: '987654321',
        customer_address: '',
        customer_country: '',
        customer_typedocument: '1',
        customer_numberdocument: '12345678',
        customer_birthdate: '0000-00-00',
        customer_registrationdate: '0000-00-00 00:00:00',
        customer_state: '0',
        user_id: null,
      },
      {
        customer_id: '4',
        customer_name: 'Luis Rodríguez',
        customer_email: 'luis.r@email.com',
        customer_phone: '912345678',
        customer_address: '',
        customer_country: '',
        customer_typedocument: '1',
        customer_numberdocument: '23456789',
        customer_birthdate: null,
        customer_registrationdate: null,
        customer_state: '1',
        user_id: null,
      },
    ];
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
