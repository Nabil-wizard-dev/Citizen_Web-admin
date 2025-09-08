import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesSignalementComponent } from './les-signalement.component';

describe('LesSignalementComponent', () => {
  let component: LesSignalementComponent;
  let fixture: ComponentFixture<LesSignalementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LesSignalementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesSignalementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
