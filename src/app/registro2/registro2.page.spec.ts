import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Registro2Page } from './registro2.page';

describe('Registro2Page', () => {
  let component: Registro2Page;
  let fixture: ComponentFixture<Registro2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Registro2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
