import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModalGenereComponent } from './database-modal-genere.component';

describe('DatabaseModalGenereComponent', () => {
  let component: DatabaseModalGenereComponent;
  let fixture: ComponentFixture<DatabaseModalGenereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatabaseModalGenereComponent]
    });
    fixture = TestBed.createComponent(DatabaseModalGenereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
