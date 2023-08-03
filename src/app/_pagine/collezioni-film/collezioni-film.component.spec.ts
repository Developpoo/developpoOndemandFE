import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollezioniFilmComponent } from './collezioni-film.component';

describe('CollezioniFilmComponent', () => {
  let component: CollezioniFilmComponent;
  let fixture: ComponentFixture<CollezioniFilmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollezioniFilmComponent]
    });
    fixture = TestBed.createComponent(CollezioniFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
