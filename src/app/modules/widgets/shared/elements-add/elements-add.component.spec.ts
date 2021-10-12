import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsAddComponent } from './elements-add.component';

describe('ElementsAddComponent', () => {
  let component: ElementsAddComponent;
  let fixture: ComponentFixture<ElementsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
