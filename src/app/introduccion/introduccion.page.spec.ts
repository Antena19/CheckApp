import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IntroduccionPage } from './introduccion.page';

describe('IntroduccionPage', () => {
  let component: IntroduccionPage;
  let fixture: ComponentFixture<IntroduccionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroduccionPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroduccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
