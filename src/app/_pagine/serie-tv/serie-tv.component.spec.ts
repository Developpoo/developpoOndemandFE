import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieTVComponent } from './serie-tv.component';

describe('SerieTVComponent', () => {
  let component: SerieTVComponent;
  let fixture: ComponentFixture<SerieTVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieTVComponent]
    });
    fixture = TestBed.createComponent(SerieTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
