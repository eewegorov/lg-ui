import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbdDatepickerI18n } from './datepicker.component';

describe('DatepickerComponent', () => {
  let component: NgbdDatepickerI18n;
  let fixture: ComponentFixture<NgbdDatepickerI18n>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdDatepickerI18n ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdDatepickerI18n);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
