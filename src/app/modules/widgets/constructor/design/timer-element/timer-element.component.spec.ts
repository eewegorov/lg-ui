import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerElementComponent } from './timer-element.component';

describe('TimerElementComponent', () => {
  let component: TimerElementComponent;
  let fixture: ComponentFixture<TimerElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
