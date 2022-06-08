import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedDatepickerComponent } from './extended-datepicker.component';

describe('ExtendedDatepickerComponent', () => {
  let component: ExtendedDatepickerComponent;
  let fixture: ComponentFixture<ExtendedDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtendedDatepickerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
