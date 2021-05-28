import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedRatingComponent } from './extended-rating.component';

describe('ExtendedRatingComponent', () => {
  let component: ExtendedRatingComponent;
  let fixture: ComponentFixture<ExtendedRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
