import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleVisitComponent } from './rule-visit.component';

describe('RuleVisitComponent', () => {
  let component: RuleVisitComponent;
  let fixture: ComponentFixture<RuleVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleVisitComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
