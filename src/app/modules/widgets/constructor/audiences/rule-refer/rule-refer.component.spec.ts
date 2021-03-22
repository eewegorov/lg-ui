import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleReferComponent } from './rule-refer.component';

describe('RuleReferComponent', () => {
  let component: RuleReferComponent;
  let fixture: ComponentFixture<RuleReferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleReferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
