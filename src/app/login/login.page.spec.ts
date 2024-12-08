import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NotificacionService } from '../services/notificacion.service';
import { DatosEjemploService } from '../services/datos-ejemplo.service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let autenticacionServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;
  let datosEjemploServiceSpy: jasmine.SpyObj<DatosEjemploService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    autenticacionServiceSpy = jasmine.createSpyObj('AutenticacionService', ['iniciarSesion']);
    notificacionServiceSpy = jasmine.createSpyObj('NotificacionService', ['mostrarMensaje']);
    datosEjemploServiceSpy = jasmine.createSpyObj('DatosEjemploService', ['cargarDatosEjemplo']);
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        IonicStorageModule.forRoot(), // Proveer el módulo de almacenamiento
      ],
      providers: [
        { provide: AutenticacionService, useValue: autenticacionServiceSpy },
        { provide: NotificacionService, useValue: notificacionServiceSpy },
        { provide: DatosEjemploService, useValue: datosEjemploServiceSpy },
        { provide: Storage, useValue: storageSpy }, // Proveer el espía del almacenamiento
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba 1: Verificar que la página se crea correctamente
  it('Debería crear la página correctamente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: Debería inicializar los usuarios de ejemplo al cargar el componente
  it('Debería inicializar los usuarios de ejemplo al cargar el componente', async () => {
    await component.ngOnInit();
    expect(datosEjemploServiceSpy.cargarDatosEjemplo).toHaveBeenCalled();
  });

  // Prueba 3: Debería actualizar los usuarios al entrar en la página de login
  it('Debería actualizar los usuarios al entrar a la página de login', async () => {
    const mockUsers = [
      { username: 'testUser', password: 'testPass', rut: '', nombreApellido: '', telefono: '', email: '' }
    ];
    storageSpy.get.and.returnValue(Promise.resolve(mockUsers));

    await component.ionViewWillEnter();
    expect(component.validUsers).toEqual(mockUsers);
  });

  // Prueba 4: Debería mostrar mensaje de éxito para credenciales válidas
  it('Debería mostrar "Inicio de sesión exitoso" para credenciales válidas', async () => {
    component.validUsers = [
      { username: 'testUser', password: 'testPass', rut: '', nombreApellido: '', telefono: '', email: '' }
    ];
    component.username = 'testUser';
    component.password = 'testPass';
    component.isAdmin = true;

    autenticacionServiceSpy.iniciarSesion.and.returnValue(Promise.resolve(true)); // Corregir el valor devuelto

    await component.login();

    expect(autenticacionServiceSpy.iniciarSesion).toHaveBeenCalledWith('testUser', 'testPass', 'admin');
    expect(notificacionServiceSpy.mostrarMensaje).toHaveBeenCalledWith('Éxito', 'Inicio de sesión exitoso', 'success');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  // Prueba 5: Debería mostrar mensaje de error para credenciales inválidas
  it('Debería mostrar "Usuario o contraseña inválidos" para credenciales incorrectas', async () => {
    component.validUsers = [
      { username: 'testUser', password: 'testPass', rut: '', nombreApellido: '', telefono: '', email: '' }
    ];
    component.username = 'wrongUser';
    component.password = 'wrongPass';

    await component.login();

    expect(notificacionServiceSpy.mostrarMensaje).toHaveBeenCalledWith('Error', 'Usuario o contraseña inválidos', 'error');
  });
});
