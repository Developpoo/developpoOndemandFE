import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseModalFilmComponent } from './database-modal-film.component';

describe('DatabaseModalFilmComponent', () => {
  let component: DatabaseModalFilmComponent;
  let fixture: ComponentFixture<DatabaseModalFilmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatabaseModalFilmComponent]
    });
    fixture = TestBed.createComponent(DatabaseModalFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
