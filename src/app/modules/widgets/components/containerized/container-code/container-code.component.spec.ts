import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCodeComponent } from './container-code.component';

describe('ContainerCodeComponent', () => {
  let component: ContainerCodeComponent;
  let fixture: ComponentFixture<ContainerCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerCodeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
