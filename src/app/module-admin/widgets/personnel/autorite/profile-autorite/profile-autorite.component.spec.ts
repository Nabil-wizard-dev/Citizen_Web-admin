import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAutoriteComponent } from './profile-autorite.component';

describe('ProfileAutoriteComponent', () => {
  let component: ProfileAutoriteComponent;
  let fixture: ComponentFixture<ProfileAutoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAutoriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAutoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
