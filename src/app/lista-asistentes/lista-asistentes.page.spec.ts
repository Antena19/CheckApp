import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ListaAsistentesPage } from './lista-asistentes.page';

describe('ListaAsistentesPage', () => {
  let component: ListaAsistentesPage;
  let fixture: ComponentFixture<ListaAsistentesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaAsistentesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Simular la propiedad params del ActivatedRoute
            params: of({ id: '123' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAsistentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
