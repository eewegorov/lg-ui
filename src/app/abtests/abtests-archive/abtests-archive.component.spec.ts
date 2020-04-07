import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbtestsArchiveComponent } from './abtests-archive.component';

describe('AbtestsArchiveComponent', () => {
  let component: AbtestsArchiveComponent;
  let fixture: ComponentFixture<AbtestsArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbtestsArchiveComponent ]
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
