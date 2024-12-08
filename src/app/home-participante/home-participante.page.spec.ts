import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

import { HomeParticipantePage } from './home-participante.page';

describe('HomeParticipantePage', () => {
  let component: HomeParticipantePage;
  let fixture: ComponentFixture<HomeParticipantePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeParticipantePage],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: Storage, useValue: new Storage() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeParticipantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
