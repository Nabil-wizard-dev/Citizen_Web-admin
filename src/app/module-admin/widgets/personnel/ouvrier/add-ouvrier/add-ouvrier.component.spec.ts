import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOuvrierComponent } from './add-ouvrier.component';

describe('AddOuvrierComponent', () => {
  let component: AddOuvrierComponent;
  let fixture: ComponentFixture<AddOuvrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddOuvrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOuvrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
