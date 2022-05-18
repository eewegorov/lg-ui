import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbtestsArchiveComponent } from './abtests-archive.component';

describe('AbtestsArchiveComponent', () => {
  let component: AbtestsArchiveComponent;
  let fixture: ComponentFixture<AbtestsArchiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AbtestsArchiveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbtestsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
