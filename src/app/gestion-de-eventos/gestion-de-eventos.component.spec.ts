import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

import { GestionDeEventosComponent } from './gestion-de-eventos.component';

describe('GestionDeEventosComponent', () => {
  let component: GestionDeEventosComponent;
  let fixture: ComponentFixture<GestionDeEventosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDeEventosComponent],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: Storage, useValue: new Storage() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionDeEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
