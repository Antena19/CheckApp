import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearEventoPage } from './crear-evento.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

describe('CrearEventoPage', () => {
  let component: CrearEventoPage;
  let fixture: ComponentFixture<CrearEventoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearEventoPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()], // Importar módulos necesarios
      providers: [
        { provide: Storage, useValue: new Storage() }, // Proveer una instancia de Storage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
