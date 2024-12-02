import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    // Verificar si el usuario está autenticado
    const isAuthenticated = await this.authService.verificarSesion();
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
