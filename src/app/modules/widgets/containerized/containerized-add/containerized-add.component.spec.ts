import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerizedAddComponent } from './containerized-add.component';

describe('ContainerizedAddComponent', () => {
  let component: ContainerizedAddComponent;
  let fixture: ComponentFixture<ContainerizedAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerizedAddComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerizedAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
