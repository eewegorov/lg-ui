import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleUrlComponent } from './rule-url.component';

describe('RuleUrlComponent', () => {
  let component: RuleUrlComponent;
  let fixture: ComponentFixture<RuleUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
