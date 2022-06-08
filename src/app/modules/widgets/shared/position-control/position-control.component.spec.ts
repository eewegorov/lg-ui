import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionControlComponent } from './position-control.component';

describe('PositionControlComponent', () => {
  let component: PositionControlComponent;
  let fixture: ComponentFixture<PositionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionControlComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
