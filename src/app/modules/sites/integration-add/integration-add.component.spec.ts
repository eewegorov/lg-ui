import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationAddComponent } from './integration-add.component';

describe('IntegrationAddComponent', () => {
  let component: IntegrationAddComponent;
  let fixture: ComponentFixture<IntegrationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
