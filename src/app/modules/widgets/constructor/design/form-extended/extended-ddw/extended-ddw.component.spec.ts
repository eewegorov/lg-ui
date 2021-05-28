import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedDdwComponent } from './extended-ddw.component';

describe('ExtendedDdwComponent', () => {
  let component: ExtendedDdwComponent;
  let fixture: ComponentFixture<ExtendedDdwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedDdwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedDdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
