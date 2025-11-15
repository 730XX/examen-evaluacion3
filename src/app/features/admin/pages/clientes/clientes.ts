import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../../core/services/customers.service';
import { MessageService } from 'primeng/api';

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
        if (response && response.data) {
          this.clientes = response.data;
        } else {
          this.clientes = [];
        }
        this.loadingClientes = false;
      },
      error: (err) => {
        this.loadingClientes = false;
        this.clientes = [];
      }
    });
  }

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

  public showCreateClienteDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingCustomerId = null;
    this.modalVisible = true;
  }

  public showEditClienteDialog(cliente: Customer): void {
    this.modalMode = 'edit';
    this.currentEditingCustomerId = cliente.customer_id;
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
  }

  public onModalSave(formData: any): void {
    if (this.modalMode === 'create') {
      this.crearCliente(formData);
    } else {
      this.editarCliente(formData);
    }
  }

  private crearCliente(formData: any): void {
    const customerData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      customer_country: formData.country,
      customer_typedocument: formData.typeDocument,
      customer_numberdocument: formData.numberDocument,
      customer_birthdate: formData.birthdate || null,
      customer_state: '1'
    };

    this.customersService.createCustomer(customerData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'Cliente creado correctamente',
          life: 3000
        });
        this.cargarClientes();
        this.modalVisible = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el cliente. Intenta nuevamente.',
          life: 4000
        });
      }
    });
  }

  private editarCliente(formData: any): void {
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
        this.messageService.add({
          severity: 'success',
          summary: '¡Actualizado!',
          detail: 'Cliente modificado correctamente',
          life: 3000
        });
        this.cargarClientes();
        this.modalVisible = false;
      },
      error: (err) => {
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
