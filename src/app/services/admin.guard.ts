import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AutenticacionService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const userRole = await this.authService.obtenerRol();
    if (userRole !== 'admin') {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
