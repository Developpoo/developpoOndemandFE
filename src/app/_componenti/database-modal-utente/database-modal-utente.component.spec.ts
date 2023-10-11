import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModalUtenteComponent } from './database-modal-utente.component';

describe('DatabaseModalUtenteComponent', () => {
  let component: DatabaseModalUtenteComponent;
  let fixture: ComponentFixture<DatabaseModalUtenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatabaseModalUtenteComponent]
    });
    fixture = TestBed.createComponent(DatabaseModalUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
