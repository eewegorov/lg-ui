import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorLineComponent } from './color-line.component';

describe('HeaderLineComponent', () => {
  let component: ColorLineComponent;
  let fixture: ComponentFixture<ColorLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
