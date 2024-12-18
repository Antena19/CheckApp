import { TestBed } from '@angular/core/testing';

import { DatosEjemploService } from './datos-ejemplo.service';

describe('DatosEjemploService', () => {
  let service: DatosEjemploService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosEjemploService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
