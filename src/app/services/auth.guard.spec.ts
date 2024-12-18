import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AutenticacionService } from './autenticacion.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let autenticacionServiceSpy: jasmine.SpyObj<AutenticacionService>;

  beforeEach(() => {
    // Creamos espías para el Router y AutenticacionService
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    autenticacionServiceSpy = jasmine.createSpyObj('AutenticacionService', ['verificarSesion']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: AutenticacionService, useValue: autenticacionServiceSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  // Verificar que el guard se crea correctamente
  it('Debería crear el guard correctamente', () => {
    expect(guard).toBeTruthy();
  });

  // Verificar acceso permitido si el usuario está autenticado
  it('Debería permitir el acceso si el usuario está autenticado', async () => {
    autenticacionServiceSpy.verificarSesion.and.returnValue(Promise.resolve(true));

    const result = await guard.canActivate(null as any, null as any);
    expect(result).toBeTrue();
  });

  // Verificar redirección al login si el usuario no está autenticado
  it('Debería redirigir al login si el usuario no está autenticado', async () => {
    autenticacionServiceSpy.verificarSesion.and.returnValue(Promise.resolve(false));

    const result = await guard.canActivate(null as any, null as any);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(routerSpy.createUrlTree(['/login']));
  });
});
