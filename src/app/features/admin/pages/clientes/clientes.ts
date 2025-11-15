import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../../core/services/customers.service';
import { MessageService } from 'primeng/api';

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
  customer_typedocument: string; 
  customer_numberdocument: string;
  customer_birthdate: string | null;
  customer_registrationdate: string | null;
  customer_state: string; 
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

  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: any | null = null;
  private currentEditingCustomerId: string | null = null;

  constructor(
    private customersService: CustomersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  
  private cargarClientes(): void {
    this.loadingClientes = true;    
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
    // Mapear los datos del cliente al formato que el modal espera
    this.dataToEdit = {
      name: cliente.customer_name,
      email: cliente.customer_email,
      phone: cliente.customer_phone,
      address: cliente.customer_address,
      country: cliente.customer_country || '',
      typeDocument: cliente.customer_typedocument,
      numberDocument: cliente.customer_numberdocument,
      birthdate: cliente.customer_birthdate || '',
      state: cliente.customer_state
    };
    this.modalVisible = true;
    console.log('Abriendo modal para editar cliente:', cliente.customer_id);
  }

  public onModalSave(formData: any): void {
    if (this.modalMode === 'create') {
      this.crearCliente(formData);
    } else {
      this.editarCliente(formData);
    }
  }

  /**
   * Crear un nuevo cliente
   */
  private crearCliente(formData: any): void {
    console.log('Creando cliente:', formData);
    
    const customerData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_country: formData.country,
      customer_typedocument: formData.typeDocument,
      customer_numberdocument: formData.numberDocument,
      customer_birthdate: formData.birthdate || null,
      customer_state: '1' // Siempre activo al crear
    };

    this.customersService.createCustomer(customerData).subscribe({
      next: (response) => {
        console.log('Cliente creado exitosamente:', response);
        
        // Mostrar toast de éxito
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'Cliente creado correctamente',
          life: 3000
        });
        
        // Recargar la lista de clientes
        this.cargarClientes();
        this.modalVisible = false;
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        
        // Mostrar toast de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el cliente. Intenta nuevamente.',
          life: 4000
        });
      }
    });
  }

  /**
   * Editar un cliente existente
   */
  private editarCliente(formData: any): void {
    console.log('Editando cliente ID:', this.currentEditingCustomerId);
    
    const customerData = {
      customer_id: this.currentEditingCustomerId,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_country: formData.country,
      customer_typedocument: formData.typeDocument,
      customer_numberdocument: formData.numberDocument,
      customer_birthdate: formData.birthdate || null,
      customer_state: formData.state
    };

    this.customersService.updateCustomer(customerData).subscribe({
      next: (response) => {
        console.log('Cliente actualizado exitosamente:', response);
        
        // Mostrar toast de éxito
        this.messageService.add({
          severity: 'success',
          summary: '¡Actualizado!',
          detail: 'Cliente modificado correctamente',
          life: 3000
        });
        
        // Recargar la lista de clientes
        this.cargarClientes();
        this.modalVisible = false;
      },
      error: (err) => {
        console.error('Error al actualizar cliente:', err);
        
        // Mostrar toast de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el cliente. Intenta nuevamente.',
          life: 4000
        });
      }
    });
  }
}
