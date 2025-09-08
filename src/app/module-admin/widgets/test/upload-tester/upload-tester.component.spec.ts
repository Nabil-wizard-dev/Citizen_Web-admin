import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTesterComponent } from './upload-tester.component';

describe('UploadTesterComponent', () => {
  let component: UploadTesterComponent;
  let fixture: ComponentFixture<UploadTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadTesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
