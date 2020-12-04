import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbtestAddComponent } from './abtest-add.component';

describe('AbtestAddComponent', () => {
  let component: AbtestAddComponent;
  let fixture: ComponentFixture<AbtestAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AbtestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbtestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
