import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorDesignComponent } from './constructor-design.component';

describe('ConstructorDesignComponent', () => {
  let component: ConstructorDesignComponent;
  let fixture: ComponentFixture<ConstructorDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
