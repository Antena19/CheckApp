import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AutenticacionService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const userRole = await this.authService.obtenerRol();
    console.log(`Rol del usuario: ${userRole}`); // Depuración

    // Si no es admin, devuelve una UrlTree para redirigir a login
    if (userRole !== 'admin') {
      console.log('El rol del usuario no es administrador, redirigiendo al login...');
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}
