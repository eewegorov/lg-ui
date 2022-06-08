import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesGalleryComponent } from './templates-gallery.component';

describe('TemplatesGalleryComponent', () => {
  let component: TemplatesGalleryComponent;
  let fixture: ComponentFixture<TemplatesGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatesGalleryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
