import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  verficarCredenciales(username: string, password: string): void {
    if (username === 'admin' && password === '123') {
      alert('Inicio de sesión exitoso');
      this.router.navigate(['admin']);

    } else {
      alert('Credenciales incorrectas');
    }

  }

}
