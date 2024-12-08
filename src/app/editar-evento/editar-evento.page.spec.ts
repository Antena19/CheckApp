import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEventoPage } from './editar-evento.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

describe('EditarEventoPage', () => {
  let component: EditarEventoPage;
  let fixture: ComponentFixture<EditarEventoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEventoPage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: Storage, useValue: new Storage() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
