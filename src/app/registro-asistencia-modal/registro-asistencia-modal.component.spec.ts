import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RegistroAsistenciaModalComponent } from './registro-asistencia-modal.component';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('RegistroAsistenciaModalComponent', () => {
  let component: RegistroAsistenciaModalComponent;
  let fixture: ComponentFixture<RegistroAsistenciaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroAsistenciaModalComponent],
      imports: [
        IonicModule.forRoot(),
        IonicStorageModule.forRoot() // Añadir módulo de almacenamiento para resolver el error de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroAsistenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
