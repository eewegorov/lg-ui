import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmElementComponent } from './crm-element.component';

describe('CrmElementComponent', () => {
  let component: CrmElementComponent;
  let fixture: ComponentFixture<CrmElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
