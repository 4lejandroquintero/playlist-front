import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
  if (!this.username.trim() || !this.password.trim()) {
    this.errorMessage = 'Por favor ingresa usuario y contraseña';
    return;
  }

  this.authService.login(this.username, this.password).subscribe({
    next: (res) => {
      if(res) {
        console.log('Login exitoso', res);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    },
    error: (err) => {
      console.error('Error de login', err);
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  });
}
}
