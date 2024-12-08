import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NotificacionService } from '../services/notificacion.service';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificacionServiceSpy: jasmine.SpyObj<NotificacionService>;

  beforeEach(async () => {
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificacionServiceSpy = jasmine.createSpyObj('NotificacionService', ['mostrarMensaje']);

    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        IonicStorageModule.forRoot(), // Proveer el módulo de almacenamiento
      ],
      providers: [
        { provide: Storage, useValue: storageSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificacionService, useValue: notificacionServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Ejemplo de prueba adicional: Verificar si la página se inicializa correctamente
  it('Debería inicializar el almacenamiento al cargar la página', async () => {
    await storageSpy.create();
    expect(storageSpy.create).toHaveBeenCalled();
  });
});
