import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteItemComponent } from './site-item.component';

describe('SitesListComponent', () => {
  let component: SiteItemComponent;
  let fixture: ComponentFixture<SiteItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SiteItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
