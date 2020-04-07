import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbtestsActiveComponent } from './abtests-active.component';

describe('AbtestsActiveComponent', () => {
  let component: AbtestsActiveComponent;
  let fixture: ComponentFixture<AbtestsActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbtestsActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbtestsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
