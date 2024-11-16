import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroAsistenciaEventoPage } from './registro-asistencia-evento.page';

describe('RegistroAsistenciaEventoPage', () => {
  let component: RegistroAsistenciaEventoPage;
  let fixture: ComponentFixture<RegistroAsistenciaEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAsistenciaEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
