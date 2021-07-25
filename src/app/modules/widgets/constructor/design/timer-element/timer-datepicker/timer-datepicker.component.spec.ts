import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDatepickerComponent } from './timer-datepicker.component';

describe('TimerDatepickerComponent', () => {
  let component: TimerDatepickerComponent;
  let fixture: ComponentFixture<TimerDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
