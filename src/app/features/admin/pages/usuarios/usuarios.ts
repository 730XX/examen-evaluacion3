import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../../core/interfaces/user.interface';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  state: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  public usuarios: User[] = [];
  public usuariosFiltrados: User[] = [];
  public loadingUsuarios: boolean = false;

  public modalVisible: boolean = false;
  public modalMode: 'create' | 'edit' = 'create';
  public dataToEdit: any | null = null;
  private currentEditingUserId: string | number | null = null;
  public showInactive: boolean = true; // Cambiado temporalmente a true para mostrar todos

  public rolesDisponibles = [
    { label: 'Administrador', value: '1' },
    { label: 'Cajero', value: '1' },
    { label: 'Mesero/Mozo', value: '3' },
    { label: 'Cocinero', value: '4' }
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.loadingUsuarios = true;

    this.userService.getUsers('-1', '-1', '-1', '-1', '-1').subscribe({
      next: (response) => {
        console.log('Response usuarios:', response);
        if (response && response.data) {
          this.usuarios = response.data;
          console.log('Usuarios cargados:', this.usuarios);
          this.aplicarFiltro();
          console.log('Usuarios filtrados:', this.usuariosFiltrados);
        } else {
          console.warn('No hay datos en response');
          this.usuarios = [];
          this.usuariosFiltrados = [];
        }
        this.loadingUsuarios = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loadingUsuarios = false;
        this.usuarios = [];
        this.usuariosFiltrados = [];
      }
    });
  }

  private aplicarFiltro(): void {
    console.log('Aplicando filtro, showInactive:', this.showInactive);
    if (this.showInactive) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter((usuario: User) => {
        console.log(`Usuario ${usuario.user_name}, state: ${usuario.user_state}, tipo: ${typeof usuario.user_state}`);
        return usuario.user_state === '1' || usuario.user_state === 1;
      });
    }
    console.log('Total filtrados:', this.usuariosFiltrados.length);
  }

  public toggleShowInactive(): void {
    this.cargarUsuarios();
  }

  public showCreateUsuarioDialog(): void {
    this.modalMode = 'create';
    this.dataToEdit = null;
    this.currentEditingUserId = null;
    this.modalVisible = true;
  }

  public showEditUsuarioDialog(usuario: User): void {
    this.modalMode = 'edit';
    this.currentEditingUserId = usuario.user_id;
    this.dataToEdit = {
      name: usuario.user_name,
      email: usuario.user_email,
      role: usuario.user_rol,
      state: usuario.user_state
    };
    this.modalVisible = true;
  }

  public onModalSave(formData: UserFormData): void {
    if (this.modalMode === 'create') {
      this.crearUsuario(formData);
    } else {
      this.editarUsuario(formData);
    }
  }

  private crearUsuario(formData: UserFormData): void {
    // Validar duplicado de email
    const emailDuplicado = this.usuarios.some(
      (u: User) => u.user_email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );

    if (emailDuplicado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un usuario con ese email',
        life: 4000
      });
      return;
    }

    const userData = {
      user_name: formData.name,
      user_email: formData.email,
      user_password: formData.password,
      user_rol: formData.role,
      user_state: '1',
      user_uid: localStorage.getItem('store_id') || '1'
    };

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Usuario creado correctamente',
            life: 3000
          });
          this.cargarUsuarios();
          this.modalVisible = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes?.[0] || 'Error al crear usuario',
            life: 4000
          });
        }
      },
      error: (err) => {
        let errorMsg = 'Error al crear el usuario. Intenta nuevamente.';
        if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifica los campos.';
        } else if (err.status === 409) {
          errorMsg = 'Ya existe un usuario con ese email.';
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

  private editarUsuario(formData: UserFormData): void {
    if (!this.currentEditingUserId) return;

    const usuarioActual = this.usuarios.find(u => u.user_id === this.currentEditingUserId);
    if (!usuarioActual) return;

    // Validar si hay cambios
    const sinCambios = 
      usuarioActual.user_name === formData.name &&
      usuarioActual.user_email === formData.email &&
      String(usuarioActual.user_rol) === String(formData.role) &&
      String(usuarioActual.user_state) === String(formData.state);

    if (sinCambios) {
      this.modalVisible = false;
      return;
    }

    // Validar email duplicado (excluyendo el actual)
    const emailDuplicado = this.usuarios.some(
      (u: User) => u.user_id !== this.currentEditingUserId &&
                   u.user_email.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );

    if (emailDuplicado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe otro usuario con ese email',
        life: 4000
      });
      return;
    }

    const userData = {
      user_id: this.currentEditingUserId,
      user_name: formData.name,
      user_email: formData.email,
      user_rol: formData.role,
      user_state: formData.state,
      user_uid: usuarioActual.user_uid
    };

    this.userService.updateUser(userData).subscribe({
      next: (response) => {
        if (response.tipo === '1' || response.tipo === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: '¡Actualizado!',
            detail: 'Usuario modificado correctamente',
            life: 3000
          });
          this.cargarUsuarios();
          this.modalVisible = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensajes?.[0] || 'Error al actualizar usuario',
            life: 4000
          });
        }
      },
      error: (err) => {
        let errorMsg = 'Error al actualizar el usuario. Intenta nuevamente.';
        if (err.status === 400) {
          errorMsg = 'Datos inválidos. Verifica los campos.';
        } else if (err.status === 404) {
          errorMsg = 'Usuario no encontrado.';
        } else if (err.status === 409) {
          errorMsg = 'Ya existe un usuario con ese email.';
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

  public getRoleName(role: string | number): string {
    const roleStr = String(role);
    switch(roleStr) {
      case '1': return 'Administrador/Cajero';
      case '3': return 'Mesero/Mozo';
      case '4': return 'Cocinero';
      default: return 'Desconocido';
    }
  }

  public getStateLabel(state: string | number): string {
    return (state === '1' || state === 1) ? 'Activo' : 'Inactivo';
  }
}
