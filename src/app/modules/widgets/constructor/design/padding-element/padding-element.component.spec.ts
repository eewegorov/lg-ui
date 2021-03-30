import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaddingElementComponent } from './padding-element.component';

describe('PaddingElementComponent', () => {
  let component: PaddingElementComponent;
  let fixture: ComponentFixture<PaddingElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaddingElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaddingElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
