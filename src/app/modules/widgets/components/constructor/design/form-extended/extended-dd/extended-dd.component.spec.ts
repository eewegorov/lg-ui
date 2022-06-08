import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedDdComponent } from './extended-dd.component';

describe('ExtendedDdComponent', () => {
  let component: ExtendedDdComponent;
  let fixture: ComponentFixture<ExtendedDdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtendedDdComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
