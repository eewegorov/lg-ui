import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDevicesComponent } from './rule-devices.component';

describe('RuleDevicesComponent', () => {
  let component: RuleDevicesComponent;
  let fixture: ComponentFixture<RuleDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
