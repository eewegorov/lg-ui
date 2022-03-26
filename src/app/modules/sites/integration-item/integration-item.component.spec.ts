import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationItemComponent } from './integration-item.component';

describe('IntegrationItemComponent', () => {
  let component: IntegrationItemComponent;
  let fixture: ComponentFixture<IntegrationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntegrationItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
