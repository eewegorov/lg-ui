import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerizedItemComponent } from './containerized-item.component';

describe('ContainerizedItemComponent', () => {
  let component: ContainerizedItemComponent;
  let fixture: ComponentFixture<ContainerizedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerizedItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerizedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
