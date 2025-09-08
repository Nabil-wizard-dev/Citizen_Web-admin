import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOuvrierComponent } from './profile-ouvrier.component';

describe('ProfileOuvrierComponent', () => {
  let component: ProfileOuvrierComponent;
  let fixture: ComponentFixture<ProfileOuvrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileOuvrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOuvrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
