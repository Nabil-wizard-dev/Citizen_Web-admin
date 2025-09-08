import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAutorityComponent } from './add-autority.component';

describe('AddAutorityComponent', () => {
  let component: AddAutorityComponent;
  let fixture: ComponentFixture<AddAutorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAutorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAutorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
