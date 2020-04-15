import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAddComponent } from './widget-add.component';

describe('WidgetAddComponent', () => {
  let component: WidgetAddComponent;
  let fixture: ComponentFixture<WidgetAddComponent>;

  beforeEach(async(() => {
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
