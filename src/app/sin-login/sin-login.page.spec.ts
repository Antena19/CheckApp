import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinLoginPage } from './sin-login.page';

describe('SinLoginPage', () => {
  let component: SinLoginPage;
  let fixture: ComponentFixture<SinLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SinLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
