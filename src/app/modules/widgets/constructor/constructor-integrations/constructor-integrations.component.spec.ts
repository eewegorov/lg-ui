import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorIntegrationsComponent } from './constructor-integrations.component';

describe('ConstructorIntegrationsComponent', () => {
  let component: ConstructorIntegrationsComponent;
  let fixture: ComponentFixture<ConstructorIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorIntegrationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
