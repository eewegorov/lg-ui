import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartpointsControlComponent } from './smartpoints-control.component';

describe('SmartpointsControlComponent', () => {
  let component: SmartpointsControlComponent;
  let fixture: ComponentFixture<SmartpointsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartpointsControlComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartpointsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
