import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorRulesComponent } from './constructor-rules.component';

describe('ConstructorRulesComponent', () => {
  let component: ConstructorRulesComponent;
  let fixture: ComponentFixture<ConstructorRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorRulesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
