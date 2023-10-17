import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmVideoComponent } from './film-video.component';

describe('FilmVideoComponent', () => {
  let component: FilmVideoComponent;
  let fixture: ComponentFixture<FilmVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilmVideoComponent]
    });
    fixture = TestBed.createComponent(FilmVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
