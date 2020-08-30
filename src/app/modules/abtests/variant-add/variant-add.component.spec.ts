import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantAddComponent } from './variant-add.component';

describe('VariantAddComponent', () => {
  let component: VariantAddComponent;
  let fixture: ComponentFixture<VariantAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
