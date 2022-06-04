import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerizedContainerComponent } from './containerized-container.component';

describe('ContainerizedContainerComponent', () => {
  let component: ContainerizedContainerComponent;
  let fixture: ComponentFixture<ContainerizedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerizedContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerizedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
