import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeParticipantePage } from './home-participante.page';

describe('HomeParticipantePage', () => {
  let component: HomeParticipantePage;
  let fixture: ComponentFixture<HomeParticipantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeParticipantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
