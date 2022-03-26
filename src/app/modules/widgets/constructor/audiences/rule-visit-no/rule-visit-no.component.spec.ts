import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleVisitNoComponent } from './rule-visit-no.component';

describe('RuleVisitNoComponent', () => {
  let component: RuleVisitNoComponent;
  let fixture: ComponentFixture<RuleVisitNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleVisitNoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleVisitNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
