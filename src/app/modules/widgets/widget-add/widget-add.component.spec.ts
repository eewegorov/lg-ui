import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetAddComponent } from './widget-add.component';

describe('WidgetAddComponent', () => {
  let component: WidgetAddComponent;
  let fixture: ComponentFixture<WidgetAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
