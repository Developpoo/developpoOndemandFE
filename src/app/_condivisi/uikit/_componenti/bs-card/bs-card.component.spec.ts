import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsCardComponent } from './bs-card.component';

describe('BsCardComponent', () => {
  let component: BsCardComponent;
  let fixture: ComponentFixture<BsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BsCardComponent]
    });
    fixture = TestBed.createComponent(BsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
