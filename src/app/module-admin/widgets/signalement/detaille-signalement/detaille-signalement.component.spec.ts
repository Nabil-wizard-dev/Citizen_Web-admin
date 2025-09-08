import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailleSignalementComponent } from './detaille-signalement.component';

describe('DetailleSignalementComponent', () => {
  let component: DetailleSignalementComponent;
  let fixture: ComponentFixture<DetailleSignalementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailleSignalementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailleSignalementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
