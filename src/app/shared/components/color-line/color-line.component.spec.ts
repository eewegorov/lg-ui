import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColorLineComponent } from './color-line.component';

describe('HeaderLineComponent', () => {
  let component: ColorLineComponent;
  let fixture: ComponentFixture<ColorLineComponent>;

  beforeEach(waitForAsync(() => {
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
