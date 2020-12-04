import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteAddComponent } from './site-add.component';

describe('SiteAddComponent', () => {
  let component: SiteAddComponent;
  let fixture: ComponentFixture<SiteAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
