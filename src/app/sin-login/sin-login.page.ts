import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sin-login',
  templateUrl: './sin-login.page.html',
  styleUrls: ['./sin-login.page.scss'],
})
export class SinLoginPage {
  constructor(private router: Router) {}

  // Navegar al formulario de registro
  goToCreateAccount() {
    this.router.navigate(['/registro']);
  }

  // Navegar al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
