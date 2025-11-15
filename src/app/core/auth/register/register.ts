import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  username: string = '';
  password: string = '';
  correo: string = '';
  telefono: number = undefined as unknown as number;

  registrarUsuario(username: string, password: string) :void {
    alert(`Usuario ${username} registrado con éxito`);
  }

}
